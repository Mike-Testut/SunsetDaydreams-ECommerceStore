import React, {use, useEffect, useState} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductPreview from "./ProductPreview.jsx";

const BestSellers = () => {
    const {MockProducts} = use(ShopContext);
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const bestProducts = MockProducts.filter((item)=>(item.bestseller));
        setBestSellers(bestProducts.slice(0,5));
    },[])

    return (
        <div className="my-10">
            <div className="text-center text-3xl py-8">
                <Title text1={"Best"} text2={"Sellers"} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    bestSellers.map((item, index) => (
                        <ProductPreview key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}
export default BestSellers
