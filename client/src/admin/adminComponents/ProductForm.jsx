import React from 'react'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const CATEGORY_OPTIONS = ['Men', 'Women', 'Accessories']
const SUBCATEGORY_OPTIONS = ['Tops', 'Bottoms', 'Outerwear', 'Swimwear', 'Hats', 'Bags']

const ProductForm = ({ formData, setFormData }) => {

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

    return (
        <>
            {/* Name */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded py-2.5 px-3.5"
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="border border-gray-300 rounded py-2.5 px-3.5"
                />
            </div>

            {/*  Category + Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Subcategory</label>
                    <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Select subcategory</option>
                        {SUBCATEGORY_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>


            {/* Price + Sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Sizes</label>
                    <div className="flex flex-wrap gap-4 h-full items-center">
                        {SIZE_OPTIONS.map(size => (
                            <label key={size}>
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={formData.sizes.includes(size)}
                                    onChange={handleSizeChange}
                                />
                                <span> {size}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {/* Bestseller */}
            <label className="flex gap-2">
                <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                />
                Bestseller
            </label>
        </>
    )
}

export default ProductForm
