import React, { useEffect, useMemo, useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_IMAGE_COUNT = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const ImageUploader = ({
                           images,
                           setImages,
                           imageError,
                           setImageError,
                           fileInputRef,
                       }) => {
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [isDraggingFiles, setIsDraggingFiles] = useState(false)

    const isMaxImagesReached = images.length >= MAX_IMAGE_COUNT

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

    const addImages = (filesToAdd, validationErrors = []) => {
        setImages((prev) => {
            const availableSlots = MAX_IMAGE_COUNT - prev.length

            if (availableSlots <= 0) {
                setImageError(
                    [...validationErrors, `You can upload a maximum of ${MAX_IMAGE_COUNT} images`].join('. ')
                )
                return prev
            }

            let countError = ''

            if (filesToAdd.length > availableSlots) {
                countError = `You can upload a maximum of ${MAX_IMAGE_COUNT} images. Only the first ${availableSlots} image${availableSlots !== 1 ? 's were' : ' was'} added`
            }

            const allErrors = [...validationErrors]
            if (countError) allErrors.push(countError)

            setImageError(allErrors.join('. '))

            const newImageItems = filesToAdd.slice(0, availableSlots).map((file) => ({
                id: crypto.randomUUID(),
                type: 'new',
                file,
            }))

            return [...prev, ...newImageItems]
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

    const handleDragEnterFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isMaxImagesReached) {
            setIsDraggingFiles(true)
        }
    }

    const handleDragOverFiles = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isMaxImagesReached) {
            setIsDraggingFiles(true)
        }
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

    const handleRemoveImage = (idToRemove) => {
        setImages((prev) => prev.filter((image) => image.id !== idToRemove))
        setImageError('')
    }

    const handleDragStart = (index) => {
        setDraggedIndex(index)
    }

    const handleDragOverCard = (e) => {
        e.preventDefault()
    }

    const handleDropCard = (dropIndex) => {
        if (draggedIndex === null || draggedIndex === dropIndex) return

        setImages((prev) => {
            const reordered = [...prev]
            const [movedItem] = reordered.splice(draggedIndex, 1)
            reordered.splice(dropIndex, 0, movedItem)
            return reordered
        })

        setDraggedIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    const newImagePreviews = useMemo(() => {
        return images
            .filter((image) => image.type === 'new')
            .map((image) => ({
                id: image.id,
                preview: URL.createObjectURL(image.file),
            }))
    }, [images])

    useEffect(() => {
        return () => {
            newImagePreviews.forEach((image) => URL.revokeObjectURL(image.preview))
        }
    }, [newImagePreviews])

    const getPreviewSrc = (image) => {
        if (image.type === 'existing') return image.url

        const match = newImagePreviews.find((item) => item.id === image.id)
        return match ? match.preview : ''
    }

    return (
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
                disabled={isMaxImagesReached}
            />

            <label
                htmlFor={isMaxImagesReached ? undefined : 'file-upload'}
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

            <p className="text-sm text-gray-500">
                {images.length} / {MAX_IMAGE_COUNT} images selected
            </p>

            {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
            )}

            {images.length > 0 && (
                <>
                    <p className="text-sm text-gray-500">
                        Drag preview cards to choose display order. Image #1 will be the main image.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOverCard}
                                onDrop={() => handleDropCard(index)}
                                onDragEnd={handleDragEnd}
                                className={`relative border rounded overflow-hidden bg-gray-50 aspect-square cursor-move ${
                                    draggedIndex === index ? 'opacity-50' : ''
                                }`}
                            >
                                <img
                                    src={getPreviewSrc(image)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    #{index + 1}
                                </div>

                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-white/90 text-black text-xs px-2 py-1 rounded">
                                        Main Image
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(image.id)}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black text-xs px-2 py-1 rounded shadow cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ImageUploader