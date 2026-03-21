import {configureStore} from "@reduxjs/toolkit"
import shopReducer from "./features/shopSlice.js"
import {saveCartToStorage} from "./cartStorage.js";

export const store = configureStore({
    reducer: {
        shop:shopReducer,
    }
})

let previousCartItems = store.getState().shop.cartItems;

store.subscribe(() => {
    const state = store.getState()
    const currentCartItems = state.shop.cartItems

    if (currentCartItems !== previousCartItems) {
        saveCartToStorage(currentCartItems)
        previousCartItems = currentCartItems
    }
})