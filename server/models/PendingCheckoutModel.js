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
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        email:{type:String,required:true},
        phone:{type:String,required:true},
        address:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        zipCode:{type:String,required:true},
        country:{type:String,required:true},
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
