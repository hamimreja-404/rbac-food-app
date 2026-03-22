const jwt = require('jsonwebtoken');

/**
 * 1. Verify JWT Token Middleware
 * Ensures the user is logged in and attaches their data to the request.
 */
const verifyToken = (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in the Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided. Please log in.' 
      });
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user payload (id, role, country, name) to the request object
    req.user = decoded; 
    
    next(); // Move to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token. Please log in again.' 
    });
  }
};

/**
 * 2. Role-Based Access Control (RBAC) Middleware
 * Checks if the logged-in user's role is allowed to access the route.
 * @param {Array} allowedRoles - e.g., ['admin', 'manager']
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Failsafe: Ensure verifyToken ran first
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Authentication required to verify role.' 
      });
    }

    // Check if the user's role exists in the allowedRoles array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Your role '${req.user.role}' lacks permission for this action.` 
      });
    }
    
    next();
  };
};

/**
 * 3. Country-Based Access Middleware (Optional Strict Block)
 * Useful if you want to completely block an endpoint for a specific country.
 * @param {Array} allowedCountries - e.g., ['India']
 */
const checkCountry = (allowedCountries) => {
  return (req, res, next) => {
    if (!req.user || !req.user.country) {
      return res.status(403).json({ 
        success: false, 
        message: 'User country mapping not found.' 
      });
    }

    if (!allowedCountries.includes(req.user.country)) {
      return res.status(403).json({ 
        success: false, 
        message: `Geo-Blocked: This action is restricted in ${req.user.country}.` 
      });
    }
    
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
  checkCountry
};