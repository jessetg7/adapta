const express = require('express');
const router = express.Router();
const {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    cloneTemplate
} = require('../controllers/templateController');
const { protect, authorize } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/auditLogger');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getTemplates)
    .post(
        authorize('admin', 'doctor', 'nurse'),
        auditMiddleware('CREATE_TEMPLATE', 'Template'),
        createTemplate
    );

router.route('/:id')
    .get(
        auditMiddleware('VIEW_TEMPLATE', 'Template'),
        getTemplate
    )
    .put(
        authorize('admin', 'doctor', 'nurse'),
        auditMiddleware('UPDATE_TEMPLATE', 'Template'),
        updateTemplate
    )
    .delete(
        authorize('admin'),
        auditMiddleware('DELETE_TEMPLATE', 'Template'),
        deleteTemplate
    );

router.post('/:id/clone',
    authorize('admin', 'doctor', 'nurse'),
    cloneTemplate
);

module.exports = router;
