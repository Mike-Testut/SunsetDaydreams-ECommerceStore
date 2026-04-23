import { NavLink, Link } from "react-router-dom";

const linkBase =
    "block rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap";

const getLinkClasses = (isActive) =>
    `${linkBase} ${
        isActive
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
    }`;

const navItems = [
    { to: "/admin", label: "Home", end: true },
    { to: "/admin/orders", label: "Orders", end: true },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/addproduct", label: "Add Product" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/notifications", label: "Notifications" },
];

const AdminSideBar = () => {
    return (
        <>
            <aside className="hidden lg:flex h-fit w-64 shrink-0 flex-col border border-gray-200 rounded-xl bg-white">
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => getLinkClasses(isActive)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-gray-200 px-4 py-4">
                    <Link
                        to="/"
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Go to Store
                    </Link>
                </div>
            </aside>

            <div className="lg:hidden mb-4 -mx-3 px-3 sm:-mx-4 sm:px-4 overflow-x-auto">
                <nav className="flex gap-2 min-w-max">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => getLinkClasses(isActive)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default AdminSideBar;