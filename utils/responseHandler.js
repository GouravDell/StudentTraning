const AppError = require('./customError');
const logger=require('../config/logger');
module.exports = {
    sendSuccess: (res, responseObj) => {
        logger.info({...responseObj})
        return res.status(responseObj.statusCode || 500).json({...responseObj})
    },

    sendError: (err, req, res, next) => {
        let error = { ...err }
        error.message=err.message;
        if (err.name === 'validationError') {
            error = validationErrorDB(err)
        }
        else if (err.name === "CastError") {
            error = CastErrorDB(err)
        }
        logger.error({...error,path:req.path})
        return res.status(error.statusCode || 500).json({ status: error.status, message: error.message, statusCode: error.statusCode, errors:error.errorObj })
    }
}

const validationErrorDB = err => {
    let errors = [];
    Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
    });
    return new AppError(false, 'Missing fields', 400, errors)
}

const CastErrorDB = err => {
    return new AppError(false, `Invalid field '${err.path}' of value ${err.value}`, 400)
}

