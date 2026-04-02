import {v2 as cloudinary} from 'cloudinary';
import ProductModel from "../models/ProductModel.js";

const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subcategory, sizes, bestseller} = req.body;
        const uploadedImages = [];

        const files = req.files || []

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products"
            })
            uploadedImages.push(result.secure_url)
        }

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subcategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true",
            date: Date.now(),
            images: uploadedImages };

        console.log(productData);

        const product = new ProductModel(productData);
        await product.save()

        res.json({success: true, message: 'Successfully added product.'});
    }catch(error){
        console.log(error)
        res.json({success:false, error:error.message})
    }
}

const listProducts = async (req, res) => {
    try{
        const products = await ProductModel.find({})
        res.status(200).json({success: true, products});
    } catch(error){
        res.status(500).json({success:false, error:error.message})
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params

        const deletedProduct = await ProductModel.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log('deleteProduct error:', error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const viewSingleProduct = async (req, res) => {
    try{
        const {productId} = req.body;
        const product = await ProductModel.findById(productId)
        res.json({success: true, product});
    }catch(error){
        res.json({success:false, error:error.message})
    }
}

const updateProduct = async (req, res) => {
    try{
        const {productId} = req.body;
        const product = await ProductModel.findByIdAndUpdate(productId, req.body, {new: true})
        res.json({success: true, product});
    } catch(error){
        res.json({success:false, error:error.message})
    }
}

export {addProduct,updateProduct, listProducts, viewSingleProduct, removeProduct}