export const sendToken = (user, statusCode, message, res) => {
  try {
    const token = user.generateToken();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({ success: true, message, user, token });
  } catch (err) {
    console.error("🔴 sendToken Error:", err);
    res.status(500).json({ success: false, message: "Token generation failed" });
  }
};