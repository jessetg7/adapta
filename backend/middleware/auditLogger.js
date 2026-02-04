const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry
 * @param {Object} options - Audit log options
 * @param {ObjectId} options.user - User ID performing the action
 * @param {String} options.action - Action being performed
 * @param {String} options.resourceType - Type of resource
 * @param {ObjectId} options.resourceId - ID of the resource
 * @param {Object} options.details - Additional details
 * @param {String} options.ipAddress - IP address of the request
 * @param {String} options.userAgent - User agent string
 * @param {Object} options.previousValue - Previous value (for updates)
 * @param {Object} options.newValue - New value (for updates)
 */
const logAudit = async (options) => {
    try {
        await AuditLog.create(options);
    } catch (error) {
        console.error('Error creating audit log:', error);
        // Don't throw error - audit logging should not break the main flow
    }
};

/**
 * Middleware to automatically log audit trail
 */
const auditMiddleware = (action, resourceType) => {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json;

        // Override json method to capture response
        res.json = function (data) {
            // Log audit after successful operation
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                logAudit({
                    user: req.user._id,
                    action,
                    resourceType,
                    resourceId: req.params.id || data?.data?._id,
                    details: {
                        method: req.method,
                        path: req.path,
                        query: req.query,
                        body: req.body
                    },
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.headers['user-agent']
                });
            }

            // Call original json method
            return originalJson.call(this, data);
        };

        next();
    };
};

module.exports = {
    logAudit,
    auditMiddleware
};
