import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCartData, getCartSubtotal, getCartTotal } from "../utils/cartHelpers.js";
import { showToast } from "../redux/features/shopSlice.js";
import Title from "../components/Title.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { assets } from "../assets/assets.js";
import { API_URL } from "../config/api.js";
import { selectToken } from "../redux/features/authSlice.js";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(selectToken);

    const products = useSelector((state) => state.shop.products)
    const cartItems = useSelector((state) => state.shop.cartItems)
    const currency = useSelector((state) => state.shop.currency)
    const shippingFee = useSelector((state) => state.shop.shippingFee)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    })

    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [submitting, setSubmitting] = useState(false)

    const setPaymentButtonText = (paymentMethod) => {
        switch (paymentMethod) {
            case 'stripe':
                return "CONTINUE TO STRIPE"
            case 'paypal':
                return "CONTINUE TO PAYPAL"
            case 'cc':
            default:
                return "PLACE ORDER"
        }
    }

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
        return getCartSubtotal(cartData,products)
    }, [cartData,products])

    const total = useMemo(() => {
        return getCartTotal(subtotal, shippingFee, cartData.length > 0)
    }, [subtotal, shippingFee, cartData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartDisplayData.length === 0) {
            dispatch(showToast('Your cart is empty'))
            navigate('/cart')
            return
        }

        if (paymentMethod === 'paypal') {
            dispatch(showToast('PayPal is not currently supported'))
            return
        }

        if (paymentMethod === 'cc') {
            dispatch(showToast('Credit card form is not built yet. Please use Stripe.'))
            return
        }

        try {
            setSubmitting(true)

            const orderItems = cartData.map((item) => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
            }))
            console.log('orderItems being sent:', orderItems)
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
                        shippingAddress: formData,
                        subtotal,
                        shippingFee,
                        tax: 0,
                        total,
                    })
                }
            )

            const data = await response.json();

            if (!response.ok || !data.success || !data.url) {
                dispatch(showToast(data.message || 'Failed to start Stripe checkout'))
                return
            }

            window.location.href = data.url
        } catch (error) {
            console.log("could not start checkout", error)
            dispatch(showToast('Something went wrong starting checkout'))
        } finally {
            setSubmitting(false)
        }
    }

    return cartDisplayData.length > 0 ? (
        <form onSubmit={handleSubmit} className="pt-10">
            <div className="text-2xl mb-8">
                <Title text1="CHECK" text2="OUT" />
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                    <div className="text-xl sm:text-2xl mb-6">
                        <p>Shipping Information</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            type="text"
                            placeholder="First name"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />

                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Last name"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />

                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email address"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full col-span-2"
                            required
                        />

                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="text"
                            placeholder="Phone number"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full col-span-2"
                            required
                        />

                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            placeholder="Street address"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full col-span-2"
                            required
                        />

                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            type="text"
                            placeholder="City"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />

                        <input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            type="text"
                            placeholder="State"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />

                        <input
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            type="text"
                            placeholder="Zip code"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />

                        <input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            type="text"
                            placeholder="Country"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                            required
                        />
                    </div>

                    <div className="my-10">
                        <div className="text-xl sm:text-2xl mb-6">
                            <p>Payment Method</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'stripe'}
                                    onChange={() => setPaymentMethod('stripe')}
                                />
                                <span><img src={assets.stripe_logo} alt='stripe logo' className="h-6" /></span>
                            </label>

                            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'cc'}
                                    onChange={() => setPaymentMethod('cc')}
                                />
                                <span>Credit Card Form (not enabled yet)</span>
                            </label>

                            <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                />
                                <span><img src={assets.paypal_logo} alt='paypal logo' className="h-6" /></span>
                            </label>
                        </div>
                    </div>

                    {paymentMethod === 'cc' && (
                        <div className='my-10'>
                            CC FORM COMING SOON
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-105">
                    <OrderSummary
                        currency={currency}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        total={total}
                        title="Order Summary"
                        items={cartDisplayData}
                        showItems={true}
                    >
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'LOADING...' : setPaymentButtonText(paymentMethod)}
                        </button>
                    </OrderSummary>
                </div>
            </div>
        </form>

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