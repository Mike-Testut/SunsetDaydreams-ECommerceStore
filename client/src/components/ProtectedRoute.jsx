import React from 'react'
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "../redux/features/authSlice.js";
import {Navigate, useLocation} from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const location = useLocation()

    if(!isAuthenticated){
        return <Navigate to={'/login'} state={{from:location}} replace/>
    }
    return children
}
export default ProtectedRoute
