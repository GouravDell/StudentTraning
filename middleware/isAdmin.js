
const AppError = require("../utils/customError");

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(
            new AppError(403,"Access denied. Admin only.")
        );
    }

    next();
};

module.exports = isAdmin;
