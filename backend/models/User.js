import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // clean spaces
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // always store lowercase
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password in queries 🔐
    },

    // Forgot Password fields
    passwordResetToken: String,
    passwordResetExpires: Date,

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔑 Compare password (login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔁 Generate Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
