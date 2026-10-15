require('dotenv').config();
const express=require("express");
const app=express();
const helmet=require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss=require('xss-clean');
const {sendError}=require('./utils/responseHandler');
const AppError=require("./utils/customError");
const {connectDB}=require('./config/dbCon');
var cors = require('cors')

//database connection
connectDB();

//global middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
//routes
app.use('/user',require('./routes/user.routes'));
app.use('/product',require('./routes/product'));
app.use("/course",require("./routes/course"));
//routes not matched
app.all("*",(req,res,next)=>{
next(new AppError(false,`request url ${req.path} not found`,404))
})

//Global middleware for error handling
app.use(sendError);

app.listen(process.env.PORT,()=>{
console.log(`server started ${process.env.PORT}`);
});