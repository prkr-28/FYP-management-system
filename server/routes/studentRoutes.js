import express from "express";
import {
    getStudentProject,
    submitProposal,
    uploadFiles,
    getAvailableSupervisors
} from "../controllers/studentController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { handleUploadError, upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/project", isAuthenticated, isAuthorized("Student"), getStudentProject);
router.post("/project-proposal", isAuthenticated, isAuthorized("Student"), submitProposal);
router.post("/upload/:projectId", isAuthenticated, isAuthorized("Student"), upload.array("files", 10), handleUploadError, uploadFiles);
router.get("/supervisors", isAuthenticated, isAuthorized("Student"), getAvailableSupervisors);

export default router;