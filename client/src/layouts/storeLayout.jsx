import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import ScrollToTop from "../utils/ScrollToTop.js";
import Toast from "../components/Toast.jsx";
import AuthWatcher from "../components/AuthWatcher.jsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {API_URL} from "../config/api.js";
import {setProducts} from "../redux/features/shopSlice.js";


const StoreLayout = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/all`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    console.error("Failed to fetch store products")
                    return
                }

                dispatch(setProducts(data.products || []))
            } catch (error) {
                console.error("Error fetching store products:", error)
            }
        }

        fetchProducts()
    }, [dispatch])

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