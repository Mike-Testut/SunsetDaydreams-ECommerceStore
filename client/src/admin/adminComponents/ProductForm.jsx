import React, {useEffect, useMemo, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../redux/features/authSlice.js'
import { API_URL } from '../../config/api.js'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const CATEGORY_OPTIONS = ['Men', 'Women', 'Accessories']
const SUBCATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Outerwear', 'Swimwear', 'Hats', 'Bags']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_IMAGE_COUNT = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', `image/webp`]

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
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [isDraggingFiles, setIsDraggingFiles] = useState(false)
    const [imageError, setImageError] = useState('')
    const fileInputRef = useRef(null)
    const isMaxImagesReached = images.length >= MAX_IMAGE_COUNT


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

    const addImages = (newFiles, validationErrors = []) => {
        setImages((prev) => {
            const availableSlots = MAX_IMAGE_COUNT - prev.length

            if (availableSlots <= 0) {
                setImageError(
                    [...validationErrors, `You can upload a maximum of ${MAX_IMAGE_COUNT} images`].join('. ')
                )
                return prev
            }

            let countError = ''

            if (newFiles.length > availableSlots) {
                countError = `You can upload a maximum of ${MAX_IMAGE_COUNT} images. Only the first ${availableSlots} image${availableSlots !== 1 ? 's were' : ' was'} added`
            }

            const allErrors = [...validationErrors]
            if (countError) allErrors.push(countError)

            setImageError(allErrors.join('. '))

            return [...prev, ...newFiles.slice(0, availableSlots)]
        })
    }

    const handleImageChange = (e) => {
        if (isMaxImagesReached) {
            setImageError(`You can upload a maximum of ${MAX_IMAGE_COUNT} images`)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            return
        }

        const selectedFiles = Array.from(e.target.files || [])
        const { validFiles, errors } = validateFiles(selectedFiles)

        if (validFiles.length > 0) {
            addImages(validFiles, errors)
        } else {
            setImageError(errors.join('. '))
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const imagePreviews = useMemo(() => {
        return images.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))
    }, [images])

    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleDragStart = (index) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }
    const handleDrop = (dropIndex) => {
        if (draggedIndex === null || draggedIndex === dropIndex) return

        const reorderedImages = [...images]
        const [draggedImage] = reorderedImages.splice(draggedIndex, 1)
        reorderedImages.splice(dropIndex, 0, draggedImage)

        setImages(reorderedImages)
        setDraggedIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }
    //Drag and drop handlers
    const handleDragEnterFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFiles(true)
    }

    const handleDragOverFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFiles(true)
    }

    const handleDragLeaveFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFiles(false)
    }

    const handleDropFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFiles(false)

        if (isMaxImagesReached) {
            setImageError(`You can upload a maximum of ${MAX_IMAGE_COUNT} images`)
            return
        }

        const droppedFiles = Array.from(e.dataTransfer.files || [])
        const { validFiles, errors } = validateFiles(droppedFiles)

        if (validFiles.length > 0) {
            addImages(validFiles, errors)
        } else {
            setImageError(errors.join('. '))
        }
    }

    const validateFiles = (files) => {
        const validFiles = []
        const errors = []

        files.forEach((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`${file.name} is not a supported image type`)
                return
            }

            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} is larger than 5MB`)
                return
            }

            validFiles.push(file)
        })

        return { validFiles, errors }
    }

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
        setDraggedIndex(null)
        setImageError('')
        setError('')
        setSuccessMessage('')

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
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

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">Product Images</label>

                    <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <label
                        htmlFor={isMaxImagesReached ? undefined : "file-upload"}
                        onDragEnter={isMaxImagesReached ? undefined : handleDragEnterFiles}
                        onDragOver={isMaxImagesReached ? undefined : handleDragOverFiles}
                        onDragLeave={isMaxImagesReached ? undefined : handleDragLeaveFiles}
                        onDrop={isMaxImagesReached ? undefined : handleDropFiles}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                            isMaxImagesReached
                                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-70'
                                : isDraggingFiles
                                    ? 'border-black bg-gray-100 cursor-pointer'
                                    : 'border-gray-300 bg-white hover:bg-gray-50 cursor-pointer'
                        }`}
                    >
                        <p className="text-sm font-medium text-gray-700">
                            {isMaxImagesReached
                                ? `Maximum of ${MAX_IMAGE_COUNT} images reached`
                                : 'Drag & drop images here or click to upload'}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, JPEG, WEBP up to 5MB each — max {MAX_IMAGE_COUNT} images
                        </p>
                    </label>

                    {images.length === 0 ? (
                        <p className="text-sm text-gray-500">No images selected</p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            {images.length} / {MAX_IMAGE_COUNT} images selected
                        </p>
                    )}

                    {imageError && (
                        <p className="text-sm text-red-500">{imageError}</p>
                    )}

                    {images.length > 0 && (
                        <>
                            <p className="text-sm text-gray-500">
                                Drag and drop preview images to choose display order
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviews.map((image, index) => (
                                    <div
                                        key={`${image.file.name}-${index}`}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        onDragEnd={handleDragEnd}
                                        className={`relative border rounded overflow-hidden bg-gray-50 aspect-square cursor-move ${
                                            draggedIndex === index ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            #{index + 1}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black text-xs px-2 py-1 rounded shadow cursor-pointer"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
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