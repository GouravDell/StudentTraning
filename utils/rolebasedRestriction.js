const restrict = (role) => {
   return (req, res, next) => {
      if (!role.includes(req.user.role)) {
        return next(false, 'You do not have permission to perform this action', 403);
      }
      next();
    };
  };
module.exports = restrict;
