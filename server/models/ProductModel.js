import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    images: {type: Array, required: true},
    category: {type: String, required: true},
    subcategory: {type: String, required: true},
    inventory: [
        {
            size: { type: String, required: true },
            quantity: { type: Number, required: true, default: 0 },
        }
    ],
    bestseller: {type: Boolean},
    date: {type: Date, default: Date.now},
},{timestamps: true});

const ProductModel = mongoose.models.product || mongoose.model("product", productSchema);

export default ProductModel;