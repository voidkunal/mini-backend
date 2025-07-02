// utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken(); // or user.getJwtToken()

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Required for HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-origin
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,
      token,
    });
};
