import mongoose from "mongoose";

const pendingCheckoutSchema = new mongoose.Schema({
    stripeSessionId:{type:String,required:true, unique:true},
    orderNumber: {type:String, required:true, unique:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"user", default: null},
    items: [
        {
            productId:mongoose.Schema.Types.ObjectId,
            name:{type:String,required:true},
            image:{type:String,default:""},
            size:{type:String,required:true},
            quantity:{type:Number,required:true},
            price:{type:Number,required:true},
        }
    ],
    shippingAddress:{
        firstName:{type:String},
        lastName:{type:String},
        email:{type:String},
        phone:{type:String},
        address:{type:String},
        city:{type:String},
        state:{type:String},
        zipCode:{type:String},
        country:{type:String},
    },
    paymentMethod:{ },
    subtotal:{type:Number,required:true},
    shippingFee:{type:Number,required:true},
    tax:{type:Number,required:true},
    total:{type:Number,required:true},
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
},
{ timestamps: true }
)

const PendingCheckout = mongoose.models.pendingCheckout ||
    mongoose.model('pendingCheckout', pendingCheckoutSchema);

export default PendingCheckout;
