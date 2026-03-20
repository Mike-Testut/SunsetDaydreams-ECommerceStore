import React from 'react'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Collection from "./pages/Collection.jsx";
import AdminDashboard from "./admin/adminPages/adminDashboard.jsx";
import AddProduct from "./admin/adminPages/addProduct.jsx";
import StoreLayout from "./layouts/storeLayout.jsx";
import AdminLayout from "./admin/adminLayouts/adminLayout.jsx";
import SearchResults from "./pages/SearchResults.jsx";


const App = () => {
    return (
            <Routes>
                {/*Public Store Routes*/}
                <Route element = {<StoreLayout/>}>
                    <Route path="/" element={<Home/>} />
                    <Route path="/cart" element={<Cart/>} />
                    <Route path="/clothing/:category" element={<Collection/>} />
                    <Route path="/search" element={<SearchResults/>}/>
                </Route>

                {/*Admin Routes*/}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="addproduct" element={<AddProduct />} />
                </Route>
            </Routes>
    )
}
export default App
