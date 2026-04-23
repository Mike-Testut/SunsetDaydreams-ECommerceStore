import React from "react";
import { adminAssets } from "../assets/adminAssets.js";
import { assets } from "../../assets/assets.js";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { selectCurrentUser } from "../../redux/features/authSlice.js";

const navItems = [
    { to: "/admin", label: "Home", end: true },
    { to: "/admin/orders", label: "Orders", end: true },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/addproduct", label: "Add Product" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/notifications", label: "Notifications" },
];

const mobileLinkClasses = (isActive) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

const AdminTopBar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const user = useSelector(selectCurrentUser);

    return (
        <>
            <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden flex items-center justify-center w-10 h-10"
                        aria-label="Open admin menu"
                    >
                        <span className="text-xl leading-none">☰</span>
                    </button>

                    <img
                        src={adminAssets.adminLogo}
                        alt="logo"
                        className="h-8 sm:h-10 w-auto max-w-50 sm:max-w-75 object-contain"
                    />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <p className="hidden sm:block text-sm text-gray-700 truncate">
                        Hi, {user?.name || "Admin"}
                    </p>
                    <img
                        src={assets.ProfileIcon}
                        alt="profile"
                        className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                    />
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-60">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    <div className="absolute top-0 left-0 h-full w-[82%] max-w-xs bg-white shadow-xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <img
                                src={adminAssets.adminLogo}
                                alt="logo"
                                className="h-8 w-auto object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200"
                                aria-label="Close admin menu"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => mobileLinkClasses(isActive)}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="mt-4 border-t border-gray-200 pt-4">
                            <Link
                                to="/"
                                className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Go to Store
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminTopBar;