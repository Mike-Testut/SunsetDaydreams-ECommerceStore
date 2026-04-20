import {createSlice} from "@reduxjs/toolkit";
import { loadCartFromStorage } from '../cartStorage'

const initialState = {
    products: [],
    currency: '$',
    shippingFee: 5.99,
    search: '',
    showSearch: false,
    cartItems:loadCartFromStorage(),
    toast:{
        visible: false,
        message: '',
    }
}

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setSearch: (state, action) => {
            state.search = action.payload
        },
        setShowSearch: (state, action) => {
            state.showSearch = action.payload
        },
        toggleShowSearch: (state) => {
            state.showSearch = !state.showSearch
        },
        clearSearch: (state) => {
            state.search = ''
        },
        addToCart: (state, action) => {
            const {productId, size} = action.payload;
            if (!productId || !size) return;
            if (!state.cartItems[productId]) {
                state.cartItems[productId] = {}
            }

            if (!state.cartItems[productId][size]) {
                state.cartItems[productId][size] = 1
            } else {
                state.cartItems[productId][size] += 1
            }
        },
        updateCartQuantity: (state, action) => {
            const { productId, size, quantity } = action.payload
            if (!state.cartItems[productId]) return

            if (quantity <= 0) {
                delete state.cartItems[productId][size]

                if (Object.keys(state.cartItems[productId]).length === 0) {
                    delete state.cartItems[productId]
                }

                return
            }
            state.cartItems[productId][size] = quantity
        },
        removeFromCart: (state, action) => {
            const {productId, size} = action.payload
            if (!state.cartItems[productId]?.[size]) return

            delete state.cartItems[productId][size]

            if (Object.keys(state.cartItems[productId]).length === 0) {
                delete state.cartItems[productId]
            }
        },
        clearCart: (state) => {
            state.cartItems = {}
        },
        removeProductFromCart: (state, action) => {
            const { productId } = action.payload
            if (!state.cartItems[productId]) return

            delete state.cartItems[productId]
        },
        showToast: (state, action) => {
            state.toast.visible = true
            state.toast.message = action.payload
        },
        hideToast: (state) => {
            state.toast.visible = false
            state.toast.message = ''
        },
    }
})

export const {
    setProducts,
    setSearch,
    setShowSearch,
    toggleShowSearch,
    clearSearch,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    removeProductFromCart,
    showToast,
    hideToast,
} = shopSlice.actions;

export const selectCartCount = (state) => {
    const validProductIds = new Set(state.shop.products.map((product) => product._id))

    return Object.entries(state.shop.cartItems).reduce((total, [productId, sizes]) => {
        if (!validProductIds.has(productId)) return total

        return total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0)
    }, 0)
}

export default shopSlice.reducer;