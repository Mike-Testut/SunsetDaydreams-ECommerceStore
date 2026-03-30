import React from 'react'
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Collection from "./pages/Collection.jsx";
import AdminDashboard from "./admin/adminPages/AdminDashboard.jsx";
import AddProduct from "./admin/adminPages/AddProduct.jsx";
import StoreLayout from "./layouts/storeLayout.jsx";
import AdminLayout from "./admin/adminLayouts/adminLayout.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Product from "./pages/Product.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderPlaced from "./pages/OrderPlaced.jsx";
import AccountHome from "./pages/AccountHome.jsx";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./admin/adminComponents/AdminRoute.jsx";
import AdminOrders from "./admin/adminPages/AdminOrders.jsx";
import AllProducts from "./admin/adminPages/AllProducts.jsx";
import Customers from "./admin/adminPages/Customers.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";


const App = () => {
    return (
        <Routes>
            {/*Public Store Routes*/}
            <Route element={<StoreLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/clothing/:category" element={<Collection/>}/>
                <Route path="/search" element={<SearchResults/>}/>
                <Route path="/products/:productId" element={<Product/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/orderplaced" element={<OrderPlaced/>}/>
                <Route path="*" element={<ErrorPage/>}/>


                {/*    User Account Routes */}
                <Route path="/account/login" element={<Login/>}/>
                <Route path="/account/signup" element={<SignUp/>}/>
                <Route path="/account/home" element={
                    <ProtectedRoute>
                        <AccountHome/>
                    </ProtectedRoute>
                }/>
                <Route path="/account/orders" element={
                    <ProtectedRoute>
                        <Orders/>
                    </ProtectedRoute>
                }/>

            </Route>

            {/*Admin Routes*/}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout/>
                </AdminRoute>
            }>
                <Route index element={<AdminDashboard />} />
                <Route path="addproduct" element={<AddProduct />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
export default App
