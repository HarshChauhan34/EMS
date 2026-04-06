import nodemailer from "nodemailer";
import mjml2html from "mjml";

const sendEmail = async (to, subject, mjmlContent) => {
  const { html } = mjml2html(mjmlContent);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export default sendEmail;