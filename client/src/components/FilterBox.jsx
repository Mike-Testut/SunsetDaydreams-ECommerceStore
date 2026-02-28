import React, {useState} from 'react'
import {assets} from "../assets/assets.js";

const FilterBox = () => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div>
            <div className="min-w-60">
                <p onClick={()=>setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FILTERS
                    <img className={`h-3 ${showFilters ? 'rotate-90': ''}`} src={assets.dropdown_icon} alt=""  />
                </p>
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? ' ' : 'hidden'}`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Shirts'} />Shirts
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Sweaters & Sweatshirts'} />Sweaters & Sweatshirts
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Outerwear'} />Outerwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Swim'} />Swim
                        </p>
                    </div>
                </div>
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilters ? ' ' : 'hidden'}`}>
                    <p className="mb-3 text-sm font-medium">SIZE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Small'} />S
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Medium'} />M
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Large'} />L
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value={'Extra Large'} />XL
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FilterBox
