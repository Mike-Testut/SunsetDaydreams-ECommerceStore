import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderByOrderId,
    getOrdersByUser,
    updateOrderStatus
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";

const orderRouter = express.Router();

orderRouter.post('/create',optionalAuth, createOrder);
orderRouter.get('/ordersbyuser', protect, getOrdersByUser);
orderRouter.get('/orderbyid', getOrderByOrderId);
orderRouter.get('/admin/all-orders', protect, adminOnly, getAllOrders);
orderRouter.patch('/admin/:orderId/update-status', protect, adminOnly, updateOrderStatus);

export default orderRouter;

