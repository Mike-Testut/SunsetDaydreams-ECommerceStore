import React, { useMemo, useState } from 'react'
import { useParams, useSearchParams } from "react-router-dom"
import FilterBox from "../components/FilterBox.jsx"
import Title from "../components/Title.jsx"
import ProductPreview from "../components/ProductPreview.jsx"
import { useSelector } from 'react-redux'
import { sortProducts } from "../utils/sortProducts.js"

const Collection = () => {
    const { category } = useParams()
    const [searchParams] = useSearchParams()
    const products = useSelector((state) => state.shop.products)
    const [sortType, setSortType] = useState("newest")

    const selectedSubcategory = searchParams.get('subcategory') || ''

    const subcategoryOptions = useMemo(() => {
        const categoryProducts = category
            ? products.filter(
                (item) => item.category?.toLowerCase() === category.toLowerCase()
            )
            : products

        const normalizedMap = new Map()

        categoryProducts.forEach((item) => {
            const rawSubcategory = item.subcategory?.trim()
            if (!rawSubcategory) return

            const normalizedKey = rawSubcategory.toLowerCase()

            if (!normalizedMap.has(normalizedKey)) {
                normalizedMap.set(normalizedKey, rawSubcategory)
            }
        })

        return Array.from(normalizedMap.values())
    }, [products, category])

    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (category) {
            filtered = filtered.filter(
                (item) => item.category?.toLowerCase() === category.toLowerCase()
            )
        }

        if (selectedSubcategory) {
            filtered = filtered.filter(
                (item) =>
                    item.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
            )
        }

        return sortProducts(filtered, sortType)
    }, [products, category, selectedSubcategory, sortType])

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
            <FilterBox
                subcategoryOptions={subcategoryOptions}
            />

            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title
                        text2={
                            category
                                ? `${category.toUpperCase()}${selectedSubcategory ? ` / ${selectedSubcategory.toUpperCase()}` : ''}`
                                : 'COLLECTION'
                        }
                    />

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
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductPreview
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                images={product.images}
                            />
                        ))
                    ) : (
                        <p>Sorry no products found matching your criteria</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Collection