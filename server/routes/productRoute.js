import express from 'express';
import {addProduct, listProducts, removeProduct, viewSingleProduct, updateProduct} from '../controllers/productController.js';
import upload from "../middleware/multer.js";
import protect from '../middleware/authMiddleware.js';
import adminOnly from "../middleware/adminMiddleware.js";

const productRouter = express.Router();

productRouter.post("/add",upload.array("images",5), protect, adminOnly, addProduct);
productRouter.get("/all", listProducts);
productRouter.post("/remove/:id",protect, adminOnly, removeProduct);
productRouter.post("/:id", viewSingleProduct);
productRouter.put("/update/:id", protect, adminOnly, updateProduct);

export default productRouter;