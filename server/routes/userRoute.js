import express from "express";
import {loginUser, registerUser, adminLogin} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/userLogin", loginUser);
userRouter.post("/adminLogin", adminLogin);

export default userRouter;