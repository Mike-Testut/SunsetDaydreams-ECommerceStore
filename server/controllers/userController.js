import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (user)=>{
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success: false, error: "User does not exist"});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            const token = createToken(user);
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            res.json({success: false, error: "Password is incorrect"});
        }
    } catch (error) {
        console.log(error)
        return res.json({success: false, error: error.message});
    }
}

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const {name, email, password} = req.body;

        //check to see if user already exists
        const exist = await userModel.findOne({email});
        if (exist) {
            return res.json({success: false, error: "Email already exists"});
        }
        //validate email and password length
        if(!validator.isEmail(email)) {
            return res.json({success: false, error: "Please enter a valid email"});
        }
        if(password.length < 8){
            return res.json({success: false, error: "Password must be at least 8 characters"});
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
            //set admin role if first registered user
        const userCount = await userModel.countDocuments();
        const role = userCount === 0 ? "admin" : "user";

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
            role});
        const user = await newUser.save()
        const token = createToken(user);
        res.json({success: true, token})
    } catch (error) {
        console.log("something went wrong", error)
        return res.json({success: false, error: error.message});
    }
}


export {loginUser, registerUser};