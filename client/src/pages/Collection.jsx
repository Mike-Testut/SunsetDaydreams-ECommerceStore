import React, { useMemo, useState} from 'react'
import {useParams} from "react-router-dom";
import FilterBox from "../components/FilterBox.jsx";
import Title from "../components/Title.jsx";
import ProductPreview from "../components/ProductPreview.jsx";
import { useSelector } from 'react-redux'
import {sortProducts} from "../utils/sortProducts.js";

const Collection = () => {
    const {category} = useParams();
    const products = useSelector((state) => state.shop.products)
    const [sortType, setSortType] = useState("newest");
    const [subcategory, setSubcategory] = useState([]);

    const toggleSubcategory = (e) => {
        if(subcategory.includes(e.target.value)) {
            setSubcategory(prev=>prev.filter(item=>item !== e.target.value));
        } else {
            setSubcategory(prev => [...prev, e.target.value]);
        }
    }
    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (category?.length > 0) {
            filtered = filtered.filter(item => item.category?.toLowerCase() === category.toLowerCase()  )
        }

        if (subcategory.length > 0) {
            filtered = filtered.filter(item => subcategory.includes(item.subcategory))
        }

        return sortProducts(filtered, sortType)
    }, [products, category, subcategory, sortType])



    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
            <FilterBox handleToggle={toggleSubcategory} />
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text2={category ? `${category.toUpperCase()}`: 'COLLECTION'} />
                    {/*    Sort Bar */}
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="newest">Sort by: Newest</option>
                        <option value="oldest">Sort by: Oldest</option>
                        <option value="price-low">Sort by: Price-Low to High</option>
                        <option value="price-high">Sort by: Price-High to Low</option>
                        <option value="name-asc">Sort by: Name A-Z</option>
                        <option value="name-desc">Sort by: Name Z-A</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 py-5">

                    {filteredProducts.length > 0 ?
                        filteredProducts.map((product,index) => (
                            <ProductPreview key={index} id={product._id} name={product.name} price={product.price} images={product.images} />
                        )) :
                        <p>Sorry no products found matching your criteria</p>
                    }


                </div>
            </div>

        </div>
    )
}
export default Collection
