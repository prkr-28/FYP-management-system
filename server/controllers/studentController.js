import { asyncHandler } from "../middlewares/assyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userModel.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js";


export const getStudentProject = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;

    const project = await projectServices.getProjectByStudentId(studentId);

    if (!project) {
        return res.status(404).json({
            success: false,
            data: { project: null },
            message: "No project found for the student",
        });
    }
    return res.status(200).json({
        success: true,
        data: { project },
    });
});

export const submitProposal = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const studentId = req.user._id;

    const project = await projectServices.submitProposal(studentId, title, description);

    return res.status(201).json({
        success: true,
        data: { project },
    });
});