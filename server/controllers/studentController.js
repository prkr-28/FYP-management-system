import { asyncHandler } from "../middlewares/assyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userModel.js";
import { Project } from "../models/projectModel.js";
import { SupervisorRequest } from "../models/supervisorRequestModel.js";
import { Notification } from "../models/notificationModel.js";
import * as userServices from "../services/userServices.js";
import * as projectServices from "../services/projectServices.js";
import * as requestServices from "../services/requestServices.js";
import * as notificationService from "../services/notificationServices.js";
import * as fileservices from "../services/fileServices.js";


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

    if (project && project.status === "rejected") {
        await Project.findByIdAndDelete(project._id);
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

    if (!project || project.student._id.toString() !== studentId.toString()) {
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
    const supervisors = await User.find({ role: "Teacher" }).select("name email department expertise assignedStudents maxStudents").lean();
    return res.status(200).json({
        success: true,
        data: { supervisors },
        message: "Available supervisors retrieved successfully",
    });
});

export const getSupervisor = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const student = await User.findById(studentId).populate("supervisor", "name email department expertise");

    if (!student.supervisor) {
        return res.status(200).json({
            success: true,
            data: { supervisor: null },
            message: "No supervisor assigned yet",
        });
    }
    return res.status(200).json({
        success: true,
        data: { supervisor: student.supervisor },
        message: "Supervisor retrieved successfully",
    });
});

export const requestSupervisor = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const { teacherId, message } = req.body;

    const student = await User.findById(studentId);
    if (student.supervisor) {
        return next(new ErrorHandler("You already have a supervisor assigned.", 400));
    }

    const supervisor = await User.findById(teacherId);
    if (!supervisor || supervisor.role !== "Teacher") {
        return next(new ErrorHandler("Supervisor not found", 404));
    }

    if (supervisor.assignedStudents.length >= supervisor.maxStudents) {
        return next(new ErrorHandler("Supervisor has reached maximum student capacity", 400));
    }

    const requestedData = {
        student: studentId,
        supervisor: teacherId,
        message,
    }

    const request = await requestServices.createRequest(requestedData);
    await notificationService.notifyUser(teacherId, `${student.name} has requested ${supervisor.name} as their supervisor.`, "request", "/teacher/requests", "medium");

    return res.status(200).json({
        success: true,
        data: { request },
        message: "Supervisor request sent successfully",
    });

});

export const getDashBoardStats = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    // Implement dashboard stats logic here
    const project = await Project.findOne({ student: studentId }).sort({ createdAt: -1 }).populate("supervisor", "name").lean();

    const now = new Date();
    const upcomingDeadLine = await Project.find({
        student: studentId,
        deadline: { $gte: now },
    })
        .select("title description")
        .sort({ deadline: 1 })
        .limit(3)
        .lean();

    const topNotifications = await Notification.find({ user: studentId }).populate("user", "name").sort({ createdAt: -1 }).limit(3).lean();

    const feedBackNotifications = project?.feedback && project.feedback.length > 0 ? project.feedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2) : [];

    const supervisorName = project?.supervisor?.name || "N/A";

    return res.status(200).json({
        success: true,
        data: {
            project,
            upcomingDeadLine,
            topNotifications,
            feedBackNotifications,
            supervisorName,
        },
        message: "Dashboard stats retrieved successfully",
    });
});

export const getFeedBack = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const { projectId } = req.params;

    const project = await projectServices.getProjectById(projectId);

    if (
        !project ||
        !project.student ||
        project.student._id.toString() !== studentId.toString()
    ) {
        return next(
            new ErrorHandler(
                "Project not found or you are not authorized to view feedback for this project",
                403
            )
        );
    }

    const sortedFeedback = [...project.feedback];

    return res.status(200).json({
        success: true,
        data: { feedback: sortedFeedback },
        message: "Feedback retrieved successfully",
    });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
    const studentId = req.user._id;
    const { projectId, fileId } = req.params;
    const project = await projectServices.getProjectById(projectId);

    // FIX: populated student is an object, compare ._id not the object itself
    if (!project || project.student._id.toString() !== studentId.toString()) {
        return next(new ErrorHandler("Project not found or you are not authorized to download files for this project", 403));
    }

    const file = project.files.id(fileId);

    if (!file) {
        return next(new ErrorHandler("File not found", 404));
    }
    fileservices.streamDownload(file.fileUrl, file.originalName, res);
});
