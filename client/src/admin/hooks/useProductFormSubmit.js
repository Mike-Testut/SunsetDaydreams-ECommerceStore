import { useState } from 'react'

const validateProductForm = ({ formData, images, imageError, isEdit = false }) => {
    if (!formData.name.trim()) return 'Product name is required'
    if (!formData.description.trim()) return 'Description is required'
    if (!formData.price) return 'Price is required'
    if (!formData.category) return 'Category is required'
    if (!formData.subcategory) return 'Subcategory is required'
    if (formData.sizes.length === 0) return 'Select at least one size'
    if (images.length === 0) {
        return isEdit ? 'At least one image is required' : 'Upload at least one image'
    }
    if (imageError) {
        return isEdit
            ? 'Please fix image upload errors before saving'
            : 'Please fix image upload errors before submitting'
    }

    return ''
}

const buildProductFormData = ({ formData, images, isEdit = false }) => {
    const payload = new FormData()

    payload.append('name', formData.name)
    payload.append('description', formData.description)
    payload.append('price', formData.price)
    payload.append('category', formData.category)
    payload.append('subcategory', formData.subcategory)
    payload.append('sizes', JSON.stringify(formData.sizes))
    payload.append('bestseller', String(formData.bestseller))

    if (isEdit) {
        const existingImages = images
            .filter((image) => image.type === 'existing')
            .map((image) => image.url)

        payload.append('existingImages', JSON.stringify(existingImages))
    }

    images
        .filter((image) => image.type === 'new')
        .forEach((image) => {
            payload.append('images', image.file)
        })

    return payload
}

const useProductFormSubmit = () => {
    const [submitting, setSubmitting] = useState(false)

    const submitProduct = async ({
                                     url,
                                     method,
                                     token,
                                     formData,
                                     images,
                                     imageError,
                                     isEdit = false,
                                 }) => {
        const validationError = validateProductForm({
            formData,
            images,
            imageError,
            isEdit,
        })

        if (validationError) {
            return {
                success: false,
                validationError,
                data: null,
            }
        }

        try {
            setSubmitting(true)

            const payload = buildProductFormData({
                formData,
                images,
                isEdit,
            })

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                return {
                    success: false,
                    validationError: '',
                    data,
                }
            }

            return {
                success: true,
                validationError: '',
                data,
            }
        } catch (error) {
            return {
                success: false,
                validationError: '',
                data: { message: error.message || 'Something went wrong' },
            }
        } finally {
            setSubmitting(false)
        }
    }

    return {
        submitting,
        submitProduct,
    }
}

export default useProductFormSubmit