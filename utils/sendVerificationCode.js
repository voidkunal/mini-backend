// utils/sendVerificationCode.js

import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import sendEmail from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {
    console.log("🧪 Step 1: Inputs received ->", { verificationCode, email });

    const message = generateVerificationOtpEmailTemplate(verificationCode);
    console.log("🧪 Step 2: Generated email content");

    await sendEmail({
      subject: "Your Verification Code",
      email,
      message,
    });

    console.log("✅ Step 3: Email sent successfully");

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("❌ Step 4: Error sending verification code:", error);

    res.status(500).json({
      success: false,
      message: "Verification code not sent",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
