import {ShopContext} from "./ShopContext.jsx";
import { MockProducts } from "../assets/MockProducts.js";


const ShopContextProvider = (props) => {
    const currency = '$';
    const shippingFee = 10;


    const value = {
        MockProducts,
        currency,
        shippingFee,
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;