import React from 'react'

const OrderSummary = ({
                          currency,
                          subtotal,
                          shippingFee,
                          total,
                          title = 'Order Summary',
                          shippingLabel = 'Estimated Shipping',
                          taxLabel = 'Estimated Tax',
                          taxAmount = '-',
                          items = [],
                          showItems = false,
                          children,
                      }) => {
    return (
        <div className="border p-6 rounded-lg">
            <div className="text-lg mb-6 text-center underline">
                <p>{title}</p>
            </div>

            {showItems && items.length > 0 && (
                <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2 mb-6">
                    {items.map((item) => (
                        <div
                            key={`${item.productId}-${item.size}`}
                            className="flex gap-4 border-b pb-4"
                        >
                            <img
                                src={item.product.image[0]}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover"
                            />

                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.product.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-sm mt-1">
                                    {currency}
                                    {(item.product.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>
                        {currency}
                        {subtotal.toFixed(2)}
                    </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p>{shippingLabel}</p>
                    <p>
                        {currency}
                        {shippingFee.toFixed(2)}
                    </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p>{taxLabel}</p>
                    <p>{taxAmount}</p>
                </div>

                <hr />

                <div className="flex justify-between font-medium text-base">
                    <p>Total</p>
                    <p>
                        {currency}
                        {total.toFixed(2)}
                    </p>
                </div>
            </div>

            {children && <div className="mt-6">{children}</div>}
        </div>
    )
}

export default OrderSummary