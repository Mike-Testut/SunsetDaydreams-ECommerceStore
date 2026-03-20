
export const loadCartFromStorage = () => {
    try{
        const cart = localStorage.getItem("cartItems")
        if (!cart) return {}

        return JSON.parse(cart)

    } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        return {}
    }
}

export const saveCartToStorage = (cartItems) => {
    try{
        const cart = JSON.stringify(cartItems)
        localStorage.setItem('cartItems', cart)

    } catch(error){
        console.error('Failed to save cart to localStorage:', error)
    }
}