// This middleware checks if the logged-in user's role is allowed
// to access a specific route. Usage: authorize('recruiter', 'admin')

const authorize = (...allowedRoles) => {
  // '...allowedRoles' collects all arguments into an array
  // e.g. authorize('recruiter', 'admin') → allowedRoles = ['recruiter', 'admin']

  return (req, res, next) => {
    // req.user already set by authMiddleware.js (protect function) before this runs
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not authorized for this action.`,
      });
    }
    next(); // role is allowed, proceed to controller
  };
};

module.exports = authorize;