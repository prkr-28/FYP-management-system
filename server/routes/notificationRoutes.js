import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { isAuthorized } from '../middlewares/isAuthorized.js';

const router = express.Router();

router.get('/', isAuthenticated, getNotifications);
router.put('/mark-as-read/:notificationId', isAuthenticated, markAsRead);
router.put('/mark-all-as-read', isAuthenticated, markAllAsRead);
router.delete('/delete/:notificationId', isAuthenticated, deleteNotification);