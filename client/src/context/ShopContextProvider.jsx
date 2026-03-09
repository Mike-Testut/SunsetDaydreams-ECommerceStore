import {ShopContext} from "./ShopContext.jsx";
import { MockProducts } from "../assets/MockProducts.js";
import {useState} from "react";


const ShopContextProvider = (props) => {
    const currency = '$';
    const shippingFee = 10;
    const [search,setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const value = {
        MockProducts,
        currency,
        shippingFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;