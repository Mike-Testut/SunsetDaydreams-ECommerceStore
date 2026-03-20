import React, {useEffect,useMemo, useRef} from 'react'
import {assets} from "../assets/assets.js";
import { useDispatch, useSelector } from 'react-redux'
import {clearSearch, setSearch, setShowSearch} from '../redux/features/shopSlice.js'
import {useNavigate} from "react-router-dom";
import {filterProducts} from "../utils/filterProducts.js";

const SearchBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchWrapperRef = useRef(null);

    const search = useSelector(state => state.shop.search);
    const showSearch = useSelector((state) => state.shop.showSearch)
    const products = useSelector(state => state.shop.products);
    

    const suggestions = useMemo(() => {
        return filterProducts(products, search).slice(0, 4);
    }, [products, search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showSearch &&
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target)
            ) {
                dispatch(setShowSearch(false));
                dispatch(clearSearch());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearch, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedSearch = search.trim();
        if (!trimmedSearch) return;

        dispatch(setShowSearch(false));
        navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    }

    return showSearch ? (
        <>
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => {
                    dispatch(setShowSearch(false));
                    dispatch(clearSearch());
                }}
            />

            <div className="fixed top-[88px] left-0 right-0 z-50 px-4">
                <div ref={searchWrapperRef} className="relative max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center border border-gray-300 px-5 py-3 rounded-full bg-white shadow-lg">
                            <input
                                value={search}
                                onChange={(e) => dispatch(setSearch(e.target.value))}
                                className="flex-1 outline-none bg-transparent text-sm"
                                type="text"
                                placeholder="Search products"
                                autoFocus
                            />

                            <button type="submit" className="flex items-center justify-center">
                                <img
                                    src={assets.SearchIcon}
                                    alt="search icon"
                                    className="w-4 cursor-pointer"
                                />
                            </button>

                            <img
                                onClick={() => {
                                    dispatch(setShowSearch(false));
                                    dispatch(clearSearch());
                                }}
                                src={assets.cross_icon}
                                alt="cross-icon"
                                className="w-3 cursor-pointer ml-4"
                            />
                        </div>
                    </form>

                    {search.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                                {suggestions.length > 0 ? (
                                    <>
                                        {suggestions.map((item) => (
                                            <button
                                                key={item._id}
                                                type="button"
                                                onClick={() => {
                                                    dispatch(setShowSearch(false));
                                                    navigate(`/products/${item._id}`);
                                                    dispatch(clearSearch());
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition text-left border-b last:border-b-0 cursor-pointer"
                                            >
                                                <img
                                                    src={item.image[0]}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize">
                                                        {item.category} • {item.subCategory}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                dispatch(setShowSearch(false));
                                                navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                                            }}
                                            className="w-full px-4 py-3 text-sm font-medium text-center hover:bg-gray-200 transition cursor-pointer"
                                        >
                                            View all results for "{search}"
                                        </button>
                                    </>
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500">
                                        No matching products found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    ) : null
}
export default SearchBar
