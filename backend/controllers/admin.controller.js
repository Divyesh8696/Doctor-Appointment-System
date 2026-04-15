const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { ErrorResponse } = require('../utils/errorHandler');
const { createAuditLog } = require('../utils/auditLogger');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
    try {
        const { role, isActive } = req.query;

        const query = {};

        if (role) {
            query.role = role;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const users = await User.find(query).select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Activate user
// @route   PUT /api/admin/users/:id/activate
// @access  Private (Admin only)
const activateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Create audit log
        await createAuditLog(
            req.user._id,
            'USER_ACTIVATE',
            'User',
            user._id,
            `User activated: ${user.email}`,
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

// @desc    Deactivate user
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private (Admin only)
const deactivateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Create audit log
        await createAuditLog(
            req.user._id,
            'USER_DEACTIVATE',
            'User',
            user._id,
            `User deactivated: ${user.email}`,
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

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'provider', 'admin'].includes(role)) {
            return next(new ErrorResponse('Invalid role', 400));
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Create audit log
        await createAuditLog(
            req.user._id,
            'ROLE_CHANGE',
            'User',
            user._id,
            `User role changed to: ${role}`,
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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return next(new ErrorResponse('Cannot delete your own account', 400));
        }

        await user.deleteOne();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'USER_DELETE',
            'User',
            user._id,
            `User deleted: ${user.email}`,
            req.ip
        );

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res, next) => {
    try {
        const { action, userId, limit = 100 } = req.query;

        const query = {};

        if (action) {
            query.action = action;
        }

        if (userId) {
            query.userId = userId;
        }

        const logs = await AuditLog.find(query)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalProviders = await User.countDocuments({ role: 'provider' });
        const totalServices = await Service.countDocuments();
        const activeServices = await Service.countDocuments({ isActive: true });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    providers: totalProviders,
                },
                services: {
                    total: totalServices,
                    active: activeServices,
                },
                appointments: {
                    total: totalAppointments,
                    pending: pendingAppointments,
                    completed: completedAppointments,
                    cancelled: cancelledAppointments,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    activateUser,
    deactivateUser,
    changeUserRole,
    deleteUser,
    getAuditLogs,
    getStats,
};
