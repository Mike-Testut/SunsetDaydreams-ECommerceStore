import Category from '../models/CategoryModel.js'

const normalizeValue = (value = '') => {
    return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export const ensureCategoryExists = async (categoryName, subcategoryName) => {
    const normalizedCategory = normalizeValue(categoryName)
    const normalizedSubcategory = normalizeValue(subcategoryName)

    if (!normalizedCategory) {
        throw new Error('Category is required')
    }

    let category = await Category.findOne({ name: normalizedCategory })

    if (!category) {
        category = await Category.create({
            name: normalizedCategory,
            subcategories: normalizedSubcategory ? [normalizedSubcategory] : [],
        })

        return {
            category: normalizedCategory,
            subcategory: normalizedSubcategory,
            categoryDoc: category,
        }
    }

    if (
        normalizedSubcategory &&
        !category.subcategories.includes(normalizedSubcategory)
    ) {
        category.subcategories.push(normalizedSubcategory)
        await category.save()
    }

    return {
        category: normalizedCategory,
        subcategory: normalizedSubcategory,
        categoryDoc: category,
    }
}