import nodemailer from "nodemailer";
import mjml2html from "mjml";

let transporter = null;

const normalizedEmailUser = () => String(process.env.EMAIL_USER || "").trim();
const normalizedEmailPass = () => String(process.env.EMAIL_PASS || "").trim();

const hasEmailCredentials = () =>
  Boolean(normalizedEmailUser() && normalizedEmailPass());

const getTransporter = () => {
  if (!hasEmailCredentials()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: normalizedEmailUser(),
        pass: normalizedEmailPass(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return transporter;
};

const sendEmail = async (to, subject, mjmlContent) => {
  try {
    const mailTransporter = getTransporter();
    if (!mailTransporter) {
      throw new Error("Email service is not configured");
    }

    const { html, errors } = mjml2html(mjmlContent);

    if (errors && errors.length > 0) {
      console.error("❌ MJML Errors:", errors);
      throw new Error("Email template error");
    }

    console.log("📧 Sending email to:", to);

    const info = await mailTransporter.sendMail({
      from: process.env.EMAIL_FROM || normalizedEmailUser(),
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
