// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token)
//         return res
//             .status(401)
//             .json({ success: false, message: "Unauthorized" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // attach user info to request
//         next();
//     } catch (err) {
//         return res
//             .status(403)
//             .json({ success: false, message: "Invalid token" });
//     }
// };

// module.exports = verifyToken;

//----------------------------------------------------------------------------//
//Changes made from claude's version:--------------------------------------------//

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // FIXED: Check for token in multiple places
    let token = req.cookies.token; // Check cookies first (for backward compatibility)

    // If no token in cookies, check Authorization header
    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        return res
            .status(403)
            .json({ success: false, message: "Invalid token" });
    }
};

module.exports = verifyToken;
