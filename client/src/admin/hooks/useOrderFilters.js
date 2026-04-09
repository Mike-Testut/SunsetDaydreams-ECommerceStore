import { useMemo, useState } from 'react'

export const useOrderFilters = (orders) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const filteredOrders = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return orders.filter((order) => {
            const matchesStatus =
                statusFilter === 'All' ? true : order.status === statusFilter

            const customerName = order.user?.name || 'Guest'
            const customerEmail = order.user?.email || order.shippingAddress?.email || ''
            const orderNumber = order.orderNumber || ''
            const shippingName =
                `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim()

            const matchesSearch =
                !normalizedSearch ||
                orderNumber.toLowerCase().includes(normalizedSearch) ||
                customerName.toLowerCase().includes(normalizedSearch) ||
                customerEmail.toLowerCase().includes(normalizedSearch) ||
                shippingName.toLowerCase().includes(normalizedSearch)

            return matchesStatus && matchesSearch
        })
    }, [orders, searchTerm, statusFilter])

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredOrders,
    }
}