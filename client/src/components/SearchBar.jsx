import React, {useContext, useEffect} from 'react'
import {assets} from "../assets/assets.js";
import {ShopContext} from "../context/ShopContext.jsx";
import {useLocation} from "react-router-dom";

const SearchBar = () => {
    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const location = useLocation();

    useEffect(() => {
        setShowSearch(false)
    },[location]);

    return showSearch ? (
        <div className="border-b bg-gray-50 text-center p-5">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 rounded-full w-3/4 sm:w-1/2">
                <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type='text' placeholder="search" />
                <img src={assets.SearchIcon} alt="search icon" className="w-4" />
            </div>
            <img onClick={()=>setShowSearch(false)}src={assets.cross_icon} alt="cross-icon" className=" inline w-3 cursor-pointer" />
        </div>
    ) : null
}
export default SearchBar
