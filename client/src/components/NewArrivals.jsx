import React, {useContext} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";

const NewArrivals = () => {
    const { MockProducts } = useContext(ShopContext);
    return (
        <div>NewArrivals</div>
    )
}
export default NewArrivals
