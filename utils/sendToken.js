// utils/sendToken.js

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true, // ✅ Required for HTTPS (Render)
    sameSite: "None", // ✅ Must be 'None' for cross-origin cookies
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
