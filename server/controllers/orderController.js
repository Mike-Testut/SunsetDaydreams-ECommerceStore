import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import stripe from "../config/stripe.js"
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import PendingCheckoutModel from "../models/PendingCheckoutModel.js";
import {createNotification} from "../utils/createNotifications.js";

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

            const previousQuantity = inventoryItem.quantity;
            inventoryItem.quantity -= entry.requestedQuantity;
            const newQuantity = inventoryItem.quantity;
            await entry.product.save();

            const LOW_STOCK_THRESHOLD = 5

            if (newQuantity === 0 && previousQuantity > 0) {
                await createNotification({
                    type: "OUT_OF_STOCK",
                    title: "Product out of stock",
                    message: `${entry.product.name} in size ${entry.requestedSize} is now out of stock.`,
                    link: "/admin/allproducts",
                    metadata: {
                        productId: entry.product._id,
                        productName: entry.product.name,
                        size: entry.requestedSize,
                        quantity: inventoryItem.quantity,
                    },
                });
            } else if (
                previousQuantity > LOW_STOCK_THRESHOLD &&
                newQuantity <= LOW_STOCK_THRESHOLD &&
                newQuantity > 0) {
                await createNotification({
                    type: "LOW_STOCK",
                    title: "Low stock alert",
                    message: `${entry.product.name} in size ${entry.requestedSize} is low stock (${inventoryItem.quantity} left).`,
                    link: "/admin/allproducts",
                    metadata: {
                        productId: entry.product._id,
                        productName: entry.product.name,
                        size: entry.requestedSize,
                        quantity: inventoryItem.quantity,
                    },
                });
            }
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

        await createNotification({
            type: "NEW_ORDER",
            title: "New order received",
            message: `Order #${order.orderNumber} was placed for ${order.items.length} items for $${order.total.toFixed(2)}.`,
            link: `/admin/orders`,
            metadata: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
            },
        });

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

        const existingOrder = await OrderModel.findById(orderId);

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        const previousStatus = existingOrder.status;
        existingOrder.status = status;
        await existingOrder.save();

        if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
            await createNotification({
                type: 'ORDER_CANCELLED',
                title: 'Order cancelled',
                message: `Order #${existingOrder.orderNumber} was marked as cancelled.`,
                link: '/admin/orders',
                metadata: {
                    orderId: existingOrder._id,
                    orderNumber: existingOrder.orderNumber,
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated',
            order: existingOrder,
        });
    } catch (error) {
        console.log('updateOrderStatus error:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createStripeCheckoutSession = async (req, res) => {
    try {
        const {items, shippingAddress, subtotal, shippingFee, tax, total} = req.body;
        const orderNumber = generateOrderNumber();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items required',
            })
        }
        if (!shippingAddress?.email) {
            return res.status(400).json({
                success: false,
                message: 'email address required',
            })
        }

        const validatedItems = []
        const lineItems = []

        for (const item of items) {
            const product = await ProductModel.findById(item.productId)

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'An item in your cart could not be found',
                })
            }
            const requestedQuantity = Number(item.quantity)
            const requestedSize = item.size

            if (!requestedSize) {
                return res.status(400).json({
                    success: false,
                    message: `Please select size for ${product.name}`
                })
            }
            if (!requestedQuantity || requestedQuantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${product.name}`
                })
            }
            const inventoryItem = product.inventory.find(
                (entry) => entry.size === requestedSize
            )
            if (!inventoryItem) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is not available in size ${requestedSize}.`
                })
            }
            if (inventoryItem.quantity < requestedQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${inventoryItem.quantity} left for ${product.name} in size ${requestedSize}.`
                })
            }
            validatedItems.push({
                productId: product._id,
                name: product.name,
                image: product.images?.[0] || "",
                size: requestedSize,
                quantity: requestedQuantity,
                price: Number(product.price),
            })
            lineItems.push({
                quantity: requestedQuantity,
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(Number(product.price) * 100),
                    product_data: {
                        name: `${product.name} (${requestedSize})`,
                        images: product.images?.length ? [product.images[0]] : [],
                    }
                }
            })
        }

        if (Number(shippingFee) > 0) {
            lineItems.push({
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(Number(shippingFee) * 100),
                    product_data: {
                        name: "Shipping"
                    }
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}/orderplaced?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout`,
            customer_email: shippingAddress.email,
            metadata: {
                source: 'sunset-daydreams'
            }
        })

        await PendingCheckoutModel.create({
            stripeSessionId: session.id,
            orderNumber,
            user: req.user ? req.user.id : null,
            items: validatedItems,
            shippingAddress,
            paymentMethod: 'stripe',
            subtotal: Number(subtotal),
            shippingFee: Number(shippingFee) || 0,
            tax: Number(tax) || 0,
            total: Number(total),
            status: 'pending',
        })

        return res.status(200).json({
            success: true,
            url: session.url,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getStripeCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required',
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const pendingCheckout = await PendingCheckoutModel.findOne({ stripeSessionId: sessionId }).select('orderNumber status');

        return res.status(200).json({
            success: true,
            session,
            orderNumber: pendingCheckout?.orderNumber || null,
            checkoutStatus: pendingCheckout?.status || null,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || 'Could not retrieve Stripe session',
        });
    }
}

const handleStripeWebhook = async (req, res) => {
    let event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

    try {
        const signature = req.headers['stripe-signature'];

        if (!webhookSecret) {
            throw new Error('Stripe webhook secret is not configured');
        }

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret,
        );
    } catch (error) {
        console.log('Stripe webhook signature error:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            const pendingCheckout = await PendingCheckoutModel.findOne({
                stripeSessionId: session.id,
                status: 'pending'
            });

            if (!pendingCheckout) {
                return res.status(200).json({ received: true });
            }

            const normalizedItems = [];
            const LOW_STOCK_THRESHOLD = 5;

            for (const item of pendingCheckout.items) {
                const product = await ProductModel.findById(item.productId);

                if (!product) {
                    throw new Error('Product not found during Stripe fulfillment');
                }

                const inventoryItem = product.inventory.find(
                    (entry) => entry.size === item.size
                );

                if (!inventoryItem || inventoryItem.quantity < item.quantity) {
                    throw new Error(`Insufficient inventory for ${product.name} (${item.size})`);
                }

                const previousQuantity = inventoryItem.quantity;
                inventoryItem.quantity -= item.quantity;
                const newQuantity = inventoryItem.quantity;

                await product.save();

                if (newQuantity === 0 && previousQuantity > 0) {
                    await createNotification({
                        type: "OUT_OF_STOCK",
                        title: "Product out of stock",
                        message: `${product.name} in size ${item.size} is now out of stock.`,
                        link: "/admin/allproducts",
                        metadata: {
                            productId: product._id,
                            productName: product.name,
                            size: item.size,
                            quantity: newQuantity,
                        },
                    });
                } else if (
                    previousQuantity > LOW_STOCK_THRESHOLD &&
                    newQuantity <= LOW_STOCK_THRESHOLD &&
                    newQuantity > 0
                ) {
                    await createNotification({
                        type: "LOW_STOCK",
                        title: "Low stock alert",
                        message: `${product.name} in size ${item.size} is low stock (${newQuantity} left).`,
                        link: "/admin/allproducts",
                        metadata: {
                            productId: product._id,
                            productName: product.name,
                            size: item.size,
                            quantity: newQuantity,
                        },
                    });
                }

                normalizedItems.push({
                    productId: product._id.toString(),
                    name: product.name,
                    image: product.images?.[0] || '',
                    size: item.size,
                    quantity: item.quantity,
                    price: Number(item.price),
                });
            }

            const order = await OrderModel.create({
                orderNumber: pendingCheckout.orderNumber,
                user: pendingCheckout.user || null,
                items: normalizedItems,
                shippingAddress: pendingCheckout.shippingAddress,
                paymentMethod: 'stripe',
                subtotal: pendingCheckout.subtotal,
                shippingFee: pendingCheckout.shippingFee,
                tax: pendingCheckout.tax,
                total: pendingCheckout.total,
                status: 'Order Placed',
            });

            await createNotification({
                type: "NEW_ORDER",
                title: "New order received",
                message: `Order #${order.orderNumber} was placed for ${order.items.length} items for $${order.total.toFixed(2)}.`,
                link: "/admin/orders",
                metadata: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    total: order.total,
                },
            });

            pendingCheckout.status = 'completed';
            await pendingCheckout.save();
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.log('Stripe webhook handling error:', error);
        return res.status(500).json({ received: false, message: error.message });
    }
};


export { createOrder, getOrdersByUser, getOrderByOrderId, getAllOrders, updateOrderStatus,createStripeCheckoutSession, getStripeCheckoutSession, handleStripeWebhook  };
