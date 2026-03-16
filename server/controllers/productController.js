import {v2 as cloudinary} from 'cloudinary';
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subcategory, sizes, bestseller,date} = req.body;
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
            bestseller: bestseller === "true" ? true : false,
            date: Date.now(),
            images: uploadedImages };

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message: 'Successfully added product.'});
    }catch(error){
        console.log(error)
        res.json({success:false, error:error.message})
    }
}

const listProducts = async (req, res) => {

}

const removeProduct = async (req, res) => {

}

const viewSingleProduct = async (req, res) => {

}

const updateProduct = async (req, res) => {

}

export {addProduct,updateProduct, listProducts, viewSingleProduct, removeProduct}