const AuditLog = require('../models/AuditLog');

const createAuditLog = async (userId, action, resource, resourceId = null, details = '', ipAddress = '') => {
    try {
        await AuditLog.create({
            userId,
            action,
            resource,
            resourceId,
            details,
            ipAddress,
        });
    } catch (error) {
        console.error('Error creating audit log:', error.message);
        // Don't throw error to prevent audit logging from breaking the main flow
    }
};

module.exports = { createAuditLog };
