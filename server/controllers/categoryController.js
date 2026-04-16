import Category from '../models/categoryModel.js'

const normalizeValue = (value = '') => {
    return value.trim().replace(/\s+/g, ' ')
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({})
            .sort({ name: 1 })
            .lean()

        const formattedCategories = categories.map((category) => ({
            ...category,
            subcategories: [...new Set((category.subcategories || []).filter(Boolean))].sort(),
        }))

        res.status(200).json({
            success: true,
            categories: formattedCategories,
        })
    } catch (error) {
        console.log('Error fetching categories:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
        })
    }
}

export const createCategory = async (req, res) => {
    try {
        let { name, subcategory } = req.body

        name = normalizeValue(name)
        subcategory = normalizeValue(subcategory)

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required',
            })
        }

        let existingCategory = await Category.findOne({ name })

        if (existingCategory) {
            if (
                subcategory &&
                !existingCategory.subcategories.includes(subcategory)
            ) {
                existingCategory.subcategories.push(subcategory)
                await existingCategory.save()
            }

            return res.status(200).json({
                success: true,
                message: 'Category already existed and was updated if needed',
                category: existingCategory,
            })
        }

        const category = await Category.create({
            name,
            subcategories: subcategory ? [subcategory] : [],
        })

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        })
    } catch (error) {
        console.log('Error creating category:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
        })
    }
}