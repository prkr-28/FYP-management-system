import express from "express";
import { forgetPassword, getUser, login, logout, registerUser, resetPassword } from "../controllers/authController.js";
import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', isAuthenticated, getUser);
router.get('/logout', isAuthenticated, logout);
router.post('/password/forget', forgetPassword);
router.put('/password/reset/:token', resetPassword);

export default router;