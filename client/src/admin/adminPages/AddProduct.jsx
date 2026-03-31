import React from 'react'
import Title from "../../components/Title.jsx";
import ProductForm from "../adminComponents/ProductForm.jsx";

const AddProduct = () => {
    return (
        <div className='pt-10 w-full'>
            <div className='text-center py-8 text-3xl'>
                <Title text1='Add' text2='Product'/>
            </div>
            <ProductForm />

        </div>
    )
}
export default AddProduct
