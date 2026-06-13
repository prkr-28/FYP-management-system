import * as ProjectService from "../services/projectServices.js";
import * as FileService from "../services/fileServices.js";
import { asyncHandler } from "../middlewares/assyncHandler.js";
import ErrorHandler from "../middlewares/error.js";


export const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectService.getAllProjects();
    res.status(200).json({
        success: true,
        data: projects
    });
});

export const downloadFile = asyncHandler(async (req, res, next) => {
    const { projectId, fileId } = req.params;
    const user = req.user._id;

    const project = await ProjectService.getProjectById(projectId);

    const userRole = (user.role || "").toLowerCase();

    const userId = user._id.toString();

    const hasAccess = user.role == "admin" || project?.student._id.toString() === userId || (project?.supervisor && project?.supervisor._id.toString() === userId);

    if (!project || !hasAccess) {
        return next(new ErrorHandler("Project not found or you are not authorized to download files for this project", 403));
    }

    const file = project.files._id(fileId);
    if (!file) {
        return next(new ErrorHandler("File not found", 404));
    }
    FileService.streamDownload(file.path, file.originalName, res);
});