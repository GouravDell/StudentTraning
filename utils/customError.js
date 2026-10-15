class AppError extends Error{
    constructor(status,message,statusCode,errorObj){
    super(message);
    this.status=status;
    this.statusCode=statusCode;
    this.isOperational=true;
    this.errorObj=errorObj?errorObj:undefined;
    Error.captureStackTrace(this,this.constructor);
    }

}
module.exports=AppError;