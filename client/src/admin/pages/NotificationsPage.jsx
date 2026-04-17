import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice.js";
import {
    fetchAdminNotifications,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
} from "../utils/fetchAdminNotifications.js";
import NotificationItem from "../components/NotificationItem.jsx";

const NotificationsPage = () => {
    const token = useSelector(selectToken);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("You must be logged in as an admin to view notifications");
            return;
        }

        const loadNotifications = async () => {
            try {
                const data = await fetchAdminNotifications(token, {
                    unreadOnly: false,
                    limit: 100,
                });

                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [token]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAdminNotificationAsRead(token, notificationId);

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setUnreadCount((currentCount) => Math.max(currentCount - 1, 0));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAdminNotificationsAsRead(token);

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="p-6">Loading notifications...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="mx-5 w-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium">All Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {unreadCount} unread
                    </p>
                </div>

                {!!notifications.length && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm border px-3 py-2 rounded-md hover:bg-gray-50"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {!notifications.length ? (
                <div className="bg-white border rounded-xl p-5 shadow-sm text-sm text-gray-500">
                    No notifications found
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;