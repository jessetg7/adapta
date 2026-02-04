const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'VIEW_PATIENT',
            'CREATE_PATIENT',
            'UPDATE_PATIENT',
            'DELETE_PATIENT',
            'VIEW_PRESCRIPTION',
            'CREATE_PRESCRIPTION',
            'UPDATE_PRESCRIPTION',
            'DELETE_PRESCRIPTION',
            'VIEW_VISIT',
            'CREATE_VISIT',
            'UPDATE_VISIT',
            'DELETE_VISIT',
            'VIEW_TEMPLATE',
            'CREATE_TEMPLATE',
            'UPDATE_TEMPLATE',
            'DELETE_TEMPLATE',
            'LOGIN',
            'LOGOUT',
            'FAILED_LOGIN',
            'OTHER'
        ]
    },
    resourceType: {
        type: String,
        enum: ['Patient', 'Prescription', 'Visit', 'Template', 'Workflow', 'Rule', 'User', 'Submission']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    previousValue: {
        type: mongoose.Schema.Types.Mixed
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for efficient querying
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
