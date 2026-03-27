import React from 'react'
import {useSelector} from "react-redux";
import {selectIsAdmin, selectIsAuthenticated} from "../redux/features/authSlice.js";
import {Navigate} from "react-router-dom";

const AdminRoute = ({children}) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);

    if(!isAuthenticated){
        return <Navigate to="/account/login" />
    }
    if(!isAdmin) {
        return <Navigate to= "/" />
    }
    return children
}
export default AdminRoute
