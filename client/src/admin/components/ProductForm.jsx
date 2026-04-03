import React from 'react'
import InventoryFields from "./InventoryFields.jsx";

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
            {/*Inventory*/}
            <InventoryFields
                inventory={formData.inventory}
                setFormData={setFormData}
            />


            {/* Price  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        min={0}
                        value={formData.price}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                    />
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
