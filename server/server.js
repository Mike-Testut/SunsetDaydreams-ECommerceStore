import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
//App Config

const app = express()
const port = process.env.PORT || 3000
connectDB();
connectCloudinary();

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//API endpoints
app.use('/api/user', userRouter);
app.get('/', (req, res) => {
    res.send('API is running')
})

app.listen(port, () => {console.log(`Server started on port ${port}`)})