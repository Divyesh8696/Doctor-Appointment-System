const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');
const { createAuditLog } = require('../utils/auditLogger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (phone) fieldsToUpdate.phone = phone;

        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        // Create audit log
        await createAuditLog(
            req.user._id,
            'PROFILE_UPDATE',
            'User',
            req.user._id,
            `Profile updated: ${Object.keys(fieldsToUpdate).join(', ')}`,
            req.ip
        );

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return next(new ErrorResponse('Current password is incorrect', 401));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'PASSWORD_CHANGE',
            'User',
            req.user._id,
            'Password changed successfully',
            req.ip
        );

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};
