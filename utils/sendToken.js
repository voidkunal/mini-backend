// utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,           // Use HTTPS only
    sameSite: "None",       // Allow cross-site
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,               // ✅ Only user info, NOT token
    });
};
