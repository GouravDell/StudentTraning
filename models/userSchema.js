const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// ===============================
// HASH PASSWORD
// ===============================

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});


// ===============================
// COMPARE PASSWORD
// ===============================

userSchema.methods.comparePassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};


// ===============================
// CREATE PASSWORD RESET TOKEN
// ===============================

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


// ===============================
// CHECK PASSWORD CHANGED AFTER JWT
// ===============================

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp;
  }

  return false;
};


module.exports = mongoose.model("User", userSchema);