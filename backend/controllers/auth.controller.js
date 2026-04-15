const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { ErrorResponse } = require('../utils/errorHandler');
const { createAuditLog } = require('../utils/auditLogger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role, hospitalName, consent } = req.body;

        // DPDP Act - Obtain user consent
        if (!consent) {
            return next(new ErrorResponse('You must provide consent to register', 400));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('User already exists with this email', 400));
        }

        const user = new User({
            name,
            email,
            password,
            phone,
            role: role || 'user',
            hospitalName: role === 'provider' ? hospitalName : undefined,
            consent: true,
            consentDate: new Date(),
        });

        await user.save();

        // Log the registration event for security auditing
        await createAuditLog(
            user._id,
            'USER_REGISTER',
            'User',
            user._id,
            `User registered with role: ${user.role}`,
            req.ip
        );

        const token = generateToken(user._id, user.role);

        // Set token in HTTP-only cookie
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    hospitalName: user.hospitalName,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return next(new ErrorResponse('Account is temporarily locked. Please try again after 15 minutes.', 401));
        }

        // Check if user is active
        if (!user.isActive) {
            return next(new ErrorResponse('Account is deactivated', 403));
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Increment login attempts
            user.loginAttempts += 1;
            
            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                user.loginAttempts = 0; // Reset attempts after locking
            }
            
            await user.save({ validateModifiedOnly: true });

            // Log failed login attempt
            await createAuditLog(
                user._id,
                'LOGIN_FAILURE',
                'User',
                user._id,
                `Failed login attempt. Total attempts: ${user.loginAttempts}`,
                req.ip
            );

            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save({ validateModifiedOnly: true });

        // Create audit log
        await createAuditLog(
            user._id,
            'USER_LOGIN',
            'User',
            user._id,
            'User logged in successfully',
            req.ip
        );

        // Generate token
        const token = generateToken(user._id, user.role);

        // Set token in HTTP-only cookie
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        // Create audit log
        await createAuditLog(
            req.user._id,
            'USER_LOGOUT',
            'User',
            req.user._id,
            'User logged out',
            req.ip
        );

        // Clear cookie
        res.status(200).cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        }).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
};
