const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided. Please log in.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; 
    
    next(); 
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token. Please log in again.' 
    });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Authentication required to verify role.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Your role '${req.user.role}' lacks permission for this action.` 
      });
    }
    
    next();
  };
};

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