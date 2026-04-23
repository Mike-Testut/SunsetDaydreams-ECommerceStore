import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar.jsx";
import AdminTopBar from "../components/AdminTopBar.jsx";
import Toast from "../../components/Toast.jsx";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-40 border-b border-gray-200 bg-white px-3 sm:px-4 lg:px-6">
                    <AdminTopBar />
                </header>

                <div className="flex flex-1">
                    <AdminSideBar />

                    <main className="flex-1 p-3 sm:p-4 lg:p-6">
                        <Outlet />
                    </main>
                </div>

                <Toast />
            </div>
        </div>
    );
};

export default AdminLayout;