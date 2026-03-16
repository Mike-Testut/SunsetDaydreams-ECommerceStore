import express from 'express';
import {addProduct, listProducts, removeProduct, viewSingleProduct, updateProduct} from '../controllers/productController.js';
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post("/add",upload.array("images",5), addProduct);
productRouter.get("/all", listProducts);
productRouter.post("/remove/:id", removeProduct);
productRouter.post("/:id", viewSingleProduct);
productRouter.put("/update/:id", updateProduct);

export default productRouter;