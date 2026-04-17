import { API_URL } from "../../config/api.js";

export const fetchAdminNotifications = async (
    token,
    { unreadOnly = false, limit = 20 } = {}
) => {
    const params = new URLSearchParams({
        unreadOnly: String(unreadOnly),
        limit: String(limit),
    });

    const response = await fetch(`${API_URL}/api/notification/admin?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load notifications");
    }

    return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
    };
};

export const markAdminNotificationAsRead = async (token, notificationId) => {
        const response = await fetch(`${API_URL}/api/notification/admin/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
        })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to mark notification as read')
            }

            return data.notification
}

export const markAllAdminNotificationsAsRead = async (token) => {
    const response = await fetch(`${API_URL}/api/notification/admin/read-all`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to mark all notifications as read')
    }

    return true
}