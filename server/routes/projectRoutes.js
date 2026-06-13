import express from "express";
import * as projectController from "../controllers/projectController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";

const router = express.Router();

router.get("/", isAuthenticated, isAuthorized("Admin"), projectController.getAllProjects);
router.get("/:projectId/files/:fileId/download", isAuthenticated, projectController.downloadFile);

export default router;