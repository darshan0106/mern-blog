const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: Object,
      default: null,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    authMethod: {
      type: String,
      enum: ["google", "local", "facebook", "github"],
      required: true,
      default: "local",
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    accountVerificationToken: {
      type: String,
      default: null,
    },
    accountVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    totalEarning: {
      type: Number,
      default: 0,
    },
    nextEarningDate: {
      type: Date,
      default: () =>
        new Date(new Date().getFullYear(), new Date().getMonth(), +1, 1),
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    hasSelectedPlan: {
      type: Boolean,
      default: false,
    },
    lastlogin: {
      type: Date,
      default: Date.now(),
    },
    accountType: {
      type: String,
      default: "Basic",
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//! Generate token for account verification
userSchema.methods.generateAccVerificationToken = function () {
  const emailToken = crypto.randomBytes(20).toString("hex");
  //assign the token to the user
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  return emailToken;
};

//! Generate token for password reset
userSchema.methods.generatePasswordResetToken = function () {
  const emailToken = crypto.randomBytes(20).toString("hex");
  //assign the token to the user
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  return emailToken;
};

//! Method to update user accountType
userSchema.method.updateAccountType = function () {
  const postCount = this.posts.length;
  if (postCount >= 50) {
    this.accountType = "Premium";
  } else if (postCount >= 10) {
    this.accountType = "Standard";
  } else {
    this.accountType = "Basic";
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
