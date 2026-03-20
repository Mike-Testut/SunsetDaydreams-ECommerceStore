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
        }
    }
})

export const {
    setSearch,
    setShowSearch,
    toggleShowSearch,
    clearSearch,
    addToCart,
} = shopSlice.actions;

export default shopSlice.reducer;