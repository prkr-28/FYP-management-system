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
