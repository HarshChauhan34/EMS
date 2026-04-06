import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "User is blocked",
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const message = "If that email exists, we will send you a reset link.";

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mjmlTemplate = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Password Reset</mj-text>
              <mj-button href="${resetURL}">
                Reset Password
              </mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    await sendEmail(user.email, "Password Reset", mjmlTemplate);

    return res.status(200).json({ message });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      message: error.message || "Email sending failed",
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and newPassword are required",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
