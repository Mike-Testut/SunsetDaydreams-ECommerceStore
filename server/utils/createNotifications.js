import NotificationModel from "../models/NotificationModel.js";

export const createNotification = async ({
                                             type,
                                             title,
                                             message,
                                             link = "",
                                             metadata = {},
                                         }) => {
    return NotificationModel.create({
        type,
        title,
        message,
        link,
        metadata,
    });
};