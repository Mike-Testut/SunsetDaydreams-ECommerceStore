import React, {useEffect, useMemo, useState} from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const CATEGORY_OPTIONS = ['Men', 'Women', 'Accessories']
const SUBCATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Outerwear', 'Swimwear', 'Hats', 'Bags']

const ProductForm = () => {
    const token = useSelector(selectToken)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        sizes: [],
        bestseller: false,
    })

    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' && name === 'bestseller' ? checked : value,
        }))
    }

    const handleSizeChange = (e) => {
        const { value, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            sizes: checked
                ? [...prev.sizes, value]
                : prev.sizes.filter((size) => size !== value),
        }))
    }

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || [])
        setImages(selectedFiles)
    }
    const imagePreviews = useMemo(() => {
        return images.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))
    }, [images])

    useEffect(() => {
        return () => {
            imagePreviews.forEach((image) => URL.revokeObjectURL(image.preview))
        }
    }, [imagePreviews])
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            subcategory: '',
            sizes: [],
            bestseller: false,
        })
        setImages([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (!formData.name.trim()) return setError('Product name is required')
        if (!formData.description.trim()) return setError('Description is required')
        if (!formData.price) return setError('Price is required')
        if (!formData.category) return setError('Category is required')
        if (!formData.subcategory) return setError('Subcategory is required')
        if (formData.sizes.length === 0) return setError('Select at least one size')
        if (images.length === 0) return setError('Upload at least one image')

        try {
            setLoading(true)

            const payload = new FormData()
            payload.append('name', formData.name)
            payload.append('description', formData.description)
            payload.append('price', formData.price)
            payload.append('category', formData.category)
            payload.append('subcategory', formData.subcategory)
            payload.append('sizes', JSON.stringify(formData.sizes))
            payload.append('bestseller', String(formData.bestseller))

            images.forEach((image) => {
                payload.append('images', image)
            })

            const response = await fetch(`${API_URL}/api/products/add`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                setError(data.message || data.error || 'Failed to add product')
                return
            }

            setSuccessMessage('Product added successfully')
            resetForm()
        } catch (error) {
            console.log(error)
            setError('Something went wrong adding the product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <form
                className="w-full max-w-3xl mx-auto flex flex-col gap-5"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows="5"
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                        >
                            <option value="">Select category</option>
                            {CATEGORY_OPTIONS.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Subcategory</label>
                    <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                    >
                        <option value="">Select subcategory</option>
                        {SUBCATEGORY_OPTIONS.map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">Available Sizes</label>
                    <div className="flex flex-wrap gap-4">
                        {SIZE_OPTIONS.map((size) => (
                            <label key={size} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={formData.sizes.includes(size)}
                                    onChange={handleSizeChange}
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="bestseller"
                        type="checkbox"
                        name="bestseller"
                        checked={formData.bestseller}
                        onChange={handleChange}
                    />
                    <label htmlFor="bestseller" className="text-sm font-medium">
                        Mark as bestseller
                    </label>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Product Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
                    />

                    {images.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-500">
                                {images.length} image{images.length !== 1 ? 's' : ''} selected
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">

                                {imagePreviews.map((image, index) => (
                                    <div
                                        key={index}
                                        className="border rounded overflow-hidden bg-gray-50 aspect-square"
                                    >
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white py-3 px-6 rounded w-full md:w-fit disabled:opacity-50"
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    )
}

export default ProductForm