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
import Product from "./pages/Product.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderPlaced from "./pages/OrderPlaced.jsx";
import AccountHome from "./pages/AccountHome.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";


const App = () => {
    return (
            <Routes>
                {/*Public Store Routes*/}
                <Route element = {<StoreLayout/>}>
                    <Route path="/" element={<Home/>} />
                    <Route path="/cart" element={<Cart/>} />
                    <Route path="/clothing/:category" element={<Collection/>} />
                    <Route path="/search" element={<SearchResults/>}/>
                    <Route path="/products/:productId" element={<Product/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/orderplaced" element={<OrderPlaced/>}/>
                    <Route path="account/login" element={<Login/>}/>
                    <Route path="account/signup" element={<SignUp/>}/>
                    <Route path="account/home" element={<AccountHome/>}/>

                {/*    User Account Routes */}
                    <Route path="account/myaccount" element={<AccountHome/>}/>
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
