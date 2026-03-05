import type { Request, Response } from "express";
import { Types } from "mongoose";
import { GetStagesQueryDto, StageIdParamDto } from "./stages.dto";
import { StageModel } from "../../DB/model/stage.model";
import { LearnerStageProgressModel } from "../../DB/model/learnerStageProgress.model";
import { LearnerLevelProgressModel } from "../../DB/model/learnerLevelProgress.model";
import { UserModel } from "../../DB/model/user.model";
import { StageRepository } from "../../DB/repositories/stage.repository";
import { LearnerStageProgressRepository } from "../../DB/repositories/learnerStageProgress.repository";
import { LearnerLevelProgressRepository } from "../../DB/repositories/learnerLevelProgress.repository";
import { userRepository } from "../../DB/repositories/user.repositiories";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/errors/error.response";

class StagesService {
  private _UserModel = new userRepository(UserModel);
  private _StageModel = new StageRepository(StageModel);
  private _LearnerStageProgressModel = new LearnerStageProgressRepository(
    LearnerStageProgressModel,
  );
  private _LearnerLevelProgressModel = new LearnerLevelProgressRepository(
    LearnerLevelProgressModel,
  );

  // ─────────────────────────────────────────────────────────────
  // GET /stages?language=en|ar
  // Returns all stages for the chosen language + the learner's
  // progress for each (null if they haven't started it yet).
  // ─────────────────────────────────────────────────────────────
  getStages = async (req: Request, res: Response): Promise<Response> => {
    const { language } = req.query as GetStagesQueryDto;
    const learnerId = req.user!._id;

    // 1. Fetch all stages for this language, sorted by order
    const stages = await this._StageModel.find({
      filter: { language },
      options: { sort: { order_index: 1 } },
    });

    if (!stages.length) {
      throw new NotFoundException("No stages found for this language");
    }

    // 2. Fetch all existing progress records for this learner in one query
    const stageIds = stages.map((s: any) => s._id);
    const progressRecords = await this._LearnerStageProgressModel.find({
      filter: {
        learner_id: learnerId,
        stage_id: { $in: stageIds },
      },
    });

    // 3. Map progress by stage_id string for O(1) lookup
    const progressMap = new Map(
      progressRecords.map((p: any) => [p.stage_id.toString(), p]),
    );

    // 4. Merge stages with their progress + locking logic
    const result = stages.map((stage: any) => {
      const progress: any = progressMap.get(stage._id.toString()) ?? null;

      //   let isLocked = false;
      //   if (index > 0) {
      //     const prevStageId = stages[index - 1]._id.toString();
      //     const prevProgress = progressMap.get(prevStageId);
      //     isLocked = !prevProgress || prevProgress.status !== "completed";
      //   }

      return {
        stage: {
          _id: stage._id,
          name: stage.name,
          language: stage.language,
          order_index: stage.order_index,
          total_levels: stage.total_levels,
        },
        // is_locked: isLocked,
        learner_progress: progress
          ? {
              status: progress.status,
              completed_levels: progress.completed_levels,
              progress: progress.progress,
            }
          : null,
      };
    });

    return res.status(200).json({
      message: "Stages fetched successfully",
      data: result,
    });
  };

  // ─────────────────────────────────────────────────────────────
  // POST /stages/:stageId/start
  // Called the first time a learner enters a stage.
  // If a progress record already exists, just returns it (idempotent).
  // ─────────────────────────────────────────────────────────────
  startStage = async (req: Request, res: Response): Promise<Response> => {
    const { stageId } = req.params as StageIdParamDto;
    const learnerId = req.user!._id;

    // 1. Verify stage exists
    const stage = await this._StageModel.findone({ filter: { _id: stageId } });
    if (!stage) {
      throw new NotFoundException("Stage not found");
    }

    // 2. Enforce stage order — previous stage must be completed before starting next
    if (stage.order_index > 1) {
      const previousStage = await this._StageModel.findone({
        filter: {
          language: stage.language,
          order_index: stage.order_index - 1,
        },
      });

      //   if (previousStage) {
      //     const previousProgress = await this._LearnerStageProgressModel.findone({
      //       filter: {
      //         learner_id: learnerId,
      //         stage_id: previousStage._id,
      //       },
      //     });

      //     if (!previousProgress || previousProgress.status !== "completed") {
      //       throw new BadRequestException(
      //         "You must complete the previous stage before starting this one",
      //       );
      //     }
      //   }
    }

    // 3. Idempotent — return existing if already started
    const existing = await this._LearnerStageProgressModel.findone({
      filter: { learner_id: learnerId, stage_id: stageId },
    });

    if (existing) {
      return res.status(200).json({
        data: {
          status: existing.status,
          completed_levels: existing.completed_levels,
          progress: existing.progress,
        },
      });
    }

    const stageProgress: any = await this._LearnerStageProgressModel.create({
      data: [
        {
          learner_id: learnerId,
          stage_id: new Types.ObjectId(stageId),
          status: "in_progress",
          completed_levels: 0,
          progress: 0,
        },
      ],
    });

    await this._UserModel.findOneAndUpdate({
      filter: { _id: learnerId },
      update: {
        $set: { tags: [...(req.user!.tags || []), `${stage.name}`] },
      },
    });

    return res.status(201).json({
      data: {
        status: stageProgress[0].status,
        completed_levels: stageProgress[0].completed_levels,
        progress: stageProgress[0].progress,
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // GET /stages/:stageId/levels
  // Returns all LearnerLevelProgress records for this learner in
  // this stage. Missing level_index = not started (Flutter handles).
  // ─────────────────────────────────────────────────────────────
  getLevelProgress = async (req: Request, res: Response): Promise<Response> => {
    const { stageId } = req.params as StageIdParamDto;
    const learnerId = req.user!._id;

    const stage = await this._StageModel.findone({ filter: { _id: stageId } });
    if (!stage) {
      throw new NotFoundException("Stage not found");
    }

    const levels = await this._LearnerLevelProgressModel.find({
      filter: { learner_id: learnerId, stage_id: stageId },
      options: { sort: { level_index: 1 } },
    });

    return res.status(200).json({
      message: "Level progress fetched successfully",
      data: levels.map((l: any) => ({
        level_index: l.level_index,
        status: l.status,
        attempts: l.attempts,
        accuracy: l.accuracy,
        best_accuracy: l.best_accuracy,
        completed_at: l.completed_at ?? null,
      })),
    });
  };

  // ─────────────────────────────────────────────────────────────
  // STATIC HELPER — called by SessionsService after a level ends.
  // Updates LearnerStageProgress then recalculates overall_progress
  // on the User document for the correct language.
  // ─────────────────────────────────────────────────────────────
  static updateStageAndOverallProgress = async (
    learnerId: Types.ObjectId,
    stageId: Types.ObjectId,
    language: "en" | "ar",
    totalLevels: number,
  ): Promise<void> => {
    const _UserModel = new userRepository(UserModel);
    const _StageModel = new StageRepository(StageModel);
    const _LearnerStageProgressModel = new LearnerStageProgressRepository(
      LearnerStageProgressModel,
    );
    const _LearnerLevelProgressModel = new LearnerLevelProgressRepository(
      LearnerLevelProgressModel,
    );

    // 1. Count completed levels in this stage
    const completedCount = await _LearnerLevelProgressModel.countDocuments({
      filter: { learner_id: learnerId, stage_id: stageId, status: "completed" },
    });

    const newProgress = completedCount / totalLevels;
    const stageCompleted = completedCount >= totalLevels;

    // 2. Update LearnerStageProgress
    await _LearnerStageProgressModel.findOneAndUpdate({
      filter: { learner_id: learnerId, stage_id: stageId },
      update: {
        $set: {
          completed_levels: completedCount,
          progress: newProgress,
          status: stageCompleted ? "completed" : "in_progress",
          updated_at: new Date(),
        },
      },
    });

    // 3. Get all stages for this language
    const allStagesInLanguage = await _StageModel.find({
      filter: { language },
    });
    const allStageIds = allStagesInLanguage.map((s: any) => s._id);

    // 4. Get all stage progress for overall progress calculation
    const allStageProgress = await _LearnerStageProgressModel.find({
      filter: { learner_id: learnerId, stage_id: { $in: allStageIds } },
    });

    const totalPossible = allStagesInLanguage.reduce(
      (sum: number, s: any) => sum + s.total_levels,
      0,
    );
    const totalCompleted = allStageProgress.reduce(
      (sum: number, sp: any) => sum + sp.completed_levels,
      0,
    );

    const overallProgress =
      totalPossible > 0 ? totalCompleted / totalPossible : 0;

    // 5. Get ALL level progress for this learner in this language
    //    to calculate average accuracy across every level they've played
    const allLevelProgress = await _LearnerLevelProgressModel.find({
      filter: {
        learner_id: learnerId,
        stage_id: { $in: allStageIds }, // only this language's stages
      },
    });

    // Average accuracy = sum of best_accuracy across all played levels
    //                    divided by number of played levels
    // We use best_accuracy not accuracy so a replay doesn't punish their average
    const averageAccuracy =
      allLevelProgress.length > 0
        ? allLevelProgress.reduce(
            (sum: number, l: any) => sum + l.best_accuracy,
            0,
          ) / allLevelProgress.length
        : 0;

    // 6. Update both overall_progress and average_accuracy on User in one call
    await _UserModel.findOneAndUpdate({
      filter: { _id: learnerId },
      update: {
        $set: {
          [`overall_progress.${language}`]: overallProgress,
          [`average_accuracy.${language}`]: averageAccuracy,
        },
      },
    });
  };
}

export default new StagesService();
export { StagesService };
