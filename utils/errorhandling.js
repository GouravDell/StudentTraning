module.exports={
    sendError:(error,req,res,next)=>{
    error.statusCode=error.statusCode || 500;
    error.message=error.message || 'error'
     return res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        statuscode:error.statusCode
     })
    }
}