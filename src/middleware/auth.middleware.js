import passport from '../config/passport.js';

/**
 * Middleware to authenticate user using JWT
 * Attaches user to req.user if token is valid
 */
export const authMiddleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid or missing token' });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to check if authenticated user is an admin
 * Must be used after authMiddleware
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - Please login first' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  
  next();
};
