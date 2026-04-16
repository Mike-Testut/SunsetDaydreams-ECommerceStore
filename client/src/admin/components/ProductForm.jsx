import React from 'react'
import InventoryFields from "./InventoryFields.jsx"
import {formatLabel} from "../../utils/formatLabel.js";

const NEW_OPTION = "__new__"


const ProductForm = ({
                         formData,
                         setFormData,
                         categoryOptions = [],
                         subCategoryOptions = [],
                         customCategory,
                         setCustomCategory,
                         customSubcategory,
                         setCustomSubcategory,
                     }) => {
    const isSubcategoryDisabled =
        !formData.category || formData.category === NEW_OPTION && !customCategory.trim()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' && name === 'bestseller' ? checked : value,
        }))
    }

    const handleCategoryChange = (e) => {
        const value = e.target.value

        setFormData((prev) => ({
            ...prev,
            category: value,
            subcategory: '',
        }))

        if (value !== NEW_OPTION) {
            setCustomCategory('')
        }

        setCustomSubcategory('')
    }

    const handleSubcategoryChange = (e) => {
        const value = e.target.value

        setFormData((prev) => ({
            ...prev,
            subcategory: value,
        }))

        if (value !== NEW_OPTION) {
            setCustomSubcategory('')
        }
    }

    return (
        <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Select category</option>
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {formatLabel(category)}
                            </option>
                        ))}
                        <option value={NEW_OPTION}>+ Create New Category</option>
                    </select>

                    {formData.category === NEW_OPTION && (
                        <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Enter new category"
                            className="border rounded px-3 py-2"
                        />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Subcategory</label>
                    <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleSubcategoryChange}
                        disabled={isSubcategoryDisabled}
                        className="border rounded px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {isSubcategoryDisabled ? 'Select category first' : 'Select subcategory'}
                        </option>

                        {subCategoryOptions.map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {formatLabel(subcategory)}
                            </option>
                        ))}

                        {!isSubcategoryDisabled && (
                            <option value={NEW_OPTION}>+ Create New Subcategory</option>
                        )}
                    </select>

                    {formData.subcategory === NEW_OPTION && (
                        <input
                            type="text"
                            value={customSubcategory}
                            onChange={(e) => setCustomSubcategory(e.target.value)}
                            placeholder="Enter new subcategory"
                            className="border rounded px-3 py-2"
                        />
                    )}
                </div>
            </div>

            <InventoryFields
                inventory={formData.inventory}
                setFormData={setFormData}
            />

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
export { NEW_OPTION }