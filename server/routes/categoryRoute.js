import express from 'express'
import { createCategory, getCategories } from '../controllers/categoryController.js'
import authUser from '../middleware/authMiddleware.js'
import adminAuth from '../middleware/adminMiddleware.js'

const categoryRouter = express.Router()

categoryRouter.get('/', getCategories)
categoryRouter.post('/', authUser, adminAuth, createCategory)

export default categoryRouter