import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectToken } from '../redux/features/authSlice'
import { decodeToken } from '../utils/jwtHelpers'

const AuthWatcher = () => {
    const dispatch = useDispatch()
    const token = useSelector(selectToken)

    useEffect(() => {
        if (!token) return

        const decoded = decodeToken(token)
        if (!decoded?.exp) return

        const expirationTime = decoded.exp * 1000
        const timeout = expirationTime - Date.now()

        // If already expired logout immediately
        if (timeout <= 0) {
            dispatch(logout())
            return
        }

        // Otherwise schedule logout
        const timer = setTimeout(() => {
            dispatch(logout())
        }, timeout)

        return () => clearTimeout(timer)
    }, [token, dispatch])

    return null // nothing renders
}

export default AuthWatcher