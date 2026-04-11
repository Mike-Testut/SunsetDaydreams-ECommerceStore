import React from 'react'
import ProductPreview from "./ProductPreview.jsx";

const RecommendedProducts = ({ title = "You May Also Like", products = [] }) => {
    if (!products.length) return null

    return (
        <div className="mt-16">
            <div className="mb-6">
                <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
                {products.map((product,index) => (
                    <ProductPreview key={index} id={product._id} name={product.name} price={product.price} images={product.images}/>
                ))}
            </div>
        </div>
    )
}

export default RecommendedProducts