import {configureStore} from "@reduxjs/toolkit"
import shopReducer from "./features/shopSlice.js"
import authReducer from "./features/authSlice.js"
import {saveCartToStorage} from "./cartStorage.js";
import {saveAuthToStorage} from "./authStorage.js";

export const store = configureStore({
    reducer: {
        shop:shopReducer,
        auth: authReducer,
    }
})

let previousCartItems = store.getState().shop.cartItems;
let previousAuthToken = store.getState().auth.token;
let previousAuthUser = store.getState().auth.user;

store.subscribe(() => {
    const state = store.getState()

    const currentCartItems = state.shop.cartItems
    if (currentCartItems !== previousCartItems) {
        saveCartToStorage(currentCartItems)
        previousCartItems = currentCartItems
    }

    const currentAuthToken = state.auth.token
    const currentAuthUser = state.auth.user
    if (currentAuthToken !== previousAuthToken ||
        currentAuthUser !== previousAuthUser) {
        saveAuthToStorage({
            token: currentAuthToken,
            user: currentAuthUser,
        })
        previousAuthToken = currentAuthToken
        previousAuthUser = currentAuthUser
    }
})