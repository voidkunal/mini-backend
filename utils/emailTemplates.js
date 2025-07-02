export const generateVerificationOtpEmailTemplate = (otpCode) => {
  return `
Hello,

Thank you for signing up to Void Video Library Management System.

Your verification code is:

  ${otpCode}

Please enter this code to complete your verification. This code will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,  
The Void Tech Team 
  `;
};

export const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
 Reset Your Password

Dear User,

You requested to reset your password. Please click the button below to proceed:
${resetPasswordUrl}
If you did not request this, please ignore this email. The link will expire in 10 minutes.

If the button above doesn’t work, copy and paste the following URL into your browser:
${resetPasswordUrl}

Thank you,
Void Tech Team

This is an automated message. Please do not reply to this email.
  `;
};

