import express from "express";
import {getCurrentUser, loginUser, registerUser} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getCurrentUser)

export default userRouter;
