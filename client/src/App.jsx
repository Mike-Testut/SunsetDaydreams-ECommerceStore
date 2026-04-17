import React from 'react'
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Collection from "./pages/Collection.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AddProduct from "./admin/pages/AddProduct.jsx";
import StoreLayout from "./layouts/storeLayout.jsx";
import AdminLayout from "./admin/layouts/adminLayout.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Product from "./pages/Product.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderPlaced from "./pages/OrderPlaced.jsx";
import AccountHome from "./pages/AccountHome.jsx";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./admin/components/AdminRoute.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";
import AllProducts from "./admin/pages/AllProducts.jsx";
import Customers from "./admin/pages/Customers.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import EditProduct from "./admin/pages/EditProduct.jsx";
import NotificationsPage from "./admin/pages/NotificationsPage.jsx";


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
                <Route path="products" element={<AllProducts />} />
                <Route path="products/:productID" element={<EditProduct/>} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
export default App
