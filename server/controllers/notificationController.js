import NotificationModel from "../models/NotificationModel.js";

export const getAdminNotifications = async (req, res) => {
    try {
        const unreadOnly = req.query.unreadOnly === 'true';
        const limit = Number(req.query.limit) || 20;

        const filter = unreadOnly ? { isRead: false } : {};

        const notifications = await NotificationModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit);

        const unreadCount = await NotificationModel.countDocuments({ isRead: false });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.log("getAdminNotifications error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.log("markNotificationAsRead error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await NotificationModel.updateMany(
            { isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.log("markAllNotificationsAsRead error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};