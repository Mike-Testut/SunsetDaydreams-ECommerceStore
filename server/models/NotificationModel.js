import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                "NEW_ORDER",
                "LOW_STOCK",
                "OUT_OF_STOCK",
                "ORDER_CANCELLED",
            ],
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
            default: "",
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

const NotificationModel =
    mongoose.models.notification ||
    mongoose.model("notification", notificationSchema);

export default NotificationModel;