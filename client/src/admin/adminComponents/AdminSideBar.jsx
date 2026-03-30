import { NavLink, Link } from "react-router-dom";

const linkBase =
    "block rounded-lg px-4 py-2 text-sm font-medium transition";

const AdminSideBar = () => {
    return (
        <aside className="flex h-full w-64 flex-col border border-gray-200 bg-white">
            <nav className="flex-1 space-y-2 px-4 py-6">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `${linkBase} ${
                            isActive
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/admin/orders"
                    end
                    className={({ isActive }) =>
                        `${linkBase} ${
                            isActive
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Orders
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                        `${linkBase} ${
                            isActive
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Products
                </NavLink>
                <NavLink
                    to="/admin/addproduct"
                    className={({ isActive }) =>
                        `${linkBase} ${
                            isActive
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Add Product
                </NavLink>

                <NavLink
                    to="/admin/customers"
                    className={({ isActive }) =>
                        `${linkBase} ${
                            isActive
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    Customers
                </NavLink>
            </nav>

            <div className="border-t border-gray-200 px-4 py-4">
                <Link
                    to="/"
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Back to Store
                </Link>
            </div>
        </aside>
    );
};

export default AdminSideBar;