import React from "react";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem.jsx";

const Notifications = ({
                           notifications,
                           unreadCount,
                           onMarkAsRead,
                           onMarkAllAsRead,
                       }) => {
    return (
        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm mb-5 sm:mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                    <h2 className="text-lg font-medium">Notifications</h2>
                    <p className="text-sm text-gray-500">{unreadCount} unread</p>
                </div>

                {!!notifications.length && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm border px-3 py-2 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {!notifications.length ? (
                <div className="text-sm text-gray-500">No new notifications</div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                            compact
                        />
                    ))}
                </div>
            )}

            <Link
                to="/admin/notifications"
                className="inline-block mt-4 text-sm text-gray-500 underline hover:text-black"
            >
                View all notifications
            </Link>
        </div>
    );
};

export default Notifications;