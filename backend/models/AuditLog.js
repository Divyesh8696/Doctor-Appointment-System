const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                'USER_REGISTER',
                'USER_LOGIN',
                'USER_LOGOUT',
                'PROFILE_UPDATE',
                'PASSWORD_CHANGE',
                'SERVICE_CREATE',
                'SERVICE_UPDATE',
                'SERVICE_DELETE',
                'APPOINTMENT_BOOK',
                'APPOINTMENT_RESCHEDULE',
                'APPOINTMENT_CANCEL',
                'USER_ACTIVATE',
                'USER_DEACTIVATE',
                'USER_DELETE',
                'ROLE_CHANGE',
                'LOGIN_FAILURE',
                'APPOINTMENT_STATUS_UPDATE',
            ],
        },
        resource: {
            type: String,
            required: true,
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        details: {
            type: String,
            maxlength: [500, 'Details cannot be more than 500 characters'],
        },
        ipAddress: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Make audit logs immutable
auditLogSchema.pre('findOneAndUpdate', function (next) {
    next(new Error('Audit logs cannot be modified'));
});

auditLogSchema.pre('findOneAndDelete', function (next) {
    next(new Error('Audit logs cannot be deleted'));
});

// Index for faster queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

// FR5 S3 - Retain logs for 180 days (TTL Index)
// 180 days = 180 * 24 * 60 * 60 seconds = 15552000 seconds
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
