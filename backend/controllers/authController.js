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

    // Password hashing handled in model
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // include password
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

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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

    // password auto-hashed in model
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim();

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

    // generate token using model method
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // reset URL (frontend route)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // MJML email template
    const mjmlTemplate = `
      <mjml>
        <mj-body background-color="#f4f4f4">
          <mj-section>
            <mj-column>
              <mj-text font-size="22px" font-weight="bold">
                🔐 Password Reset Request
              </mj-text>

              <mj-text font-size="16px">
                We received a request to reset your password.
              </mj-text>

              <mj-button href="${resetURL}" background-color="#6C63FF">
                Reset Password
              </mj-button>

              <mj-text font-size="14px" color="#888">
                This link will expire in 10 minutes.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    // send email
    await sendEmail(user.email, "Password Reset", mjmlTemplate);

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({
      message: error.message,
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

    // hash token
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

    // update password
    user.password = newPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
