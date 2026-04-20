import express from 'express';
import {
    createOrder, createStripeCheckoutSession,
    getAllOrders,
    getOrderByOrderId,
    getOrdersByUser, getStripeCheckoutSession,
    updateOrderStatus
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";

const orderRouter = express.Router();

orderRouter.post('/create',optionalAuth, createOrder);
orderRouter.post('/stripe/create-checkout-session', optionalAuth, createStripeCheckoutSession);
orderRouter.get('/stripe/session/:sessionId', getStripeCheckoutSession);
orderRouter.get('/ordersbyuser', protect, getOrdersByUser);
orderRouter.get('/:orderId', getOrderByOrderId);
orderRouter.get('/admin/orders', protect, adminOnly, getAllOrders);
orderRouter.patch('/admin/:orderId/status', protect, adminOnly, updateOrderStatus);

export default orderRouter;
