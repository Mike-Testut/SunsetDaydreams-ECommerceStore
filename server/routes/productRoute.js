import express from 'express';
import {addProduct, listProducts, removeProduct, viewSingleProduct, updateProduct} from '../controllers/productController.js';
import upload from "../middleware/multer.js";
import protect from '../middleware/authMiddleware.js';
import adminOnly from "../middleware/adminMiddleware.js";

const productRouter = express.Router();

productRouter.post("/add", protect, adminOnly, upload.array("images",5), addProduct);
productRouter.get("/all", listProducts);
productRouter.get("/:productId", viewSingleProduct);
productRouter.delete("/:productId",protect, adminOnly, removeProduct);
productRouter.put("/update/:productId", protect, adminOnly, updateProduct);

export default productRouter;