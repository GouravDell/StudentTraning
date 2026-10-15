
const jwt = require("jsonwebtoken");
const AppError = require("../utils/customError");
const User = require("../models/userSchema");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new AppError(false, "Authorization token is required", 401)
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // Fetch current user and role from database
        const user = await User.findById(decoded.id)
            .select("_id name email role");

        if (!user) {
            return next(
                new AppError(false, "User not found", 401)
            );
        }

        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };

        req.user_id = user._id.toString();

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        return next(
            new AppError(false, "Unauthorized or expired token", 401)
        );
    }
};

module.exports = verifyToken;
