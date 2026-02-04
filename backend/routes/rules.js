const express = require('express');
const router = express.Router();
const {
    getRules,
    getRule,
    createRule,
    updateRule,
    deleteRule,
    evaluateRules
} = require('../controllers/ruleController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Evaluate route must come before /:id
router.post('/evaluate', evaluateRules);

router.route('/')
    .get(getRules)
    .post(authorize('admin', 'doctor'), createRule);

router.route('/:id')
    .get(getRule)
    .put(authorize('admin', 'doctor'), updateRule)
    .delete(authorize('admin'), deleteRule);

module.exports = router;
