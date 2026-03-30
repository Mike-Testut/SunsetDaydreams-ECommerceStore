import React from 'react'
import Title from "../../components/Title.jsx";
import Notifications from "../adminComponents/Notifications.jsx";

const AdminDashboard = () => {
    return (
        <div className="items-center text-center w-full">
            <div className='pb-2 text-3xl text-center w-full'>
                <Title text1='Your' text2='Dashboard' />
            </div>
            <Notifications/>

        </div>
    )
}
export default AdminDashboard
