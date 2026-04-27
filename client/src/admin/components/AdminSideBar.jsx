import { NavLink, Link } from "react-router-dom";

const navItems = [
    { to: "/admin", label: "Home", end: true },
    { to: "/admin/orders", label: "Orders", end: true },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/addproduct", label: "Add Product" },
    // { to: "/admin/customers", label: "Customers" },
    { to: "/admin/notifications", label: "Notifications" },
];

const linkClasses = (isActive) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${
        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

const AdminSideBar = () => {
    return (
        <aside className="w-64 shrink-0">
            <div className="sticky top-24 h-fit w-full rounded-xl border border-gray-200 bg-white p-4">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => linkClasses(isActive)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-4 border-t border-gray-200 pt-4">
                    <Link
                        to="/"
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Go to Store
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default AdminSideBar;