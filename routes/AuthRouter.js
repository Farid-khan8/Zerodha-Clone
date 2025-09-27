// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const User = require("../models/UserModel");
// const { signup, login } = require("../controllers/AuthController");
// const { signupValidation } = require("../middleware/AuthValidation");
// const verifyToken = require("../middleware/authMiddleware");
// // const { loginValidation } = require("../middleware/AuthValidation");

// // Signup route with validation
// router.post("/signup", signupValidation, signup);

// // Login route with cookie
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     // console.log("Login attempt:", email, password);

//     try {
//         const user = await User.findOne({ email });
//         // console.log("Found user:", user);

//         if (!user)
//             return res
//                 .status(403)
//                 .json({ success: false, message: "Authentication failed" });

//         // Replace with bcrypt compare if you hash passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("Password match?", isMatch);

//         if (!isMatch)
//             return res
//                 .status(403)
//                 .json({ success: false, message: "Authentication failed" });

//         const jwtToken = jwt.sign(
//             { email: user.email, id: user._id },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "1d",
//             }
//         );

//         // Set HTTP-only cookie
//         res.cookie("token", jwtToken, {
//             httpOnly: true,
//             secure: false, // true if HTTPS
//             sameSite: "lax",
//             maxAge: 24 * 60 * 60 * 1000,
//         });

//         res.json({
//             success: true,
//             message: "Login successful",
//             name: user.name,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });
// // Check JWT cookie
// router.get("/check", verifyToken, (req, res) => {
//     const token = req.cookies.token;
//     if (!token) return res.json({ success: false });

//     try {
//         jwt.verify(token, process.env.JWT_SECRET);
//         return res.json({ success: true });
//     } catch (err) {
//         return res.json({ success: false });
//     }
// });

// module.exports = router;

//----------------------------------------------------------------------------//
//Changes made from claude's version:--------------------------------------------//

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const { signup, login } = require("../controllers/AuthController");
const {
    signupValidation,
    loginValidation,
} = require("../middleware/AuthValidation");
const verifyToken = require("../middleware/authMiddleware");

// Signup route with validation
router.post("/signup", signupValidation, signup);

// FIXED: Use the login function from AuthController (it returns JWT token properly)
router.post("/login", loginValidation, login);

// FIXED: Updated check route to work with both cookies and Authorization header
router.get("/check", verifyToken, (req, res) => {
    // If we reach here, verifyToken middleware has already validated the token
    // and attached user info to req.user
    return res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
        },
    });
});

// Optional: Add logout route
router.post("/logout", (req, res) => {
    // Clear the cookie (if any)
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
