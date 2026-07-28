// Higher-Order Function to handle async errors and remove try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
//   promise resolve ensures we can always use catch to handle any errors
};

module.exports = asyncHandler;