import React, {useEffect, useState} from 'react'
import {selectToken} from "../redux/features/authSlice.js";
import {API_URL} from "../config/api.js";
import {useSelector} from "react-redux";
import Title from "../components/Title.jsx";
import {Link} from "react-router-dom";
import {usePagination} from "../hooks/usePagination.js";
import PageChanger from "../components/PageChanger.jsx";

const Orders = () => {
    const token = useSelector(selectToken);
    const ordersPerPage = 5;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/order/ordersbyuser`, {
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
                console.log('Could not fetch orders:', error)
                setError('Something went wrong loading your orders')
            } finally {
                setLoading(false)
            }
        }

        if (!token) {
            setLoading(false)
            setError('You must be logged in to view orders')
            return
        }

        fetchOrders()
    }, [token])

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
    } = usePagination(orders, ordersPerPage)

    if (loading) {
        return (
            <div className="pt-10">
                <div className="text-2xl mb-8">
                    <Title text1="MY" text2="ORDERS"/>
                </div>
                <p className="text-gray-600">Loading orders...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="pt-10">
                <div className="text-2xl mb-8">
                    <Title text1="MY" text2="ORDERS" />
                </div>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="pt-10">
                <div className="text-2xl mb-8">
                    <Title text1="MY" text2="ORDERS" />
                </div>

                <div className="border rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
                    <Link
                        to="/"
                        className="inline-block bg-black text-white px-6 py-3 text-sm"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }
    return (
        <div className="pt-10 mb-10">
            <div className="text-2xl mb-8">
                <Title text1="MY" text2="ORDERS" />
            </div>

            <div className="flex flex-col gap-8">
                {paginatedItems.map((order) => (
                    <div key={order._id} className="border rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                            <div>
                                <p className="font-medium text-lg">Order #{order.orderNumber}</p>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">Status:</span> {order.status}
                                </p>
                                <p>
                                    <span className="font-medium">Payment:</span> {order.paymentMethod}
                                </p>
                                <p>
                                    <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={`${order._id}-${index}`}
                                    className="flex gap-4 border-t pt-4"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />

                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>

                                    <div className="text-sm font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border-t pt-4 text-sm text-gray-700">
                            <p className="font-medium mb-1">Shipping Address</p>
                            <p>
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-2">{order.shippingAddress.email}</p>
                            <p>{order.shippingAddress.phone}</p>
                        </div>
                    </div>
                ))}
            </div>
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

export default Orders