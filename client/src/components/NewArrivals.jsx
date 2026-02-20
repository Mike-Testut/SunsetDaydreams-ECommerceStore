import React, {use, useEffect, useState} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import ProductPreview from "./ProductPreview.jsx";
import Title from "./Title.jsx";

const NewArrivals = () => {
    const { MockProducts } = use(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    useEffect(() => {
        setLatestProducts(MockProducts.slice(0,10));
    },[])
    // console.log(MockProducts);
    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1="NEW" text2="ARRIVALS" />
            </div>
        {/*    Display the products*/}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map((product, index) => (
                    <ProductPreview key={index} id={product._id} image={product.image} name={product.name} price={product.price} />
                ))}
            </div>
        </div>
    )
}
export default NewArrivals
