// backend/middleware/permissions.js

/**
 * Role-Based Access Control (RBAC) Permissions
 * Defines standard hospital roles and their associated permissions
 */
const ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    RECEPTIONIST: 'receptionist',
    LAB_TECH: 'lab_tech',
    BILLING: 'billing'
};

const PERMISSIONS = {
    'forms.view': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
    'forms.create': [ROLES.ADMIN],
    'forms.edit': [ROLES.ADMIN],
    'consultation.view': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
    'consultation.create': [ROLES.ADMIN, ROLES.DOCTOR],
    'prescriptions.view': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECH],
    'prescriptions.create': [ROLES.ADMIN, ROLES.DOCTOR],
    'lab.view': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.LAB_TECH],
    'lab.manage': [ROLES.ADMIN, ROLES.LAB_TECH],
    'billing.view': [ROLES.ADMIN, ROLES.BILLING, ROLES.RECEPTIONIST],
    'billing.manage': [ROLES.ADMIN, ROLES.BILLING],
    'registration.view': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.NURSE],
    'registration.create': [ROLES.ADMIN, ROLES.RECEPTIONIST],
    'reports.view': [ROLES.ADMIN],
    'workflows.manage': [ROLES.ADMIN],
    'rules.manage': [ROLES.ADMIN]
};

/**
 * Middleware to check if user has required permission
 * @param {string} permission 
 */
exports.checkPermission = (permission) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        const allowedRoles = PERMISSIONS[permission] || [];

        if (req.user?.role === ROLES.ADMIN || allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                error: `Access Denied: You do not have permission to ${permission}`
            });
        }
    };
};

exports.ROLES = ROLES;
exports.PERMISSIONS = PERMISSIONS;
