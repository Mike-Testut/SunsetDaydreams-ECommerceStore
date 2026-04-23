import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'
import ProductForm, { NEW_OPTION } from '../components/ProductForm.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import useProductFormSubmit from '../hooks/useProductFormSubmit.js'
import { DEFAULT_INVENTORY } from "../utils/InventoryHelpers.js"
import { showToast } from "../../redux/features/shopSlice.js"

const AddProduct = () => {
    const token = useSelector(selectToken)
    const { submitting, submitProduct } = useProductFormSubmit()
    const dispatch = useDispatch()

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

    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [customCategory, setCustomCategory] = useState('')
    const [customSubcategory, setCustomSubcategory] = useState('')

    const fileInputRef = useRef(null)


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true)

                const response = await fetch(`${API_URL}/api/categories`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Failed to load categories')
                }

                setCategories(data.categories || [])
            } catch (error) {
                console.log('Could not fetch categories:', error)
                setError(error.message || 'Something went wrong loading categories')
            } finally {
                setCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const categoryOptions = useMemo(() => {
        return categories.map((category) => category.name)
    }, [categories])

    const selectedCategoryName =
        formData.category === NEW_OPTION ? customCategory.trim() : formData.category

    const subCategoryOptions = useMemo(() => {
        const selectedCategory = categories.find(
            (category) => category.name === selectedCategoryName
        )

        return selectedCategory?.subcategories || []
    }, [categories, selectedCategoryName])

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            subcategory: '',
            inventory: DEFAULT_INVENTORY,
            bestseller: false,
        })
        setImages([])
        setError('')
        setImageError('')
        setCustomCategory('')
        setCustomSubcategory('')

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const refreshCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`)
            const data = await response.json()

            if (response.ok && data.success) {
                setCategories(data.categories || [])
            }
        } catch (error) {
            console.log('Could not refresh categories:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const resolvedCategory =
            formData.category === NEW_OPTION
                ? customCategory.trim()
                : formData.category.trim()

        const resolvedSubcategory =
            formData.subcategory === NEW_OPTION
                ? customSubcategory.trim()
                : formData.subcategory.trim()

        if (!resolvedCategory) {
            setError('Please select or enter a category')
            return
        }

        if (!resolvedSubcategory) {
            setError('Please select or enter a subcategory')
            return
        }

        const result = await submitProduct({
            url: `${API_URL}/api/products/add`,
            method: 'POST',
            token,
            formData: {
                ...formData,
                category: resolvedCategory,
                subcategory: resolvedSubcategory,
            },
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

        dispatch(showToast("Product Added Successfully"))
        resetForm()
        await refreshCategories()
    }

    if (categoriesLoading) {
        return <div className="w-full p-6">Loading product form...</div>
    }

    return (
        <div className="w-full max-w-5xl">
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
                    categoryOptions={categoryOptions}
                    subCategoryOptions={subCategoryOptions}
                    customCategory={customCategory}
                    setCustomCategory={setCustomCategory}
                    customSubcategory={customSubcategory}
                    setCustomSubcategory={setCustomSubcategory}
                />

                <ImageUploader
                    images={images}
                    setImages={setImages}
                    imageError={imageError}
                    setImageError={setImageError}
                    fileInputRef={fileInputRef}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white py-3 px-6 rounded w-fit disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    )
}

export default AddProduct