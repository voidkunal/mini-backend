// utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only true on HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
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
