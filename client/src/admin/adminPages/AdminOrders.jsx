import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'

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
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

        //Set start and end index for each page
    const paginatedOrders = useMemo(()=>{
        const startIndex = (currentPage-1) * ordersPerPage
        const endIndex = startIndex + ordersPerPage

        return filteredOrders.slice(startIndex, endIndex)
    }, [filteredOrders, currentPage])

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

    //Change UI of stat cards based on active vs non-active
    const getStatCardClasses = (filterValue) => {
        const isActive = statusFilter === filterValue

        if (!isActive) {
            switch (filterValue) {
                case 'Order Placed':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-gray-800 border-gray-300'

                case 'Processing':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-blue-800 border-blue-300'

                case 'Shipped':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-purple-800 border-purple-300'

                case 'Delivered':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer' +
                        ' bg-white text-green-800 border-green-300'

                case 'Cancelled':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white text-red-800' +
                        ' border-red-300'

                case 'All':
                default:
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white text-gray-900 hover:border-black'
            }
        }

        switch (filterValue) {
            case 'Order Placed':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-gray-300' +
                    ' text-gray-800 border-gray-400'

            case 'Processing':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-blue-100' +
                    ' text-blue-800 border-blue-400'

            case 'Shipped':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-purple-100' +
                    ' text-purple-800 border-purple-400'

            case 'Delivered':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-green-100' +
                    ' text-green-800 border-green-400'

            case 'Cancelled':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-red-100 text-red-800' +
                    ' border-red-400'

            case 'All':
            default:
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-black text-white border-black'
        }
    }

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <button onClick={() => setStatusFilter("All")}>
                <div className={getStatCardClasses("All")}>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.total}</p>
                </div>
            </button>
            <button onClick={() => setStatusFilter("Order Placed")}>
                <div className={getStatCardClasses("Order Placed")}>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.orderPlaced}</p>
                </div>
            </button>
            <button onClick={() => setStatusFilter("Processing")}>
                <div className={getStatCardClasses("Processing")}>
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.processing}</p>
                </div>
            </button>
            <button onClick={() => setStatusFilter("Shipped")}>
                <div className={getStatCardClasses("Shipped")}>
                    <p className="text-sm text-gray-500">Shipped</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.shipped}</p>
                </div>
            </button>
            <button onClick={() => setStatusFilter("Delivered")}>
                <div className={getStatCardClasses("Delivered")}>
                    <p className="text-sm text-gray-500">Delivered</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.delivered}</p>
                </div>
            </button>
            <button onClick={() => setStatusFilter("Cancelled")}>
                <div className={getStatCardClasses("Cancelled")}>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-medium mt-1">{summaryStats.cancelled}</p>
                </div>
            </button>
        </div>

        {filteredOrders.length === 0 ? <div className="border rounded-lg p-6 bg-white text-gray-600">
                No orders match your current search or filter.
            </div> : <div className="flex flex-col gap-6">
                {paginatedOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-5 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => toggleOrderExpansion(order._id)}
                            className="w-full text-left"
                        >
                            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <p className="font-medium text-lg">Order #{order.orderNumber}</p>
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full border ${getStatusBadgeClasses(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleString()}
                                    </p>

                                    <div className="mt-2 text-sm text-gray-700">
                                        <p>
                                            <span className="font-medium">Customer:</span>{' '}
                                            {order.user?.name ||
                                                `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() ||
                                                'Guest'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span>{' '}
                                            {order.user?.email || order.shippingAddress?.email || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium">Payment:</span> {order.paymentMethod}
                                    </p>
                                    <p>
                                        <span className="font-medium">Subtotal:</span> $
                                        {order.subtotal?.toFixed(2)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Shipping:</span> $
                                        {order.shippingFee?.toFixed(2)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Total:</span> $
                                        {order.total?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                               <p className='cursor-pointer w-fit'> {expandedOrderId === order._id ? 'Hide details' : 'View details'}</p>
                            </div>
                        </button>
                        {expandedOrderId === order._id && (
                            <>
                                <div className="border-t pt-4">
                            <p className="font-medium mb-3">Items</p>

                            <div className="flex flex-col gap-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={`${order._id}-${index}`}
                                        className="flex gap-4 items-start"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded border"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <div className="text-sm font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <p className="font-medium mb-2">Shipping Address</p>
                            <div className="text-sm text-gray-700">
                                <p>
                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                </p>
                                <p>{order.shippingAddress?.address}</p>
                                <p>
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                                    {order.shippingAddress?.zipCode}
                                </p>
                                <p>{order.shippingAddress?.country}</p>
                                <p>{order.shippingAddress?.phone}</p>
                            </div>
                        </div>
                            </>
                        )}
                        <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-gray-700">
                                Update order status
                            </div>

                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                disabled={updatingOrderId === order._id}
                                className="border px-3 py-2 rounded text-sm"
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>}
        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border px-4 py-2 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </p>

                <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border px-4 py-2 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        )}
    </div>
}

export default AdminOrders