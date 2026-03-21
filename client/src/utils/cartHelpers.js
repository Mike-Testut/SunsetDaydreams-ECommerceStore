export const getCartData = (cartItems, products) => {
    const items = []

    for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
            const quantity = cartItems[productId][size]
            const product = products.find((item) => item._id === productId)

            if (product && quantity > 0) {
                items.push({
                    productId,
                    size,
                    quantity,
                    product,
                })
            }
        }
    }

    return items
}

export const getCartSubtotal = (cartData) => {
    return cartData.reduce((total, item) => {
        return total + item.product.price * item.quantity
    }, 0)
}

export const getCartTotal = (subtotal, shippingFee, hasItems) => {
    return hasItems ? subtotal + shippingFee : 0
}