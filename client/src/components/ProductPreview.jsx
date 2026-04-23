import React from 'react'
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

const ProductPreview = ({ id, images, name, price }) => {
    const currency = useSelector((state) => state.shop.currency)

    const firstImage = images?.[0]
    const secondImage = images?.[1]

    return (
        <Link className='text-gray-700 cursor-pointer group' to={`/products/${id}`}>
            <div className="overflow-hidden relative">
                {/* First Image */}
                <img
                    className='w-full h-full object-cover transition duration-300 group-hover:opacity-0'
                    src={firstImage}
                    alt={name}
                />

                {/* Second Image (on hover) */}
                {secondImage && (
                    <img
                        className='w-full h-full object-cover absolute top-0 left-0 opacity-0 transition duration-300 group-hover:opacity-100'
                        src={secondImage}
                        alt={`${name} alt`}
                    />
                )}
            </div>

            <p className="pt-3 pb-1 text-sm leading-tight line-clamp-2 min-h-10">{name}</p>
            <p className="text-sm font-medium">{currency}{price}</p>
        </Link>
    )
}

export default ProductPreview