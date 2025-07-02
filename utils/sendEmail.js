// utils/sendEmail.js

import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  if (!email) throw new Error("Recipient email is required");

  // Setup the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define mail options
  const mailOptions = {
    from: `"Void Tech Team" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: subject || "No Subject",
    html: message || "<p>No content</p>", // fallback to simple HTML
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
