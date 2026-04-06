import nodemailer from "nodemailer";
import mjml2html from "mjml";

const sendEmail = async (to, subject, mjmlContent) => {
  try {
    // ✅ Convert MJML → HTML safely
    const { html, errors } = mjml2html(mjmlContent);

    if (errors && errors.length > 0) {
      console.error("MJML Errors:", errors);
      throw new Error("Email template error");
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);

    // 🔥 VERY IMPORTANT
    throw error; // ← this sends error back to controller safely
  }
};

export default sendEmail;
