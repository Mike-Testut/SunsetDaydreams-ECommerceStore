import {API_URL} from "../../config/api.js";


export const fetchAdminOrders = async (token) => {
    const response = await fetch(`${API_URL}/api/order/admin/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('Server returned an invalid response');
    }

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load orders');
    }

    return data.orders || [];
};