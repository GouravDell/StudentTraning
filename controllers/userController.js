const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const hashedPassword = require("../utils/encryptingPassword");
const asyncHandler = require('./../utils/asyncErrorHandler');
const { responseObj } = require("../config/responseObj")
const AppError = require("../utils/customError")
const { sendSuccess } = require("../utils/responseHandler");
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenGenerator");
const sendEmail = require("../utils/email");

module.exports = {

  //Signup API with token

  signup: async (req, res, next) => {
    try {
      const signup_user = await User.create({
        ...req.body,
        password: req.body.password,
      });

      return sendSuccess(res, {
        ...responseObj.signup,
        data: signup_user,
      });
    } catch (error) {
      next(error);
    }
  },

  //login API with TOKEN 

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
      ) {
        return next(
          new AppError(
            false,
            "Email and password are required",
            400
          )
        );
      }

      const user = await User.findOne({
        email: email.trim().toLowerCase(),
      }).select("+password");

      if (!user) {
        return next(
          new AppError(
            false,
            "Invalid email or password",
            401
          )
        );
      }

      // Compare plain password with stored bcrypt hash
      const isPasswordValid = await user.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return next(
          new AppError(
            false,
            "Invalid email or password",
            401
          )
        );
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return sendSuccess(res, {
        ...responseObj.login,
        data: {
          user: safeUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },


  //getAllUser API
  getAllUser: async (req, res, next) => {
    try {
      const all_user = await User.find({}, { __v: 0 });
      if (all_user) {
        return sendSuccess(res, { ...responseObj.get, data: all_user });
      }
      throw new AppError(false, responseObj.User_not_found, 400)
    }
    catch (err) {
      next(err)
    }
  },

  //forgot password

  forgot_password: async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new AppError(false, "We could not find the user with given email", 404);
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}user/${resetToken}`;
    const message = `we have recieved a password reset request.please use the below link and reset your password\n\n${resetUrl}`
    try {
      await sendEmail({
        email: user.email,
        subject: 'password changed request received',
        message: message
      })
      return res.status(200).json({
        status: 'success',
        message: "password reset link send to the user email"
      })
    }
    catch (err) {
      console.log(err)
      user.passwordResetToken = undefined;
      user.passwordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      next(err)
    }
  },

  //reset password
  reset_password: async (req, res, next) => {
    try {
      const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

      // Find the user based on the token and expiration date
      const user = await User.findOne({
        passwordResetToken: token,
        passwordExpires: { $gt: Date.now() }
      });

      // Check if passwords match
      if (req.body.password !== req.body.confirmPassword) {
        const error = new AppError('Passwords do not match', 400);
        return next(error);
      }

      // Check if the user exists
      if (!user) {
        const error = new AppError('Token is invalid or has expired', 400);
        return next(error);
      }

      // Reset the password
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordExpires = undefined;
      user.passwordChangedAt = Date.now();
      await user.save();

      // Generate a new token for the user
      const newToken = generateAccessToken(user._id);

      // Send the new token in the response
      return res.status(200).json({
        status: 'success',
        token: newToken
      });
    } catch (err) {
      next(err);
    }
  },


  //updatepasword for user
  updatePassword: async (req, res, next) => {
    const user = await User.findById(req.user_id).select('+password');
    if (!(user.comparePasswordInDb(req.body.password, user.password))) {
      return next(new AppError(false, 'the cureent password is wrong', 401))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    const token = generateAccessToken(user._id);
    return res.status(200).json({
      status: 'success',
      token: token,
      data: {
        user
      }
    })
  }
}
