import React from "react";
import { Link } from "react-router-dom";

const NotificationItem = ({
                                   notification,
                                   onMarkAsRead,
                                   showMarkRead = true,
                                   compact = false,
                               }) => {
    return (
        <div
            className={`border rounded-xl shadow-sm ${
                notification.isRead
                    ? "bg-white opacity-75"
                    : "bg-orange-50 border-orange-200"
            } ${compact ? "p-3" : "p-4"}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className={`font-medium ${compact ? "text-sm" : "text-base"}`}>
                        {notification.title}
                    </p>

                    <p className={`text-gray-600 mt-1 ${compact ? "text-xs" : "text-sm"}`}>
                        {notification.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                    </p>

                    {notification.link && (
                        <Link
                            to={notification.link}
                            className="inline-block mt-3 text-sm underline"
                        >
                            View related page
                        </Link>
                    )}
                </div>

                {showMarkRead && !notification.isRead && (
                    <button
                        onClick={() => onMarkAsRead(notification._id)}
                        className="text-sm border px-3 py-1 rounded-md hover:bg-white whitespace-nowrap"
                    >
                        Mark read
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;