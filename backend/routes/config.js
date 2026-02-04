const express = require('express');
const router = express.Router();
const {
    getVitals,
    addVital,
    getMetadata
} = require('../controllers/systemConfigController');
const { protect, authorize } = require('../middleware/auth');

router.get('/vitals', getVitals);
router.post('/vitals', protect, authorize('admin'), addVital);
router.get('/metadata', getMetadata);

module.exports = router;
