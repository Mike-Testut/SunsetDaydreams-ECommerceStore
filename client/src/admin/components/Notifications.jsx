import React from "react";
import {Link} from "react-router-dom";
import NotificationItem from "./NotificationItem.jsx";

const Notifications = ({
                           notifications,
                           unreadCount,
                           onMarkAsRead,
                           onMarkAllAsRead,
                       }) => {
    return (
        <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-medium">Notifications</h2>
                    <p className="text-sm text-gray-500">
                        {unreadCount} unread
                    </p>
                </div>

                {!!notifications.length && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-sm border px-3 py-1 rounded-md hover:bg-gray-50"
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
            <Link to="/admin/notifications" className="text-sm text-gray-500 underline hover:text-black">view all notifications</Link>
        </div>
    );
};

export default Notifications;