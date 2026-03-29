import React from 'react'
import Title from "../components/Title.jsx";
import {Link} from "react-router-dom";

const AccountHome = () => {

    return (
        <div className="pt-10">
            <div className="text-xl mb-8 text-center">
                <Title text1="ACCOUNT" text2="HOME" />
            </div>
            <div>
                <ul>

                    <li><Link to='/account/orders'>My Orders</Link></li>
                    <li>My Wishlist</li>
                    <li>My Rewards</li>
                    <li>Account Settings</li>
                </ul>
            </div>
        </div>
    )
}
export default AccountHome
