import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar.jsx";
import AdminTopBar from "../components/AdminTopBar.jsx";
import Toast from "../../components/Toast.jsx";
import { useState } from "react";

const AdminLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-3 sm:px-4 lg:px-6">
                    <AdminTopBar
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />
                </header>

                <div className="flex flex-1 gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6">
                    <div className="hidden lg:block">
                        <AdminSideBar />
                    </div>

                    <main className="min-w-0 flex-1">
                        <Outlet />
                    </main>
                </div>

                <Toast />
            </div>
        </div>
    );
};

export default AdminLayout;