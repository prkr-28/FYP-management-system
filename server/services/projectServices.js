import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectModel.js";

export const getProjectByStudentId = async (studentId) => {
    const project = await Project.findOne({ student: studentId }).sort({ createdAt: -1 });
    return project; // return the document (or null) directly
};

export const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId).populate("student", "name email").populate("supervisor", "name email");
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    return project;
};

export const createProject = async (projectData) => {
    const project = await Project.create(projectData);
    return project;
};

export const addFilesToProject = async (projectId, files) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ErrorHandler("Project not found", 404);
    }
    const fileData = files.map((file) => ({
        fileType: file.mimetype,
        fileUrl: file.path,
        originalName: file.originalname,
        size: file.size,          // FIX: schema field is "size", not "fileSize"
        uploadedAt: new Date(),
    }));
    project.files.push(...fileData);
    await project.save();
    return project;
};

export const getAllProjects = async () => {
    const projects = await Project.find();
    return projects;
};