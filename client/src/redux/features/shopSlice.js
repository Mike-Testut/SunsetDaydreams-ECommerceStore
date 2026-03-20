import {createSlice} from "@reduxjs/toolkit";
import {MockProducts} from "../../assets/MockProducts.js";

const initialState = {
    products: MockProducts,
    currency: '$',
    shippingFee: 10,
    search: '',
    showSearch: false,
    cartItems:{},
}

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
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
            const {productId, size, quantity} = action.payload
            if (!state.cartItems[productId]) return

            if (quantity <= 0) {
                delete state.cartItems[productId][size]
            }
            if (Object.keys(state.cartItems[productId]).length === 0) {
                delete state.cartItems[productId]
            }
            state.cartItems[productId][size] = quantity;
        },
        removeFromCart: (state, action) => {
            const {productId, size} = action.payload
            if (!state.cartItems[productId]?.[size]) return

            delete state.cartItems[productId][size]

            if (Object.keys(state.cartItems[productId]).length === 0) {
                delete state.cartItems[productId]
            }
        },
    }
})

export const {
    setSearch,
    setShowSearch,
    toggleShowSearch,
    clearSearch,
    addToCart,
    updateCartQuantity,
    removeFromCart,
} = shopSlice.actions;

export const selectCartCount = (state) => {
    return Object.values(state.shop.cartItems).reduce((total, sizes) => {
        return total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0)
    }, 0)
}

export default shopSlice.reducer;