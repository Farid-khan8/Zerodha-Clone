const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });

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
