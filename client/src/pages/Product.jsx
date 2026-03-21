import React, {useEffect, useMemo, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Title from "../components/Title.jsx";
import ProductPreview from "../components/ProductPreview.jsx";
import {addToCart, showToast} from "../redux/features/shopSlice.js";

const Product = () => {
    const {productId} = useParams();
    const dispatch = useDispatch();

    const products = useSelector(state => state.shop.products);
    const currency = useSelector(state => state.shop.currency);

    const productData = useMemo(() => {
        return products.find((item)  => item._id === productId);
    },[products, productId]);

    const [image, setImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        if(productData){
            setImage(productData.image[0]);
            setSelectedSize(productData.sizes?.[0] || '')
        }
    }, [productData]);

    const relatedProducts = useMemo(() => {
        if (!productData) return []

        return products
            .filter((item) =>
                item._id !== productData._id &&
                item.category === productData.category
            )
            .slice(0, 4)
    }, [products, productData])

    return productData ? (
            <div className="pt-10 transition-opacity ease-in duration-500 opacity-100">
                <div className=" mb-3" >
                    <Link to={`/${productData.category}`}>
                        {productData.category.toString().charAt(0).toUpperCase()+productData.category.toString().slice(1)}
                    </Link> /
                    <Link to={`/${productData.category}`}>
                        {productData.subcategory.toString().charAt(0).toUpperCase()+productData.subcategory.toString().slice(1)}
                    </Link> /
                    <Link to={`/products/${productData._id}`}>
                        {productData.name}
                    </Link>
                </div>
                <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                    {/* Product Images */}
                    <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                        <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full justify-between sm:justify-normal sm:gap-3">
                            {productData.image.map((item, index) => (
                                <img
                                    onClick={() => setImage(item)}
                                    src={item}
                                    key={index}
                                    alt={productData.name}
                                    className={`w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer border ${
                                        image === item ? 'border-gray-500' : 'border-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="w-full sm:w-[80%]">
                            <img
                                className="w-full h-auto"
                                src={image}
                                alt={productData.name}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

                        <p className="mt-5 text-3xl font-medium">
                            {currency}
                            {productData.price}
                        </p>

                        <p className="mt-5 text-gray-500 md:w-4/5">
                            {productData.description}
                        </p>

                        <div className="flex flex-col gap-4 my-8">
                            <p className="font-medium">Select Size</p>
                            <div className="flex gap-2">
                                {productData.sizes?.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(item)}
                                        className={`border py-2 px-4 bg-gray-100 cursor-pointer ease-in-out ${
                                            selectedSize === item
                                                ? 'border-orange-500'
                                                : 'border-gray-200 hover:border-black'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!selectedSize) {
                                    alert("Please select a size")
                                    return
                                }

                                dispatch(addToCart({
                                    productId: productData._id,
                                    size: selectedSize
                                }))
                                dispatch(showToast(`${productData.name} (${selectedSize}) added to cart`))
                            }}
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

                {/* Description Section */}
                <div className="mt-20">
                    <div className="flex">
                        <b className="border px-5 py-3 text-sm">Description</b>
                        <p className="border px-5 py-3 text-sm">Reviews (0)</p>
                    </div>

                    <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                        <p>{productData.description}</p>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="my-24">
                        <div className="text-center text-3xl py-8">
                            <Title text1="RELATED" text2="PRODUCTS" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                            {relatedProducts.map((item) => (
                                <ProductPreview
                                    key={item._id}
                                    id={item._id}
                                    image={item.image}
                                    name={item.name}
                                    price={item.price}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
    ) :
        <div className="pt-10 items-center">
            <p className="text-lg font-medium mb-4 text-center">Product not found.</p>
            <Link to="/" className="text-md underline flex justify-center mb-5">
                Return home
            </Link>
        </div>
}

export default Product