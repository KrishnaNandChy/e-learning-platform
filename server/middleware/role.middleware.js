/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

/**
 * Check if user is owner or admin
 */
exports.isOwnerOrAdmin = (model, idField = 'id') => {
  return async (req, res, next) => {
    try {
      const document = await model.findById(req.params[idField]);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.',
        });
      }

      // Admin can access anything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check ownership
      const ownerId = document.user || document.instructor || document.owner;
      if (ownerId && ownerId.toString() === req.user.id) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource.',
      });
    } catch (error) {
      console.error('Owner check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error.',
      });
    }
  };
};
