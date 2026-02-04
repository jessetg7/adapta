const express = require('express');
const router = express.Router();
const {
    getWorkflows,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
} = require('../controllers/workflowController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getWorkflows)
    .post(authorize('admin', 'doctor'), createWorkflow);

router.route('/:id')
    .get(getWorkflow)
    .put(authorize('admin', 'doctor'), updateWorkflow)
    .delete(authorize('admin'), deleteWorkflow);

router.post('/:id/execute', executeWorkflow);

module.exports = router;
