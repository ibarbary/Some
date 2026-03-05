"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const user_model_1 = require("../../DB/model/user.model");
const stage_model_1 = require("../../DB/model/stage.model");
const learnerStageProgress_model_1 = require("../../DB/model/learnerStageProgress.model");
const stage_repository_1 = require("../../DB/repositories/stage.repository");
const learnerStageProgress_repository_1 = require("../../DB/repositories/learnerStageProgress.repository");
const error_response_1 = require("../../utils/errors/error.response");
class UserService {
    _UserModel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    _StageModel = new stage_repository_1.StageRepository(stage_model_1.StageModel);
    _LearnerStageProgressModel = new learnerStageProgress_repository_1.LearnerStageProgressRepository(learnerStageProgress_model_1.LearnerStageProgressModel);
    getMe = async (req, res) => {
        const learnerId = req.user._id;
        // Get all stage progress records for this user
        const stageProgressRecords = await this._LearnerStageProgressModel.find({
            filter: { learner_id: learnerId },
        });
        let stages = [];
        if (stageProgressRecords.length) {
            // Get the actual stage details for those progress records only
            const stageIds = stageProgressRecords.map((sp) => sp.stage_id);
            const stageDetails = await this._StageModel.find({
                filter: { _id: { $in: stageIds } },
                options: { sort: { order_index: 1 } },
            });
            // Merge stage info with progress
            const stageMap = new Map(stageProgressRecords.map((sp) => [sp.stage_id.toString(), sp]));
            stages = stageDetails.map((stage) => {
                const progress = stageMap.get(stage._id.toString());
                return {
                    _id: stage._id,
                    name: stage.name,
                    language: stage.language,
                    order_index: stage.order_index,
                    total_levels: stage.total_levels,
                    status: progress?.status,
                    completed_levels: progress?.completed_levels,
                    progress: progress?.progress,
                };
            });
        }
        // Strip sensitive fields before returning
        const user = req.user.toObject();
        delete user.password;
        delete user.confirmEmailOtp;
        delete user.forgetPasswordOtp;
        delete user.forgetPasswordOtpExpires;
        delete user.changeCredentialsTime;
        return res.status(200).json({
            message: "Profile fetched successfully",
            data: { ...user, stages },
        });
    };
    updateMe = async (req, res) => {
        const { name, username, birthdate, profileImage } = req.body;
        if (username) {
            const taken = await this._UserModel.findone({ filter: { username } });
            // Make sure it's not taken by someone else
            if (taken && taken._id.toString() !== req.user._id.toString()) {
                throw new error_response_1.BadRequestException("Username is already taken");
            }
        }
        const updated = await this._UserModel.findOneAndUpdate({
            filter: { _id: req.user._id },
            update: {
                $set: {
                    ...(name && { name }),
                    ...(username && { username }),
                    ...(birthdate && { birthdate }),
                    ...(profileImage && { profileImage }),
                },
            },
            options: { new: true },
        });
        const user = updated.toObject();
        delete user.password;
        delete user.confirmEmailOtp;
        delete user.forgetPasswordOtp;
        delete user.forgetPasswordOtpExpires;
        delete user.changeCredentialsTime;
        return res.status(200).json({
            message: "Profile updated successfully",
            data: user,
        });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map