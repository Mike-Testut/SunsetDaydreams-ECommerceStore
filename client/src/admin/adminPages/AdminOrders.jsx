import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'
import AdminOrderCard from "../adminComponents/AdminOrderCard.jsx";
import AdminStatsCards from "../adminComponents/AdminStatsCards.jsx";
import {usePagination} from "../../utils/paginationHelper.js";
import PageChanger from "../../components/PageChanger.jsx";

const AdminOrders = () => {
    const token = useSelector(selectToken)

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [updatingOrderId, setUpdatingOrderId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [expandedOrderId, setExpandedOrderId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 5

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
    }

    // Fetch All Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/order/admin/orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                let data
                try {
                    data = await response.json()
                } catch {
                    setError('Server returned an invalid response')
                    return
                }

                if (!response.ok || !data.success) {
                    setError(data.message || 'Failed to load orders')
                    return
                }

                setOrders(data.orders || [])
            } catch (error) {
                console.log('Could not fetch admin orders:', error)
                setError('Something went wrong loading orders')
            } finally {
                setLoading(false)
            }
        }

        if (!token) {
            setLoading(false)
            setError('You must be logged in as an admin')
            return
        }

        fetchOrders()
    }, [token])

    //Reset to first page when search or filters changes
    useEffect(() => {
        setCurrentPage(1)
    },[searchTerm, statusFilter])

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId)

            const response = await fetch(`${API_URL}/api/order/admin/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            })

            let data
            try {
                data = await response.json()
            } catch {
                setError('Server returned an invalid response')
                return
            }

            if (!response.ok || !data.success) {
                setError(data.message || 'Failed to update order status')
                return
            }

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            )
        } catch (error) {
            console.log('Could not update order status:', error)
            setError('Something went wrong updating the order')
        } finally {
            setUpdatingOrderId('')
        }
    }

    //Set badge colors when status changes
    const getStatusBadgeClasses = (status) => {
        switch (status) {
            case 'Order Placed':
                return 'bg-gray-100 text-gray-700 border-gray-200'
            case 'Processing':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Shipped':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'Delivered':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border-red-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    //Filter Orders based on status
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

    //Pagination
    const {totalPages,paginatedItems} = usePagination(filteredOrders, ordersPerPage, currentPage)

    //Get counts of each order status type for top bar
    const summaryStats = useMemo(() => {
        return {
            total: orders.length,
            orderPlaced: orders.filter((order) => order.status === 'Order Placed').length,
            processing: orders.filter((order) => order.status === 'Processing').length,
            shipped: orders.filter((order) => order.status === 'Shipped').length,
            delivered: orders.filter((order) => order.status === 'Delivered').length,
            cancelled: orders.filter((order) => order.status === 'Cancelled').length,
        }
    }, [orders])


    if (loading) {
        return <div className="p-6">Loading orders...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center  gap-4 mb-6">
            <h1 className="text-2xl font-medium">Orders</h1>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search by order #, customer, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full sm:w-80"
                />
            </div>
        </div>
        <AdminStatsCards
            summaryStats={summaryStats}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
        />

        {filteredOrders.length === 0 ? <div className="border rounded-lg p-6 bg-white text-gray-600">
                No orders match your current search or filter.
            </div> : <div className="flex flex-col gap-6">
            {paginatedItems.map((order) => (
                <AdminOrderCard
                    key={order._id}
                    order={order}
                    expandedOrderId={expandedOrderId}
                    toggleOrderExpansion={toggleOrderExpansion}
                    updatingOrderId={updatingOrderId}
                    handleStatusChange={handleStatusChange}
                    getStatusBadgeClasses={getStatusBadgeClasses}
                />
            ))}
            </div>}
        {totalPages > 1 && (
            <PageChanger
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                />
        )}
    </div>
}

export default AdminOrders