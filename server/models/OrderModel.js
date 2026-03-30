import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
)

const shippingAddressSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: null,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: [(arr) => arr.length > 0, 'Order must contain at least one item'],
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'cc',
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingFee: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            required: true,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            default: 'Order Placed',
            enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
)

const OrderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default OrderModel