import React from 'react'
import {selectCurrentUser} from "../redux/features/authSlice.js";
import {useSelector} from "react-redux";

const AccountHome = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <div>
            Welcome, {user.name}!
        </div>
    )
}
export default AccountHome
