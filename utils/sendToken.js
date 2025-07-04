export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const inProd = process.env.NODE_ENV === "production";

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: inProd,                       // only true in production (HTTPS)
      sameSite: inProd ? "None" : "Lax",    // allow cross‑site in prod, but use Lax in dev
      maxAge: 24 * 60 * 60 * 1000,          // 1 day
      path: "/",                            // ensure it’s sent on /api/v1/auth/me
    })
    .json({
      success: true,
      message,
      user,
    });
};
