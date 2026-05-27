import { Project } from "../models/Project.js";

export const getProjectByStudentId = async (studentId) => {
    const project = await Project.findOne({ student: studentId }).sort({ createdAt: -1 });
    return { project };
};