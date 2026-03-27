import UserModel from "../models/userModel.js";
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
        if(!email || !password){
            return res.status(400).json({error: "Email and Password are required"});
        }
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(401).json({success: false, error: "User does not exist"});
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
            res.status(401).json({success: false, error: "Password is incorrect"});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: error.message});
    }
}

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const {name, email, password, confirmPassword} = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        //check to see if user already exists
        const exist = await UserModel.findOne({email});
        if (exist) {
            return res.status(400).json({success: false, error: "Email already exists"});
        }
        //validate email and password length
        if(!validator.isEmail(email)) {
            return res.status(400).json({success: false, error: "Please enter a valid email"});
        }
        if(password.length < 8){
            return res.status(400).json({success: false, error: "Password must be at least 8 characters"});
        }
        //confirm password
        if(password !== confirmPassword){
            return res.status(400).json({success: false, error: "Passwords do not match"});
        }

        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
            //set admin role if first registered user
        const userCount = await UserModel.countDocuments();
        const role = userCount === 0 ? "admin" : "user";

        const newUser = new UserModel({
            name,
            email,
            password:hashedPassword,
            role});
        const user = await newUser.save()
        const token = createToken(user);
        res.status(201).json({success: true, token})
    } catch (error) {
        console.log("something went wrong", error)
        return res.status(500).json({success: false, error: error.message});
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.error('Get current user error:', error)
        res.status(500).json({ message: 'Server error fetching user' })
    }
}


export {loginUser, registerUser};