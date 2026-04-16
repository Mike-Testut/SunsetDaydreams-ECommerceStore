import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        subcategories: [
            {
                type: String,
                trim: true,
                lowercase: true,
            }
        ],
    },
    { timestamps: true }
)

categorySchema.index({ name: 1 }, { unique: true })

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category