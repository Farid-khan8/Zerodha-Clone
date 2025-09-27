const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User already exists, you can login directly",
                success: false,
            });
        }

        // Create new user — password will be hashed automatically via pre-save hook
        const newUser = new UserModel({ name, email, password });
        await newUser.save();

        res.status(201).json({
            message: "Signup Successfully ",
            success: true,
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await UserModel.findOne({ email });
        const errorMsg =
            "Authentication failed, please check your email and password";

        if (!user) {
            return res.status(403).json({
                message: errorMsg,
                success: false,
            });
        }
        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: errorMsg,
                success: false,
            });
        }
        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login Successfully ",
            success: true,
            jwtToken,
            email,
            name: user.name,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

module.exports = { signup, login };
