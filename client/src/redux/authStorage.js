import { isTokenExpired } from '../utils/jwtHelpers'

export const saveAuthToStorage = ({token, user}) => {
    try {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else{
            localStorage.removeItem("user");
        }
    } catch(error){
        console.error('Failed to save auth to localStorage:', error)
    }
}

export const loadAuthFromStorage = () => {
    try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            return {
                token: null,
                user: null,
                isAuthenticated: false,
            }
        }

        return {
        token: token || null,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token,
        }
    } catch(error){
        console.error('Failed to load auth from localStorage:', error)
        return {
            token: null,
            user: null,
            isAuthenticated: false,
        }
    }
}

export const clearAuthFromStorage = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    } catch(error){
        console.error('Failed to clear local storage', error)
    }
}