export const getCartData = (cartItems) => {
    const items = []

    for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
            const quantity = cartItems[productId][size]

            if (quantity > 0) {
                items.push({
                    productId,
                    size,
                    quantity,
                })
            }
        }
    }

    return items
}

export const getCartSubtotal = (cartData, products) => {
    return cartData.reduce((total, item) => {
        const product = products.find((product) => product._id === item.productId)

        if (!product) return total
        return total + Number(product.price) * item.quantity
    }, 0)
}

export const getCartTotal = (subtotal, shippingFee, hasItems) => {
    return hasItems ? subtotal + shippingFee : 0
}