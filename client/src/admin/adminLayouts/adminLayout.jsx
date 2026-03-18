import { Outlet } from "react-router-dom";
import AdminNavbar from "../adminComponents/AdminNavbar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;