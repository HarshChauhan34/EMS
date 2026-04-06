import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔐 hide password
    },

    // ================= FORGOT PASSWORD =================
    passwordResetToken: {
      type: String,
      select: false, // 🔐 hide from queries
    },

    passwordResetExpires: {
      type: Date,
      select: false, // 🔐 hide from queries
    },

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

// ================= HASH PASSWORD =================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // ✅ important
  }
});

// ================= MATCH PASSWORD =================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ================= CREATE RESET TOKEN =================
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // ⏳ 10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
