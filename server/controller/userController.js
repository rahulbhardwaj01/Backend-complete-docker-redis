import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    try {
        const {fullName,email,password} = req.body;
        if(!fullName, !email, !password) {
            return res.status(400).json({success: false, message: 'All fields are required'});
        }

        // Check if email already exists
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({success: false, message: 'Email already exists'});
        };

        // Create new user
        const newUser = new User({fullName,email,password});
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        res.status(201).json({
            success: true,
            data: {
                id: newUser._id,         // how new userID was created
                fullName: newUser.fullName,
                email: newUser.email
            },
            message: 'User registered successfully'});

     } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
};

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({success: false, message: 'All fields are required'});
        };
        
        // Check if user exists
        const user =  await User.findOne({email});
        if(!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        };
        
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success: false, message: 'Incorrect password'});
        };

        // Create JWT token
        const token = jwt.sign({UserId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).cookie("token",token, {httpOnly:true,sameSite:"strict",maxAge:24*60*60*1000}).json({success: true, message: 'User logged in successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
};


export const logout = async (_,res) => {
    try {
        res.clearCookie("token").json({success: true, message: 'User logged out successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
};