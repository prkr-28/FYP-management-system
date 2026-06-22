import express from 'express';
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { createDeadline } from '../controllers/deadlineController.js';

const router = express.Router();

router.post('/create-deadline/:id', isAuthenticated, isAuthorized("Teacher"), createDeadline);

export default router;