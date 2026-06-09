import { Notification } from "../models/notificationModel.js";

export const createNotification = async (notificationData) => {
    const newNotification = await Notification.create(notificationData);
    return await newNotification.save();
}

export const notifyUser = async (userId, message, type = "general", link = null, priority = "low") => {
    const notificationData = {
        user: userId,
        message,
        type,
        link,
        priority
    };
    return await createNotification(notificationData);
};

export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
        return null;
    }
    notification.isRead = true;
    return await notification.save();
};

export const markAllAsRead = async (userId) => {
    return await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
};