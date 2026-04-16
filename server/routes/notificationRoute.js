import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
    getAdminNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/admin", protect, adminOnly, getAdminNotifications);
notificationRouter.patch("/admin/:notificationId/read", protect, adminOnly, markNotificationAsRead);
notificationRouter.patch("/admin/read-all", protect, adminOnly, markAllNotificationsAsRead);

export default notificationRouter;