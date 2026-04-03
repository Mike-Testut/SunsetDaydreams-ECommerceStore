import React from 'react'
import Notifications from "../components/Notifications.jsx";

const AdminDashboard = () => {
    return (
        <div className="mx-5">
            <div className="mb-6">
                <h1 className="text-2xl font-medium">Dashboard</h1>
            </div>
            <Notifications/>

        </div>
    )
}
export default AdminDashboard
