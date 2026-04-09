import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      validate: {
        validator: function (value) {
          // Strong password regex
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(
            value,
          );
        },
        message:
          "Password must contain uppercase, lowercase, number and special character",
      },
      select: false, // Exclude password from queries by default
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
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

// ================= HASH PASSWORD (FIXED) =================
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ================= MATCH PASSWORD =================
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("Password not selected");
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

// ================= CREATE RESET TOKEN =================
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// ================= AUTO DELETE EXPIRED TOKENS =================
userSchema.index({ passwordResetExpires: 1 }, { expireAfterSeconds: 0 });

// ================= EXPORT =================
const User = mongoose.model("User", userSchema);

export default User;
