import React, {useMemo, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCartData, getCartSubtotal, getCartTotal} from "../utils/cartHelpers.js";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const [paymentMethod, setPaymentMethod] = useState('cc')

    const cartData = useMemo(() => {
        return getCartData(cartItems, products)
    }, [cartItems, products])

    const subtotal = useMemo(() => {
        return getCartSubtotal(cartData)
    }, [cartData])

    const total = useMemo(() => {
        return getCartTotal(subtotal, shippingFee, cartData.length > 0)
    }, [subtotal, shippingFee, cartData])
    return (
        <div>Checkout</div>
    )
}
export default Checkout
