import { asyncHandler } from '../middlewares/assyncHandler.js';
import ErrorHandler from '../middlewares/error.js';
import { Notification } from '../models/notificationModel.js';

export const getNotifications = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const role = req.user.role;

    let query = {};
    if (role === 'Admin') {
        query.type = { $in: ['request'] };
    } else {
        query.user = userId;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    const unreadOnly = notifications.filter(notification => !notification.isRead);
    const readOnly = notifications.filter(notification => notification.isRead);

    const highPriorityMessages = notifications.filter(notification => notification.priority === "high");

    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    const thisWeekNotifications = notifications.filter(notification => {
        const createdAt = new Date(notification.createdAt);
        return createdAt >= startOfWeek && createdAt <= endOfWeek;
    });
    res.status(200).json({
        success: true,
        data: { notifications, unreadOnly: unreadOnly.length, readOnly: readOnly.length, highPriorityMessages: highPriorityMessages.length, thisWeekNotifications: thisWeekNotifications.length },
        message: "Notifications retrieved successfully",
    });
});

export const markAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await notificationServices.markAsRead(notificationId, userId);
    if (!notification) {
        return next(new ErrorHandler("Notification not found or you are not authorized to mark this notification as read", 403));
    }
    return res.status(200).json({
        success: true, data: { notification },
        message: "Notification marked as read successfully",
        data: { notification },
    });
});

export const markAllAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    await notificationServices.markAllAsRead(userId);
    return res.status(200).json({
        success: true,
        message: "All notifications marked as read successfully",
    });
});

export const deleteNotification = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { notificationId } = req.params;
    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
        return next(new ErrorHandler("Notification not found or you are not authorized to delete this notification", 403));
    }
    await notification.remove();
    return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
    });
});