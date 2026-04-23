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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
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
                            className="inline-block mt-3 text-sm underline wrap-break-word"
                        >
                            View related page
                        </Link>
                    )}
                </div>

                {showMarkRead && !notification.isRead && (
                    <button
                        onClick={() => onMarkAsRead(notification._id)}
                        className="text-sm border px-3 py-2 rounded-md hover:bg-white whitespace-nowrap w-full sm:w-auto"
                    >
                        Mark read
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;