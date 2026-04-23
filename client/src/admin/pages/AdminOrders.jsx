import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import AdminOrderCard from "../components/AdminOrderCard.jsx"
import AdminStatsCards from "../components/AdminStatsCards.jsx"
import { usePagination } from "../../hooks/usePagination.js"
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
    const ordersPerPage = 5

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        resetPage,
    } = usePagination(filteredOrders, ordersPerPage)

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
    }

    useEffect(() => {
        resetPage()
        setExpandedOrderId(null)
    }, [searchTerm, statusFilter, resetPage])

    if (loading) {
        return <div className="p-4 sm:p-6">Loading orders...</div>
    }

    if (error) {
        return <div className="p-4 sm:p-6 text-red-500">{error}</div>
    }

    return (
        <div className="w-full max-w-7xl">
            <div className="flex flex-col gap-4 mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-medium">Orders</h1>

                <input
                    type="text"
                    placeholder="Search by order #, customer, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-96"
                />
            </div>

            <div className="mb-5 sm:mb-6">
                <AdminStatsCards
                    summaryStats={summaryStats}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
            </div>

            {filteredOrders.length === 0 ? (
                <div className="border rounded-lg p-4 sm:p-6 bg-white text-gray-600">
                    No orders match your current search or filter.
                </div>
            ) : (
                <div className="flex flex-col gap-4 sm:gap-6">
                    {paginatedItems.map((order) => (
                        <AdminOrderCard
                            key={order._id}
                            order={order}
                            expandedOrderId={expandedOrderId}
                            toggleOrderExpansion={toggleOrderExpansion}
                            updatingOrderId={updatingOrderId}
                            handleStatusChange={handleStatusChange}
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