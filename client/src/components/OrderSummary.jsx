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
                          children,
                      }) => {
    return (
        <div>
            <div className="border p-6 rounded-lg">
                <div className="text-lg mb-6 text-center underline">
                    <p>{title}</p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>
                            {currency}
                            {subtotal.toFixed(2)}
                        </p>
                    </div>

                    <hr/>

                    <div className="flex justify-between">
                        <p>{shippingLabel}</p>
                        <p>
                            {currency}
                            {shippingFee.toFixed(2)}
                        </p>
                    </div>

                    <hr/>

                    <div className="flex justify-between">
                        <p>{taxLabel}</p>
                        <p>{taxAmount}</p>
                    </div>

                    <hr/>

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
        </div>
    )
}

export default OrderSummary