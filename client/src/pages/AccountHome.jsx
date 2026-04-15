import React from 'react'
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Title from "../components/Title.jsx"
import { selectIsAdmin } from "../redux/features/authSlice.js"

const AccountHome = () => {
    const isAdmin = useSelector(selectIsAdmin)

    const accountLinks = [
        {
            title: "My Orders",
            description: "Track orders, view past purchases, and check delivery progress.",
            to: "/account/orders",
        },
        {
            title: "My Wishlist",
            description: "Save your favorite items for later.",
            to: "/account/wishlist",
        },
        {
            title: "My Rewards",
            description: "View points, perks, and exclusive member benefits.",
            to: "/account/rewards",
        },
        {
            title: "Account Settings",
            description: "Update your personal details and account preferences.",
            to: "/account/settings",
        },
    ]

    return (
        <div className="pt-10 pb-12">
            <div className="text-xl mb-4 text-center">
                <Title text1="ACCOUNT" text2="HOME" />
            </div>

            <p className="text-center text-gray-500 mb-10">
                Manage your orders, saved items, rewards, and account details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accountLinks.map((item) => (
                    <Link
                        key={item.title}
                        to={item.to}
                        className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                        <h2 className="text-lg font-medium text-gray-800">
                            {item.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            {item.description}
                        </p>
                    </Link>
                ))}

                {isAdmin && (
                    <Link
                        to="/admin"
                        className="border rounded-lg p-6 bg-gray-500 text-white shadow-sm hover:bg-black transition"
                    >
                        <h2 className="text-lg font-medium">
                            Admin Dashboard
                        </h2>
                        <p className="text-sm text-gray-300 mt-2">
                            Manage products, orders, inventory, and store activity.
                        </p>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default AccountHome