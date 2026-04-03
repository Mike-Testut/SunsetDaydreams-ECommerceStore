import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'
import ProductForm from '../components/ProductForm.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import useProductFormSubmit from '../hooks/useProductFormSubmit.js'
import {DEFAULT_INVENTORY} from "../utils/InventoryHelpers.js";
const AddProduct = () => {
    const token = useSelector(selectToken)
    const { submitting, submitProduct } = useProductFormSubmit()


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        inventory: DEFAULT_INVENTORY,
        bestseller: false,
    })

    const [images, setImages] = useState([])
    const [error, setError] = useState('')
    const [imageError, setImageError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const fileInputRef = useRef(null)

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            subcategory: '',
            inventory:DEFAULT_INVENTORY,
            bestseller: false,
        })
        setImages([])
        setError('')
        setImageError('')
        setSuccessMessage('')

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        const result = await submitProduct({
            url: `${API_URL}/api/products/add`,
            method: 'POST',
            token,
            formData,
            images,
            imageError,
            isEdit: false,
        })

        if (result.validationError) {
            setError(result.validationError)
            return
        }

        if (!result.success) {
            setError(result.data?.message || result.data?.error || 'Failed to add product')
            return
        }

        setSuccessMessage('Product added successfully')
        resetForm()
    }

    return (
        <div className="w-full p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-medium">Add Product</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Create a new product for your store
                </p>
            </div>

            <form className="w-full max-w-4xl flex flex-col gap-6" onSubmit={handleSubmit}>
                <ProductForm
                    formData={formData}
                    setFormData={setFormData}
                />

                <ImageUploader
                    images={images}
                    setImages={setImages}
                    imageError={imageError}
                    setImageError={setImageError}
                    fileInputRef={fileInputRef}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white py-3 px-6 rounded w-fit disabled:opacity-50"
                >
                    {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    )
}

export default AddProduct