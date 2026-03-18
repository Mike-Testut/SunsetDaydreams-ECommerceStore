import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

const StoreLayout = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <NavBar />
            <SearchBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default StoreLayout;