import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, showToast } from "../redux/features/shopSlice.js"
import RecommendedProducts from "../components/RecommendedProducts.jsx";
import {getRecommendedProducts} from "../utils/getRecommendedProducts.js";


const Product = () => {
    const { productId } = useParams()
    const dispatch = useDispatch()

    const { products, currency } = useSelector((state) => state.shop)

    const [productData, setProductData] = useState(null)
    const [image, setImage] = useState("")
    const [size, setSize] = useState("")

    useEffect(() => {
        const product = products.find((item) => item._id === productId)

        if (product) {
            setProductData(product)
            setImage(product.images?.[0] || "")
        }

    }, [productId, products])

    const recommendedProducts = useMemo(() => {
        return getRecommendedProducts(productData, products, 4)
    }, [productData, products])

    const availableInventory = useMemo(() => {
        return productData?.inventory || []
    }, [productData])

    const selectedSizeInventory = useMemo(() => {
        return availableInventory.find((item) => item.size === size)
    }, [availableInventory, size])

    const handleAddToCart = () => {
        if (!productData) return

        if (!size) {
            dispatch(showToast("Please select a size"))
            return
        }

        if (!selectedSizeInventory || selectedSizeInventory.quantity <= 0) {
            dispatch(showToast("That size is out of stock"))
            return
        }

        dispatch(addToCart({ productId: productData._id, size }))
        dispatch(showToast("Added to cart"))
    }

    if (!productData) {
        return <div className="opacity-0"></div>
    }

    return (
        <div className="pt-10 transition-opacity ease-in duration-500 opacity-100">
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* Product Images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
                        {productData.images?.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                alt={`${productData.name} ${index + 1}`}
                                className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                            />
                        ))}
                    </div>

                    <div className="w-full sm:w-[80%]">
                        <img className="w-full h-auto" src={image} alt={productData.name} />
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

                    <p className="mt-5 text-3xl font-medium">
                        {currency}{productData.price}
                    </p>

                    <p className="mt-5 text-gray-500 md:w-4/5">
                        {productData.description}
                    </p>

                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>

                        <div className="flex gap-2 flex-wrap">
                            {availableInventory.map((item) => {
                                const isSoldOut = item.quantity <= 0
                                const isSelected = size === item.size

                                return (
                                    <button
                                        key={item.size}
                                        type="button"
                                        onClick={() => !isSoldOut && setSize(item.size)}
                                        disabled={isSoldOut}
                                        className={`border py-2 px-4 cursor-pointer ${
                                            isSelected ? 'border-orange-500 bg-orange-200' : ''
                                        } ${
                                            isSoldOut
                                                ? 'text-gray-500 cursor-not-allowed opacity-60' +
                                                ' bg-[linear-gradient(to_bottom_left,transparent_calc(50%-1px),black_50%,transparent_calc(50%+1px))]'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        {item.size}
                                    </button>
                                )
                            })}
                        </div>

                        {size && (
                            <p className={`text-sm ${
                                selectedSizeInventory?.quantity <= 0
                                    ? 'text-red-500'
                                    : selectedSizeInventory?.quantity <= 5
                                        ? 'text-orange-500'
                                        : 'text-gray-500'
                            }`}>
                                {selectedSizeInventory?.quantity > 0
                                    ? selectedSizeInventory?.quantity <=5 ?
                                        `Only ${selectedSizeInventory.quantity} left in stock. Checkout soon!` : ""
                                    : 'Out of stock'}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer"
                    >
                        ADD TO CART
                    </button>

                    <hr className="mt-8 sm:w-4/5" />

                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p>Category: {productData.category.toString().charAt(0).toUpperCase()+productData.category.toString().slice(1)}</p>
                        <p>Type: {productData.subcategory.toString().charAt(0).toUpperCase()+productData.subcategory.toString().slice(1)}</p>

                    </div>
                </div>
            </div>

            {/* Description & Review Section */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Description</b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>

                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>{productData.description}</p>
                </div>
            </div>

            {/* Display Related Products */}
            <RecommendedProducts
            tile="You might also like"
            products={recommendedProducts}
            />
        </div>
    )
}

export default Product