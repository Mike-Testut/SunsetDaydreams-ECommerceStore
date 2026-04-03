import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar.jsx";
import AdminTopBar from "../components/AdminTopBar.jsx";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <div className="flex flex-1 flex-col">
                    <header className="border-b border-gray-200 bg-white px-6">
                        <AdminTopBar/>
                    </header>

                    <main className="flex p-6">
                        <AdminSideBar />
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;