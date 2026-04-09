import { useMemo } from 'react'

export const useOrderStats = (orders) => {
    return useMemo(() => {
        return {
            total: orders.length,
            orderPlaced: orders.filter((order) => order.status === 'Order Placed').length,
            processing: orders.filter((order) => order.status === 'Processing').length,
            shipped: orders.filter((order) => order.status === 'Shipped').length,
            delivered: orders.filter((order) => order.status === 'Delivered').length,
            cancelled: orders.filter((order) => order.status === 'Cancelled').length,
        }
    }, [orders])
}