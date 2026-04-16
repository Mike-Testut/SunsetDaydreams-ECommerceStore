import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removeProductFromCart, showToast } from '../redux/features/shopSlice.js'

export const useCartCleanup = (products, cartItems) => {
    const dispatch = useDispatch()
    const hasCleanedRef = useRef(false)

    useEffect(() => {
        if (!products?.length) return
        if (hasCleanedRef.current) return

        const validProductIds = new Set(products.map((product) => product._id))

        const invalidProductIds = Object.keys(cartItems).filter(
            (productId) => !validProductIds.has(productId)
        )

        if (!invalidProductIds.length) {
            hasCleanedRef.current = true
            return
        }

        invalidProductIds.forEach((productId) => {
            dispatch(removeProductFromCart({ productId }))
        })

        dispatch(showToast('Unavailable items were removed from your cart'))
        hasCleanedRef.current = true
    }, [products, cartItems, dispatch])
}