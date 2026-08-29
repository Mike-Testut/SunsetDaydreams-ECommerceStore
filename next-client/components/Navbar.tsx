"use client";

import {useState} from "react";
import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {assets} from '@/assets/assets'


// Temporarily comment these in until Redux is migrated
// import { useDispatch, useSelector } from "react-redux";
// import { toggleShowSearch, selectCartCount } from "@/store/features/shopSlice";
// import {
//   logout,
//   selectCurrentUser,
//   selectIsAuthenticated,
//   selectIsAdmin,
// } from "@/store/features/authSlice";

const navLinks = [
    {href: "/", label: "Home"},
    {href: "/clothing/mens", label: "Mens"},
    {href: "/clothing/womens", label: "Womens"},
    {href: "/clothing/accessories", label: "Accessories"},
];


const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    //temp placeholders until redux is added
    const cartCount = 0;
    const isAuthenticated = false;
    const isAdmin = false;
    const user = null;

    const handleLogout = () => {
        router.replace("/");
        //dispatch(logout())
    }

    return (
        <div className="flex items-center justify-between border-b-2 bg-white py-4 font-medium sm:py-5">
            <Link href = "/">
                <Image src={assets.Logo2} alt="Sunset Daydreams Logo"  width={145} height={40} />
            </Link>

            <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
                {navLinks.map((link)=>{
                    const isActive = pathname === link.href;
                    return (
                        <Link key = {link.href} href={link.href} className="flex flex-col items-center gap-1">
                            <p className="hover:text-black">{link.label}</p>
                            <hr
                                className={`h-[1.5px] w-3/4 border-none bg-gray-700 ${
                                    isActive ? "block" : "hidden"
                                }`}
                            />
                        </Link>
                    )
                })}
            </ul>

        </div>
    )
}
export default Navbar
