import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js'
import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { getCartData, getCartSubtotal, getCartTotal } from "../utils/cartHelpers.js";
import { showToast } from "../redux/features/shopSlice.js";
import Title from "../components/Title.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { API_URL } from "../config/api.js";
import { selectToken } from "../redux/features/authSlice.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const Checkout = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);

    const products = useSelector((state) => state.shop.products)
    const cartItems = useSelector((state) => state.shop.cartItems)
    const currency = useSelector((state) => state.shop.currency)
    const shippingFee = useSelector((state) => state.shop.shippingFee)

    const [loadingCheckout, setLoadingCheckout] = useState(true)
    const [clientSecret, setClientSecret] = useState('')
    const [checkoutError, setCheckoutError] = useState('')

    const cartData = useMemo(() => {
        return getCartData(cartItems)
    }, [cartItems])

    const cartDisplayData = useMemo(() => {
        return cartData
            .map((item) => {
                const product = products.find((product) => product._id === item.productId)

                if (!product) return null

                return {
                    ...item,
                    product,
                }
            })
            .filter(Boolean)
    }, [cartData, products])

    const subtotal = useMemo(() => {
        return getCartSubtotal(cartData, products)
    }, [cartData, products])

    const total = useMemo(() => {
        return getCartTotal(subtotal, shippingFee, cartData.length > 0)
    }, [subtotal, shippingFee, cartData])

    useEffect(() => {
        const createEmbeddedCheckoutSession = async () => {
            if (cartDisplayData.length === 0) {
                setLoadingCheckout(false)
                return
            }

            try {
                setLoadingCheckout(true)
                setCheckoutError('')

                const orderItems = cartData.map((item) => ({
                    productId: item.productId,
                    size: item.size,
                    quantity: item.quantity,
                }))

                const response = await fetch(
                    `${API_URL}/api/order/stripe/create-checkout-session`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({
                            items: orderItems,
                            subtotal,
                            shippingFee,
                            tax: 0,
                            total,
                        })
                    }
                )

                const data = await response.json()

                if (!response.ok || !data.success || !data.clientSecret) {
                    throw new Error(data.message || 'Failed to start Stripe checkout')
                }

                setClientSecret(data.clientSecret)
            } catch (error) {
                console.log("could not start checkout", error)
                setCheckoutError(error.message || 'Something went wrong starting checkout')
                dispatch(showToast(error.message || 'Something went wrong starting checkout'))
            } finally {
                setLoadingCheckout(false)
            }
        }

        if (products.length > 0) {
            createEmbeddedCheckoutSession()
        }
    }, [cartData, cartDisplayData.length, dispatch, products.length, shippingFee, subtotal, token, total])

    return cartDisplayData.length > 0 ? (
        <div className="pt-10">
            <div className="text-2xl mb-8">
                <Title text1="CHECK" text2="OUT" />
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="flex-1">
                    <div className="border rounded-lg p-4 sm:p-6 min-h-[300px]">
                        <div className="text-xl sm:text-2xl mb-6">
                            <p>Shipping & Payment</p>
                        </div>

                        {loadingCheckout ? (
                            <p className="text-gray-600">Loading secure checkout...</p>
                        ) : checkoutError ? (
                            <div>
                                <p className="text-red-600 mb-4">{checkoutError}</p>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="bg-black text-white py-3 px-6 text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : clientSecret ? (
                            <EmbeddedCheckoutProvider
                                stripe={stripePromise}
                                options={{ clientSecret }}
                            >
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        ) : (
                            <p className="text-gray-600">Unable to load checkout.</p>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-105 mb-5">
                    <OrderSummary
                        currency={currency}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        total={total}
                        title="Order Summary"
                        items={cartDisplayData}
                        showItems={true}
                    />
                </div>
            </div>
        </div>
    ) : (
        <div className="pt-10">
            <div className="text-2xl mb-8">
                <Title text1="CHECK" text2="OUT" />
            </div>

            <div className="border rounded-lg p-8 text-center mb-10">
                <p className="text-gray-600 mb-4">Your cart is empty.</p>
                <Link
                    to="/cart"
                    className="inline-block bg-black text-white px-6 py-3 text-sm"
                >
                    Go To Cart
                </Link>
            </div>
        </div>
    )
}

export default Checkout