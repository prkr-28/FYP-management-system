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
            success: true,
            data: { project: null },
            message: "No project found for the student",
        });
    }
    return res.status(200).json({
        success: true,
        data: { project },
        message: "Project found successfully",
    });
});

export const submitProposal = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const studentId = req.user._id;

    const project = await projectServices.getProjectByStudentId(studentId);
    if (project && project.status !== "rejected") {
        return next(new ErrorHandler("You have already an active proposal. You can submit a new one only after the current one is rejected.", 400));
    }

    const projectData = {
        title,
        description,
        student: studentId,
    };
    const newProject = await projectServices.createProject(projectData);
    await User.findByIdAndUpdate(studentId, { projects: newProject._id });
    return res.status(201).json({
        success: true,
        data: { project: newProject },
        message: "Proposal submitted successfully",
    });
});

export const uploadFiles = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const { projectId } = req.params;
    const project = await projectServices.getProjectById(projectId);

    if (!project || project.student.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or you are not authorized to upload files for this project", 403));
    }
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("No files uploaded", 400));
    }
    const updatedProject = await projectServices.addFilesToProject(projectId, req.files);
    return res.status(200).json({
        success: true,
        data: { project: updatedProject },
        message: "Files uploaded successfully",
    });
});

export const getAvailableSupervisors = asyncHandler(async (req, res, next) => {
    const supervisors = await User.find({ role: "supervisor" }).select("name email department expertise assignedStudents maxStudents").lean();
    return res.status(200).json({
        success: true,
        data: { supervisors },
        message: "Available supervisors retrieved successfully",
    });
});
