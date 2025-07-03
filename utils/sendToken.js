export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true, // Required for HTTPS
    sameSite: "None", // Required for cross-site cookie
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res.status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user,
    });
};
