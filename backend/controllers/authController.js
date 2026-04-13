import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.toLowerCase().trim();
    role = role || "user";

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    let userData = {
      name,
      email,
      password,
      role: "user",
    };

    // ✅ If organizer registers, keep request pending until admin approves
    if (role === "organizer") {
      userData.role = "organizer";
      userData.organizerRequestStatus = "pending";
      userData.isApprovedOrganizer = false;
    }

    const user = await User.create(userData);

    // ✅ Normal user can login immediately
    if (user.role === "user") {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }

    // ✅ Organizer registration response
    return res.status(201).json({
      message:
        "Organizer registration request submitted successfully. Please wait for admin approval.",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizerRequestStatus: user.organizerRequestStatus,
      isApprovedOrganizer: user.isApprovedOrganizer,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

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

    // ✅ Organizer login only after admin approval
    if (user.role === "organizer") {
      if (user.organizerRequestStatus === "pending") {
        return res.status(403).json({
          message: "Your organizer account is pending admin approval",
        });
      }

      if (user.organizerRequestStatus === "rejected") {
        return res.status(403).json({
          message: "Your organizer request was rejected by admin",
        });
      }

      if (!user.isApprovedOrganizer) {
        return res.status(403).json({
          message: "Organizer account is not approved yet",
        });
      }
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizerRequestStatus: user.organizerRequestStatus,
      isApprovedOrganizer: user.isApprovedOrganizer,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
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
    user.email = req.body.email
      ? req.body.email.toLowerCase().trim()
      : user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      organizerRequestStatus: updatedUser.organizerRequestStatus,
      isApprovedOrganizer: updatedUser.isApprovedOrganizer,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
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

    let frontendBaseUrl =
      String(process.env.FRONTEND_URL || req.get("origin") || "").trim() ||
      "http://localhost:5173";
    frontendBaseUrl = frontendBaseUrl.replace(/\/+$/, "");

    if (/^https:\/\/localhost(?::\d+)?$/i.test(frontendBaseUrl)) {
      frontendBaseUrl = frontendBaseUrl.replace(/^https:/i, "http:");
    }

    const resetURL = `${frontendBaseUrl}/reset-password/${resetToken}`;

    const mjmlTemplate = `
      <mjml>
        <mj-body background-color="#f4f4f4">
          <mj-section>
            <mj-column>
              <mj-text font-size="20px" font-weight="bold">
                🔐 Password Reset
              </mj-text>

              <mj-text>
                Click below to reset your password
              </mj-text>

              <mj-button href="${resetURL}" background-color="#6C63FF">
                Reset Password
              </mj-button>

              <mj-text font-size="12px" color="#888">
                This link expires in 10 minutes
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    const shouldExposeResetLink = true; // Always expose for testing

    try {
      await sendEmail(user.email, "Password Reset", mjmlTemplate);
    } catch (emailError) {
      console.error("FORGOT PASSWORD EMAIL SEND ERROR:", emailError.message);

      if (shouldExposeResetLink) {
        return res.status(200).json({
          message:
            "Email could not be sent, but reset link is available in development.",
          resetURL,
        });
      }

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message:
          "Could not send reset email right now. Please verify email settings and try again.",
      });
    }

    return res
      .status(200)
      .json(shouldExposeResetLink ? { message, resetURL } : { message });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Email sending failed",
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
    return res.status(500).json({ message: "Server Error" });
  }
};