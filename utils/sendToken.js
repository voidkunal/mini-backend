export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,           // Required for HTTPS (e.g., Vercel deployment)
    sameSite: "None",       // Allow cross-origin requests
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,     // Optional: send token in JSON for frontend use (not required if using cookie only)
      user,      // Send user data (e.g., name, role, etc.)
    });
};
