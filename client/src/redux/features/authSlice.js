import {createSlice} from "@reduxjs/toolkit";
import {loadAuthFromStorage, clearAuthFromStorage} from "../authStorage.js";

const storedAuth = loadAuthFromStorage();

const initialState = {
    token: storedAuth.token,
    user: storedAuth.user,
    isAuthenticated: storedAuth.isAuthenticated,
}

const authSlice =createSlice( {
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;

            state.user = user || null;
            state.token = token || null;
            state.isAuthenticated = !!token && !!user;
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false
            clearAuthFromStorage()
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAdmin = (state) => selectIsAuthenticated && state.auth.user?.role === 'admin'

export default authSlice.reducer