// export const sendToken = (user, statusCode, message, res) => {
//   const token = user.generateToken();
//   const inProd = process.env.NODE_ENV === "production";

//   // 🔥 Force cross-origin cookie allowance
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Origin", "https://mini-frontend-green.vercel.app");

//   res
//     .status(statusCode)
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // ✅ important for Vercel
//       sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // ✅ allow cross-origin cookies
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     })
//     .json({
//       success: true,
//       message,
//       user,
//     });
// };


export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  const inProd = process.env.NODE_ENV === "production";

  // 🔥 Force cross-origin cookie allowance
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://mini-frontend-green.vercel.app"); // ✅ must match exactly

res.cookie("token", token, {
  httpOnly: true,
  secure: true, // for HTTPS (Render sets this)
  sameSite: "None", // ✅ allow cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})
.json({
      success: true,
      message,
      user,
    });
};
