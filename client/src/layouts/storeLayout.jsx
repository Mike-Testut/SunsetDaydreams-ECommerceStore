import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import ScrollToTop from "../utils/ScrollToTop.js";
import Toast from "../components/Toast.jsx";
import AuthWatcher from "../components/AuthWatcher.jsx";


const StoreLayout = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <AuthWatcher />
            <ScrollToTop />
            <NavBar />
            <SearchBar />
            <Outlet />
            <Footer />
            <Toast />
        </div>
    );
};

export default StoreLayout;