// import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";
// import catchAsyncErrors from "./catchAsyncErrors.js";
// import ErrorHandler from "./errorMiddlewares.js";

// // Middleware to check if user is authenticated
// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("User is not authenticated", 401));
//   }

//   try {
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     const user = await User.findById(decodedData.id);

//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return next(new ErrorHandler("Invalid or expired token", 401));
//   }
// });

// // Middleware to check if user has required role(s)
// export const isAuthorized = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role (${req.user?.role}) is not allowed to access this resource.`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };


// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";

// ✅ Auth check using Authorization header
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

// ✅ Role-based access
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
