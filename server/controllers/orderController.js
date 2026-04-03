import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, subtotal, shippingFee, tax, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order items are required',
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required',
            });
        }

        const normalizedItems = [];
        const productsToUpdate = [];

        for (const item of items) {
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `A product in your cart could not be found.`,
                });
            }

            const requestedQuantity = Number(item.quantity);
            const requestedSize = item.size;

            if (!requestedSize) {
                return res.status(400).json({
                    success: false,
                    message: `Please select a size for ${product.name}.`,
                });
            }

            if (!requestedQuantity || requestedQuantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${product.name}.`,
                });
            }

            const inventoryItem = product.inventory.find(
                (entry) => entry.size === requestedSize
            );

            if (!inventoryItem) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is not available in size ${requestedSize}.`,
                });
            }

            if (inventoryItem.quantity < requestedQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${inventoryItem.quantity} left for ${product.name} in size ${requestedSize}.`,
                });
            }

            normalizedItems.push({
                productId: product._id.toString(),
                name: product.name,
                image: product.images?.[0] || "",
                size: requestedSize,
                quantity: requestedQuantity,
                price: Number(product.price),
            });

            productsToUpdate.push({
                product,
                requestedSize,
                requestedQuantity,
            });
        }

        for (const entry of productsToUpdate) {
            const inventoryItem = entry.product.inventory.find(
                (item) => item.size === entry.requestedSize
            );

            inventoryItem.quantity -= entry.requestedQuantity;
            await entry.product.save();
        }

        const normalizedSubtotal = Number(subtotal);
        const normalizedShippingFee = Number(shippingFee) || 0;
        const normalizedTax = Number(tax) || 0;
        const normalizedTotal = Number(total);

        const orderData = {
            orderNumber: generateOrderNumber(),
            user: req.user ? req.user.id : null,
            items: normalizedItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'cc',
            subtotal: normalizedSubtotal,
            shippingFee: normalizedShippingFee,
            tax: normalizedTax,
            total: normalizedTotal,
        };

        const order = await OrderModel.create(orderData);

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        console.log('Error placing order: ', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log('error retrieving orders: ', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrderByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.log('Error retrieving order: ', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log('getAllOrders error:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status',
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated',
            order,
        });
    } catch (error) {
        console.log('updateOrderStatus error:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { createOrder, getOrdersByUser, getOrderByOrderId, getAllOrders, updateOrderStatus };