export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  const inProd = process.env.NODE_ENV === "production";

  // 🔥 Force cross-origin cookie allowance
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://mini-frontend-green.vercel.app");

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: inProd,
      sameSite: inProd ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    })
    .json({
      success: true,
      message,
      user,
    });
};
