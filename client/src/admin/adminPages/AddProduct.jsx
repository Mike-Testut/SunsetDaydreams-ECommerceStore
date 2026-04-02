import React from 'react'
import Title from "../../components/Title.jsx";
import ProductForm from "../adminComponents/ProductForm.jsx";

const AddProduct = () => {
    return (
        <div className='pt-10 w-full items-start'>
            <div className='text-center mb-5'>
                <h1 className="text-2xl font-medium">Add Product</h1>
            </div>
            <ProductForm />

        </div>
    )
}
export default AddProduct
