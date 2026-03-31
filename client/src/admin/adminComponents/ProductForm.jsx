import React from 'react'

const ProductForm = () => {
    const handleSubmit = () => {
        return
    }

    return (
        <div className='w-full'>
            <form className='w-full flex flex-col gap-4 items-center' onSubmit={handleSubmit}>
                <input type='text' name='name' placeholder='Product Name' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
                <textarea name='description' placeholder='Description' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
                <input type="number" name='price' placeholder='Price' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
                <input type="select" name='category' placeholder='Category' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
                <input type="select" name='subcategory' placeholder='Subcategory' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
                <label>Available Sizes</label>
                <input id='XS' type="checkbox" name='sizes' value='XS' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2'/>

            </form>
        </div>
    )
}
export default ProductForm
