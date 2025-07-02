// middlewares/catchAsyncErrors.js

const catchAsyncErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsyncErrors;
