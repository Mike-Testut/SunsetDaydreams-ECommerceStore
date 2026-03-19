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
    }
})

export const {
    setSearch,
    setShowSearch,
    toggleShowSearch,
} = shopSlice.actions;

export default shopSlice.reducer;