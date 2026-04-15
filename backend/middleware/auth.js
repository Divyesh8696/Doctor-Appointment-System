const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return next(new ErrorResponse('Invalid token', 401));
        }

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        if (!user.isActive) {
            return next(new ErrorResponse('User account is deactivated', 403));
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Authorize roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};

module.exports = { protect, authorize };
