import OrderModel from "../models/OrderModel.js";
import {generateOrderNumber} from "../utils/generateOrderNumber.js";

const createOrder = async (req, res) => {
    try{
        const { items, shippingAddress, paymentMethod, subtotal, shippingFee, tax, total } = req.body

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order items are required',
            })
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required',
            })
        }

        const normalizedItems = items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: Number(item.quantity),
            price: Number(item.price),
        }))


        const normalizedSubtotal = Number(subtotal)
        const normalizedShippingFee = Number(shippingFee) || 0
        const normalizedTax = Number(tax) || 0
        const normalizedTotal = Number(total)

        const orderData={
            orderNumber: generateOrderNumber(),
            user: req.user ? req.user.id : null,
            items: normalizedItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'cc',
            subtotal: normalizedSubtotal,
            shippingFee: normalizedShippingFee,
            tax: normalizedTax,
            total: normalizedTotal,
        }
        const order = await OrderModel.create(orderData)

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        })

    }catch(error){
        console.log('Error placing order: ',error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getOrdersByUser = async (req, res) => {
    try{
        const userId = req.user.id
        const orders = await OrderModel.find({user: userId}).sort({createdAt:-1})
        return res.status(200).json({
            success: true,
            orders,
        })
    } catch(error){
        console.log('error retrieving orders: ', error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getOrderByOrderId = async (req, res) => {
    try{
        const orderId = req.body
        const order = await OrderModel.findById(orderId)
        return res.status(200).json({
            success: true,
            order
        })
    }catch(error){
        console.log('Error retrieving order: ',error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders,
        })
    } catch (error) {
        console.log('getAllOrders error:', error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const allowedStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status',
            })
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated',
            order,
        })
    } catch (error) {
        console.log('updateOrderStatus error:', error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export {createOrder, getOrdersByUser, getOrderByOrderId, getAllOrders, updateOrderStatus}