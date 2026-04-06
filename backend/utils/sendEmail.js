import nodemailer from "nodemailer";
import mjml2html from "mjml";

// ✅ Create transporter ONCE (better performance)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ fix SSL issues
  },
});

// ✅ Optional: verify connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

const sendEmail = async (to, subject, mjmlContent) => {
  try {
    // 🔍 Validate ENV (VERY IMPORTANT)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not configured");
    }

    // ✅ Convert MJML → HTML
    const { html, errors } = mjml2html(mjmlContent);

    if (errors && errors.length > 0) {
      console.error("❌ MJML Errors:", errors);
      throw new Error("Email template error");
    }

    console.log("📧 Sending email to:", to);

    // ✅ Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);

    return true;
  } catch (error) {
    console.error("❌ EMAIL ERROR FULL:", error);

    // 🔥 important for controller
    throw error;
  }
};

export default sendEmail;
