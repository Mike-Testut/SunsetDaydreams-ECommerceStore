import React, {useState} from 'react'
import {assets} from "../assets/assets.js";
import {useSearchParams} from "react-router-dom";
import {formatLabel} from "../utils/formatLabel.js";

const FilterBox = ({subcategoryOptions =[]}) => {
    const [showFilters, setShowFilters] = useState(true);

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
        <div>
            <div className="min-w-60">
                <div className="flex items-center justify-between mb-4">
                <p onClick={()=>setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FILTERS
                    <img className={`h-3 ${showFilters ? 'rotate-90': ''}`} src={assets.dropdown_icon} alt=""  />
                </p>
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
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? ' ' : 'hidden'}`}>
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
                {/*<div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? ' ' : 'hidden'}`}>*/}
                {/*    <p className="mb-3 text-sm font-medium">SIZE</p>*/}
                {/*    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">*/}
                {/*        <p className='flex gap-2'>*/}
                {/*            <input className='w-3' type='checkbox' value={'Small'} />S*/}
                {/*        </p>*/}
                {/*        <p className='flex gap-2'>*/}
                {/*            <input className='w-3' type='checkbox' value={'Medium'} />M*/}
                {/*        </p>*/}
                {/*        <p className='flex gap-2'>*/}
                {/*            <input className='w-3' type='checkbox' value={'Large'} />L*/}
                {/*        </p>*/}
                {/*        <p className='flex gap-2'>*/}
                {/*            <input className='w-3' type='checkbox' value={'Extra Large'} />XL*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}
export default FilterBox

