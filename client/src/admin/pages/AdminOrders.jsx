import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import AdminOrderCard from "../components/AdminOrderCard.jsx"
import AdminStatsCards from "../components/AdminStatsCards.jsx"
import { usePagination } from "../../utils/paginationHelper.js"
import PageChanger from "../../components/PageChanger.jsx"
import { useAdminOrders } from '../hooks/useAdminOrders.js'
import { useOrderFilters } from '../hooks/useOrderFilters.js'
import { useOrderStats } from '../hooks/useOrderStats.js'

const AdminOrders = () => {
    const token = useSelector(selectToken)

    const {
        orders,
        loading,
        error,
        updatingOrderId,
        handleStatusChange,
    } = useAdminOrders(token)

    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredOrders,
    } = useOrderFilters(orders)

    const summaryStats = useOrderStats(orders)

    const [expandedOrderId, setExpandedOrderId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 5

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter])

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

    const { totalPages, paginatedItems } = usePagination(
        filteredOrders,
        ordersPerPage,
        currentPage
    )

    if (loading) {
        return <div className="p-6">Loading orders...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return (
        <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
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

            {filteredOrders.length === 0 ? (
                <div className="border rounded-lg p-6 bg-white text-gray-600">
                    No orders match your current search or filter.
                </div>
            ) : (
                <div className="flex flex-col gap-6">
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
                </div>
            )}

            {totalPages > 1 && (
                <PageChanger
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    )
}

export default AdminOrders