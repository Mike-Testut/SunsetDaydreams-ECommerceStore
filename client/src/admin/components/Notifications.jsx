import React from "react";

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
                        <div
                            key={notification._id}
                            className={`border rounded-lg p-4 ${
                                notification.isRead ? "bg-white" : "bg-orange-50 border-orange-200"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-medium">{notification.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {!notification.isRead && (
                                    <button
                                        onClick={() => onMarkAsRead(notification._id)}
                                        className="text-sm border px-3 py-1 rounded-md hover:bg-white"
                                    >
                                        Mark read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;