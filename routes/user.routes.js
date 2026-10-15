const express = require('express');
const router= express.Router();
const rolebased=require("../utils/rolebasedRestriction");
const verifyToken=require("../utils/verifyToekn");
const {validateLogin,validateSignup}=require('../middleware/validation');

const {login,signup,getAllUser, forgot_password, reset_password,updatePassword}= require('../controllers/userController')

router.post('/login',login);
router.post('/signup',signup);
router.get('/getalluser',verifyToken,getAllUser);
router.post('/forgot_password',forgot_password);
router.patch('/Reset_password/:token',reset_password);
router.patch('/updatePassword',updatePassword);

module.exports= router;