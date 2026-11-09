const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getToken(request) {
  const authorization = request.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7).trim();
}

async function authenticate(request, response, next) {
  const token = getToken(request);
  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'Authentication required. Provide a Bearer token.',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password');

    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'The account associated with this token no longer exists.',
      });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
      });
    }

    return next(error);
  }
}

function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      });
    }

    return next();
  };
}

module.exports = { authenticate, requireRole };
