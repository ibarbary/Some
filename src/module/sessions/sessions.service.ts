import type { Request, Response } from "express";
import { Types } from "mongoose";
import { StartSessionDto, HeartbeatDto, EndSessionDto } from "./sessions.dto";
import { LearnerSessionModel } from "../../DB/model/learnerSession.model";
import { LearnerLevelProgressModel } from "../../DB/model/learnerLevelProgress.model";
import { LearnerStageProgressModel } from "../../DB/model/learnerStageProgress.model";
import { StageModel } from "../../DB/model/stage.model";
import { UserModel } from "../../DB/model/user.model";
import { LearnerSessionRepository } from "../../DB/repositories/learnerSession.repository";
import { LearnerLevelProgressRepository } from "../../DB/repositories/learnerLevelProgress.repository";
import { StageRepository } from "../../DB/repositories/stage.repository";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { StagesService } from "../stages/stages.service";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/errors/error.response";
import { LearnerStageProgressRepository } from "../../DB/repositories/learnerStageProgress.repository";
import { ACHIEVEMENTS } from "../../utils/achievements.constants";
import { ActivityLogModel } from "../../DB/model/activityLog.model";
import { ActivityLogRepository } from "../../DB/repositories/activityLog.repository";

// Gap threshold: if more than 60s passes between heartbeats,
// that gap is not counted toward duration (user was away).
const HEARTBEAT_GAP_THRESHOLD_SECONDS = 60;

interface IAwardedAchievement {
  key: string;
  name: string;
  earned_at: Date;
}

class SessionsService {
  private _UserModel = new userRepository(UserModel);
  private _StageModel = new StageRepository(StageModel);
  private _LearnerSessionModel = new LearnerSessionRepository(
    LearnerSessionModel,
  );
  private _LearnerLevelProgressModel = new LearnerLevelProgressRepository(
    LearnerLevelProgressModel,
  );
  private _LearnerStageProgressModel = new LearnerStageProgressRepository(
    LearnerStageProgressModel,
  );
  private _ActivityLogModel = new ActivityLogRepository(ActivityLogModel);

  startSession = async (req: Request, res: Response): Promise<Response> => {
    const { stage_id, level_index }: StartSessionDto = req.body;
    const learnerId = req.user!._id;

    // 1. Verify stage exists and level_index is in range
    const stage = await this._StageModel.findone({ filter: { _id: stage_id } });
    if (!stage) {
      throw new NotFoundException("Stage not found");
    }

    if (level_index > stage.total_levels) {
      throw new BadRequestException(
        `level_index ${level_index} exceeds total levels (${stage.total_levels}) for this stage`,
      );
    }

    // 2. Auto-abandon any existing active session (edge case: Flutter failed to call /end)
    const existingActive = await this._LearnerSessionModel.findone({
      filter: { learner_id: learnerId, status: "active" },
    });

    if (existingActive) {
      const now = new Date();
      const elapsed =
        (now.getTime() - existingActive.last_active_at.getTime()) / 1000;

      if (elapsed <= HEARTBEAT_GAP_THRESHOLD_SECONDS) {
        existingActive.duration_seconds += elapsed;
      }
      existingActive.status = "abandoned";
      existingActive.ended_at = now;
      await existingActive.save();

      // Still count partial time toward total study seconds
      await this._UserModel.findOneAndUpdate({
        filter: { _id: learnerId },
        update: {
          $inc: { total_study_seconds: existingActive.duration_seconds },
        },
      });
    }

    // 3. Create new session
    const sessions: any = await this._LearnerSessionModel.create({
      data: [
        {
          learner_id: learnerId,
          stage_id: new Types.ObjectId(stage_id),
          level_index,
          status: "active",
          duration_seconds: 0,
          started_at: new Date(),
          last_active_at: new Date(),
        },
      ],
    });

    return res.status(201).json({
      message: "Session started",
      data: { session_id: sessions[0]._id },
    });
  };

  heartbeat = async (req: Request, res: Response): Promise<Response> => {
    const { session_id }: HeartbeatDto = req.body;
    const learnerId = req.user!._id;

    const session = await this._LearnerSessionModel.findone({
      filter: { _id: session_id, learner_id: learnerId },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.status !== "active") {
      throw new BadRequestException(
        `Cannot heartbeat a session with status '${session.status}'`,
      );
    }

    const now = new Date();
    const elapsed = (now.getTime() - session.last_active_at.getTime()) / 1000;

    if (elapsed <= HEARTBEAT_GAP_THRESHOLD_SECONDS) {
      // User was actively playing so count this time
      session.duration_seconds += elapsed;
    }
    // else: gap too long, user was away so skip this gap, just reset clock

    session.last_active_at = now;
    await session.save();

    return res.status(200).json({ message: "Heartbeat received" });
  };

  endSession = async (req: Request, res: Response): Promise<Response> => {
    const { session_id, accuracy, completed }: EndSessionDto = req.body;
    const learnerId = req.user!._id;

    // 1. Find session and verify ownership
    const session = await this._LearnerSessionModel.findone({
      filter: { _id: session_id, learner_id: learnerId },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.status !== "active") {
      throw new BadRequestException(
        `Session is already '${session.status}' — cannot end it again`,
      );
    }

    // 2. Finalize duration — add remaining time since last heartbeat
    const now = new Date();
    const elapsed = (now.getTime() - session.last_active_at.getTime()) / 1000;

    if (elapsed <= HEARTBEAT_GAP_THRESHOLD_SECONDS) {
      session.duration_seconds += elapsed;
    }

    session.ended_at = now;
    session.status = completed ? "completed" : "abandoned";
    await session.save();

    // 3. Always add study time regardless of completion
    await this._UserModel.findOneAndUpdate({
      filter: { _id: learnerId },
      update: { $inc: { total_study_seconds: session.duration_seconds } },
    });

    // 4. If abandoned — stop here, no progress updates
    if (!completed) {
      return res.status(200).json({
        message: "Session ended",
        data: {
          duration_seconds: Math.round(session.duration_seconds),
          completed: false,
        },
      });
    }

    // COMPLETED FLOW

    // 5. Fetch stage for total_levels + language
    const stage = await this._StageModel.findone({
      filter: { _id: session.stage_id },
    });
    if (!stage) {
      throw new NotFoundException("Stage not found");
    }

    // 6. Upsert LearnerLevelProgress
    const existingLevel = await this._LearnerLevelProgressModel.findone({
      filter: {
        learner_id: learnerId,
        stage_id: session.stage_id,
        level_index: session.level_index,
      },
    });

    const isFirstCompletion =
      !existingLevel || existingLevel.status !== "completed";

    let levelProgress;

    if (existingLevel) {
      existingLevel.attempts += 1;
      existingLevel.accuracy = accuracy;
      existingLevel.best_accuracy = Math.max(
        existingLevel.best_accuracy,
        accuracy,
      );
      if (isFirstCompletion) {
        existingLevel.status = "completed";
        existingLevel.completed_at = now;
      }
      existingLevel.updated_at = now;
      levelProgress = await existingLevel.save();
    } else {
      const created: any = await this._LearnerLevelProgressModel.create({
        data: [
          {
            learner_id: learnerId,
            stage_id: session.stage_id,
            level_index: session.level_index,
            status: "completed",
            attempts: 1,
            accuracy,
            best_accuracy: accuracy,
            completed_at: now,
            updated_at: now,
          },
        ],
      });
      levelProgress = created[0];
    }

    // 7. Update stage progress + overall progress
    // Only on first completion — replaying a completed level doesn't change counts
    if (isFirstCompletion) {
      await StagesService.updateStageAndOverallProgress(
        learnerId,
        session.stage_id,
        stage.language,
        stage.total_levels,
      );
    }

    // 8. Update streak
    await this._updateStreak(learnerId);

    // 9. Fetch updated stage progress to return to Flutter

    const updatedStageProgress = await this._LearnerStageProgressModel.findone({
      filter: { learner_id: learnerId, stage_id: session.stage_id },
    });

    // 10. Check and award achievements
    const newAchievements = await this._checkAchievements(
      learnerId,
      accuracy,
      isFirstCompletion,
      stage,
      session,
    );

    // 11. Log activity
    await this._logActivity(
      learnerId,
      req.user!.parentId, // parent_id from the authenticated user
      stage,
      session,
      accuracy,
      updatedStageProgress,
      newAchievements,
      isFirstCompletion,
    );

    // 12. Fetch updated user stats
    // const updatedUser = await this._UserModel.findone({
    //   filter: { _id: learnerId },
    //   select:
    //     "total_study_seconds current_streak_days longest_streak_days overall_progress",
    // });

    return res.status(200).json({
      message: "Session completed",
      data: {
        duration_seconds: Math.round(session.duration_seconds),
        level_progress: {
          level_index: levelProgress.level_index,
          status: levelProgress.status,
          attempts: levelProgress.attempts,
          accuracy: levelProgress.accuracy,
          best_accuracy: levelProgress.best_accuracy,
        },
        stage_progress: updatedStageProgress
          ? {
              status: updatedStageProgress.status,
              completed_levels: updatedStageProgress.completed_levels,
              progress: updatedStageProgress.progress,
            }
          : null,
        achievements: newAchievements,
      },
    });
  };

  private _updateStreak = async (learnerId: any): Promise<void> => {
    const user = await this._UserModel.findone({
      filter: { _id: learnerId },
      select: "last_study_date current_streak_days longest_streak_days",
    });
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStudy = user.last_study_date
      ? new Date(user.last_study_date)
      : null;
    if (lastStudy) lastStudy.setHours(0, 0, 0, 0);

    let newStreak = user.current_streak_days;

    if (lastStudy?.getTime() === today.getTime()) {
      // Already studied today — no change
    } else if (lastStudy?.getTime() === yesterday.getTime()) {
      // Studied yesterday — extend streak
      newStreak += 1;
    } else {
      // Gap — reset to 1
      newStreak = 1;
    }

    const newLongest = Math.max(user.longest_streak_days, newStreak);

    await this._UserModel.findOneAndUpdate({
      filter: { _id: learnerId },
      update: {
        $set: {
          current_streak_days: newStreak,
          longest_streak_days: newLongest,
          last_study_date: new Date(),
        },
      },
    });
  };

  private _checkAchievements = async (
    learnerId: Types.ObjectId,
    accuracy: number,
    isFirstCompletion: boolean,
    stage: any,
    session: any,
  ): Promise<IAwardedAchievement[]> => {
    const user = await this._UserModel.findone({ filter: { _id: learnerId } });
    if (!user) return [];

    const existingKeys = new Set(user.achievements.map((a: any) => a.key));
    const toAward: IAwardedAchievement[] = [];

    const add = (achievement: { key: string; name: string }) => {
      if (!existingKeys.has(achievement.key)) {
        toAward.push({ ...achievement, earned_at: new Date() });
        existingKeys.add(achievement.key); // prevent double-awarding in same call
      }
    };

    // FIRST_STEP — first level ever completed across all stages/languages
    if (isFirstCompletion) {
      const totalLevelsCompleted =
        await this._LearnerLevelProgressModel.countDocuments({
          filter: { learner_id: learnerId, status: "completed" },
        });
      if (totalLevelsCompleted === 1) {
        add(ACHIEVEMENTS.FIRST_STEP);
      }
    }

    // PERFECT_SCORE — 100% accuracy on any level (can only earn once)
    if (accuracy >= 1.0) {
      add(ACHIEVEMENTS.PERFECT_SCORE);
    }

    // FAST_LEARNER — completed all levels in a stage for the first time
    if (isFirstCompletion) {
      const stageCompleted = await this._LearnerStageProgressModel.findone({
        filter: {
          learner_id: learnerId,
          stage_id: session.stage_id,
          status: "completed",
        },
      });
      if (stageCompleted) {
        add(ACHIEVEMENTS.FAST_LEARNER);
      }
    }

    // STREAK_7 and STREAK_30 — checked after _updateStreak runs (step 8)
    const freshUser = await this._UserModel.findone({
      filter: { _id: learnerId },
      select: "current_streak_days",
    });
    if (freshUser?.current_streak_days >= 7) add(ACHIEVEMENTS.STREAK_7);
    if (freshUser?.current_streak_days >= 30) add(ACHIEVEMENTS.STREAK_30);

    // Save all new achievements in one update
    if (toAward.length > 0) {
      await this._UserModel.findOneAndUpdate({
        filter: { _id: learnerId },
        update: {
          $set: { achievements: [...user.achievements, ...toAward] },
        },
      });
    }

    return toAward;
  };

  private _logActivity = async (
    learnerId: Types.ObjectId,
    parentId: Types.ObjectId | undefined,
    stage: any,
    session: any,
    accuracy: number,
    stageProgress: any,
    newAchievements: IAwardedAchievement[],
    isFirstCompletion: boolean,
  ): Promise<void> => {
    const logs: any[] = [];

    // 1. Level completed or replayed
    logs.push({
      learner_id: learnerId,
      parent_id: parentId ?? null,
      type: "level_completed",
      description: isFirstCompletion
        ? `Completed Level ${session.level_index} of ${stage.name}`
        : `Replayed Level ${session.level_index} of ${stage.name}`,
      metadata: {
        stage_name: stage.name,
        level_index: session.level_index,
        accuracy,
        is_first_completion: isFirstCompletion,
      },
      created_at: new Date(),
    });

    // 2. Stage completed — only if just finished for the first time
    if (isFirstCompletion && stageProgress?.status === "completed") {
      logs.push({
        learner_id: learnerId,
        parent_id: parentId ?? null,
        type: "stage_completed",
        description: `Completed the ${stage.name} stage`,
        metadata: { stage_name: stage.name },
        created_at: new Date(),
      });
    }

    // 3. One log per achievement earned this session
    for (const achievement of newAchievements) {
      logs.push({
        learner_id: learnerId,
        parent_id: parentId ?? null,
        type: "achievement_earned",
        description: `Earned the "${achievement.name}" achievement`,
        metadata: { achievement_key: achievement.key },
        created_at: new Date(),
      });
    }

    await this._ActivityLogModel.create({ data: logs });
  };
}

export default new SessionsService();
