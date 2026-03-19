import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import FilterBox from "../components/FilterBox.jsx";
import Title from "../components/Title.jsx";
import ProductPreview from "../components/ProductPreview.jsx";
import { useSelector } from 'react-redux'

const Collection = () => {
    const {category} = useParams();
    const products = useSelector((state) => state.shop.products)
    const [filterProducts, setFilterProducts] = useState([]);
    const [sortType, setSortType] = useState("newest");
    const [subcategory, setSubcategory] = useState([]);

    const toggleSubcategory = (e) => {
        if(subcategory.includes(e.target.value)) {
            setSubcategory(prev=>prev.filter(item=>item !== e.target.value));
        } else {
            setSubcategory(prev => [...prev, e.target.value]);
        }

    }

    const applyFilter = () => {
        let filtered = products.slice()
        if(category.length>0){
            filtered = filtered.filter(item=>category == item.category)
        }
        if(subcategory.length>0){
            filtered = filtered.filter(item=>subcategory.includes(item.subCategory));
        }
        setFilterProducts(filtered);
    }

    const sortProducts = () => {
        let sortedProducts = filterProducts.slice()
        switch (sortType) {
            case "low-high":
                setFilterProducts(sortedProducts.sort((a, b) => (a.price - b.price)));
                break;
            case "high-low":
                setFilterProducts(sortedProducts.sort((a, b) => (b.price - a.price)));
                break;
            default:
                applyFilter();
                break;
        }
    }

    useEffect(() => {
        applyFilter();
    },[category,subcategory]);

    useEffect(() => {
        sortProducts();
    },[sortType])


    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
            <FilterBox handleToggle={toggleSubcategory} />
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text2={`${category.toUpperCase()}`} />
                    {/*    Sort Bar */}
                    <select onChange={(e)=>setSortType(e.target.value)} className={'border-2 border-gray-300 text-sm' +
                        ' px-2'}>
                        <option value={"newest"}>Sort by: Newest</option>
                        <option value={"low-high"}>Sort by: Price-Low to High</option>
                        <option value={"high-low"}>Sort by: Price-High to Low</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 py-5">

                    {filterProducts.length > 0 ?
                        filterProducts.map((product,index) => (
                            <ProductPreview key={index} id={product._id} name={product.name} price={product.price} image={product.image} />
                        )) :
                        <p>Sorry no products found matching your criteria</p>
                    }


                </div>
            </div>

        </div>
    )
}
export default Collection
