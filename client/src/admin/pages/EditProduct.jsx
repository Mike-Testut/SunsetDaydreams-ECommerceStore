import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'
import ProductForm from '../components/ProductForm.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import useProductFormSubmit from '../hooks/useProductFormSubmit.js'
import {DEFAULT_INVENTORY} from "../utils/InventoryHelpers.js";

const EditProduct = () => {
    const { productID } = useParams()
    const navigate = useNavigate()
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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [imageError, setImageError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const fileInputRef = useRef(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_URL}/api/products/${productID}`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    setError(data.message || 'Failed to load product')
                    return
                }

                const product = data.product

                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    category: product.category || '',
                    subcategory: product.subcategory || '',
                    inventory: product.inventory && product.inventory.length > 0
                        ? product.inventory
                        : DEFAULT_INVENTORY,
                    bestseller: !!product.bestseller,
                })

                setImages(
                    (product.images || []).map((url) => ({
                        id: crypto.randomUUID(),
                        type: 'existing',
                        url,
                    }))
                )
            } catch (error) {
                console.log(error)
                setError('Something went wrong loading the product')
            } finally {
                setLoading(false)
            }
        }

        if (productID) {
            fetchProduct()
        }
    }, [productID])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        const result = await submitProduct({
            url: `${API_URL}/api/products/update/${productID}`,
            method: 'PUT',
            token,
            formData,
            images,
            imageError,
            isEdit: true,
        })

        if (result.validationError) {
            setError(result.validationError)
            return
        }

        if (!result.success) {
            setError(result.data?.message || result.data?.error || 'Failed to update product')
            return
        }

        setSuccessMessage('Product updated successfully')
        setImageError('')

        setImages(
            (result.data.product.images || []).map((url) => ({
                id: crypto.randomUUID(),
                type: 'existing',
                url,
            }))
        )

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        setTimeout(() => {
            navigate('/admin/products')
        }, 800)
    }

    if (loading) {
        return <div className="p-6">Loading product...</div>
    }

    if (error && !formData.name) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return (
        <div className="w-full p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-medium">Edit Product</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Update product details, images, and display order
                    </p>
                </div>

                <Link
                    to="/admin/products"
                    className="border px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
                >
                    Back to Products
                </Link>
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

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-black text-white py-3 px-6 rounded w-fit disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>

                    <Link
                        to="/admin/products"
                        className="border py-3 px-6 rounded w-fit"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default EditProduct