import {v2 as cloudinary} from 'cloudinary';
import ProductModel from "../models/ProductModel.js";

const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subcategory, sizes, bestseller} = req.body;
        const uploadedImages = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products"
            });
            uploadedImages.push(
                result.secure_url
            );
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
        res.json({success: true, products});
    } catch(error){
        res.json({success:false, error:error.message})
    }
}

const removeProduct = async (req, res) => {
    try{
        await ProductModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: 'Successfully removed product.'});
    }catch(error){
        res.json({success:false, error:error.message})
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