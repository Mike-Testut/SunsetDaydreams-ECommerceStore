import { Outlet } from "react-router-dom";
import AdminSidebar from "../adminComponents/AdminSidebar";
import AdminTopBar from "../adminComponents/adminTopBar.jsx";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <div className="flex flex-1 flex-col">
                    <header className="border-b border-gray-200 bg-white px-6">
                        <AdminTopBar/>
                    </header>

                    <main className="flex p-6">
                        <AdminSidebar />
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;