import React from "react";
import { adminAssets } from "../assets/adminAssets.js";
import { assets } from "../../assets/assets.js";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/authSlice.js";

const AdminTopBar = () => {
    const user = useSelector(selectCurrentUser);

    return (
        <div className="relative flex items-center justify-between py-3 sm:py-4">
            {/* Left  */}
            <div className="w-8 sm:w-10" />

            {/* Center Logo */}
            <img
                src={adminAssets.adminLogo}
                alt="logo"
                className="
                    h-8 sm:h-10 w-auto object-contain
                    absolute left-1/2 -translate-x-1/2
                "
            />

            {/* Right side */}
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
    );
};

export default AdminTopBar;