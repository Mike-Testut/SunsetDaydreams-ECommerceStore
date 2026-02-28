import React, {use, useState} from 'react'
import {useParams} from "react-router-dom";
import {ShopContext} from "../context/ShopContext.jsx";
import {assets} from "../assets/assets.js";
import FilterBox from "../components/FilterBox.jsx";
import Title from "../components/Title.jsx";

const Collection = () => {
    const {category} = useParams();
    const { MockProducts } = use(ShopContext);
    const [filterProducts, setFilterProducts] = useState([]);


    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
            <FilterBox />
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text2={`${category.toUpperCase()}`} />
                {/*    Sort Bar */}
                    <select className={'border-2 border-gray-300 text-sm px-2'}>
                        <option value={"featured"}>Sort by: Featured</option>
                        <option value={"low-high"}>Sort by: Low to High</option>
                        <option value={"high-low"}>Sort by: High to Low</option>
                    </select>
                </div>
            </div>

        </div>
    )
}
export default Collection
