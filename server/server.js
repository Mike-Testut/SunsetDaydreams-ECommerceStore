import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import {handleStripeWebhook} from "./controllers/orderController.js";
import notificationRouter from "./routes/notificationRoute.js";


//App Config

const app = express()
const port = process.env.PORT || 3000

connectDB();
connectCloudinary();


//Stripe Webhook
app.post(
    '/api/order/stripe/webhook',
    express.raw({type: 'application/json'}),
    handleStripeWebhook
)

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//API endpoints
app.use('/api/user/', userRouter);
app.use('/api/products/', productRouter)
app.use('/api/order/', orderRouter)
app.use('/api/categories/', categoryRouter)
app.use('/api/notification/', notificationRouter)
app.get('/', (req, res) => {
    res.send('API is running')
})

app.listen(port, () => {console.log(`Server started on port ${port}`)})
