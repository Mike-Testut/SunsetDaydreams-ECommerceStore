import React, {useEffect, useMemo} from 'react'
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearSearch, setSearch, setShowSearch} from "../redux/features/shopSlice.js";
import {filterProducts} from "../utils/filterProducts.js";
import Title from "../components/Title.jsx";
import ProductPreview from "../components/ProductPreview.jsx";

const SearchResults = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.shop.products);

    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        dispatch(setSearch(query));
        dispatch(setShowSearch(false));
        dispatch(clearSearch());
    },[query,dispatch]);

    const results = useMemo(() => {
        return filterProducts(products, query);
    },[products, query]);

    return (
        <div className="pt-10">
            <div className="text-2xl sm:text-3xl mb-6 text-center">
                <Title text1="SEARCH" text2="RESULTS" />
            </div>

            <p className="text-lg text-gray-500 mb-6">
                {query ? `Showing results for "${query}"` : 'Enter a search term'}
            </p>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 py-5">
                    {results.map((product) => (
                        <ProductPreview
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center m-5">No products found.</p>
            )}
        </div>
    )
}
export default SearchResults
