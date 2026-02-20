import React, {use} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import {Link} from "react-router-dom";

const ProductPreview = ({id,image,name,price}) => {

    const {currency} = use(ShopContext);

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/products/${id}`}>
            <div className='overflow-hidden'>
                <img className='hover:scale-110 ease-in-out' src={image[0]} alt='product image'/>
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}
export default ProductPreview
