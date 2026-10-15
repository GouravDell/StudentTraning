const { signupSchema, loginSchema } = require('../middleware/joiSchema');
const AppError = require('../utils/customError');
module.exports = {
    validateLogin: (req, res, next) => {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            console.log(error)
            next(new AppError(false, 'Missing fields', 400, error.message))
        }
        next();
    },
    validateSignup: (req, res, next) => {
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            next(new AppError(false, 'Missing fields', 400, error.message))
        }
        next();
    }
}