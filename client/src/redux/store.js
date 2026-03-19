import {configureStore} from "@reduxjs/toolkit"
import shopReducer from "./features/shopSlice.js"

export const store = configureStore({
    reducer: {
        shop:shopReducer,
    }
})