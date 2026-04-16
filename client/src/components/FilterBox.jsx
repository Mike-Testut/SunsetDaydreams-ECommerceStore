import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {formatLabel} from "../utils/formatLabel.js";

const FilterBox = ({ subcategoryOptions = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const selectedSubcategory = searchParams.get('subcategory') || ''

    const handleSubcategoryChange = (value) => {
        const nextParams = new URLSearchParams(searchParams)

        if (selectedSubcategory === value) {
            nextParams.delete('subcategory')
        } else {
            nextParams.set('subcategory', value)
        }

        setSearchParams(nextParams)
    }

    const clearFilters = () => {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('subcategory')
        setSearchParams(nextParams)
    }

    if (!subcategoryOptions.length) return null

    return (
        <div className="min-w-60">
            <div className="border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="font-medium">Filters</p>

                    {selectedSubcategory && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm text-gray-500 underline cursor-pointer"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium mb-3">Subcategory</p>

                    <div className="flex flex-col gap-2">
                        {subcategoryOptions.map((subcategory) => (
                            <label
                                key={subcategory}
                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSubcategory === subcategory}
                                    onChange={() => handleSubcategoryChange(subcategory)}
                                />
                                {formatLabel(subcategory)}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox