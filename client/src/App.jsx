import React from 'react'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import NavBar from "./components/NavBar.jsx";
import Cart from "./pages/Cart.jsx";
import Footer from "./components/Footer.jsx";
import Collection from "./pages/Collection.jsx";
import SearchBar from "./components/SearchBar.jsx";


const App = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <NavBar />
            <SearchBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/clothing/:category" element={<Collection/>} />
            </Routes>
            <Footer />
        </div>
    )
}
export default App
