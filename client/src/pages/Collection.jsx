import React, {use, useState} from 'react'
import {useParams} from "react-router-dom";
import {ShopContext} from "../context/ShopContext.jsx";
import {assets} from "../assets/assets.js";
import FilterBox from "../components/FilterBox.jsx";

const Collection = () => {
    const {category} = useParams();
    const { MockProducts } = use(ShopContext);


    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
            <FilterBox />

        </div>
    )
}
export default Collection
