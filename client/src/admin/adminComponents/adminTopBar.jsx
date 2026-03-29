import React from 'react'
import {adminAssets} from "../adminAssets/adminAssets.js";
import {assets} from "../../assets/assets.js";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/features/authSlice.js";

const AdminTopBar = () => {
    const user = useSelector(selectCurrentUser)

    return (
        <div className='grid grid-cols-3 items-center justify-center py-5 bg-white '>
            <div ></div>
            <img src={adminAssets.adminLogo} alt="logo" className="w-115" />
            <div className='flex justify-self-end gap-2'>
                <p>Hi, {user.name}</p>
                <img src = {assets.ProfileIcon} alt="profile" className="w-6" />
            </div>
        </div>
    )
}
export default AdminTopBar
