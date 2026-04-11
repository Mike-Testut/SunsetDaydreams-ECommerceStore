import React from 'react'
import {getStatusBadgeClasses} from "../utils/orderStatusStyles.js";

const AdminOrderCard = ({
                            order,
                            expandedOrderId,
                            toggleOrderExpansion,
                            updatingOrderId,
                            handleStatusChange,
                        }) => {

    const isExpanded = expandedOrderId === order._id

    return (
        <div className="border rounded-lg p-5 bg-white shadow-sm">
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

                        {/* add item count here*/}

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

                <div className="mt-4 text-sm text-gray-500 w-fit">
                    <p className="w-fit cursor-pointer">{isExpanded ? 'Hide details' : 'View details'}</p>
                </div>
            </button>

            {isExpanded && (
                <>
                    <div className="border-t pt-4 mt-4">
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
                </>
            )}
        </div>
    )
}
export default AdminOrderCard
