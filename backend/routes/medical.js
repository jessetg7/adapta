const express = require('express');
const router = express.Router();
const {
    getDrugs,
    getInvestigations,
    addDrug,
    addInvestigation
} = require('../controllers/medicalController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/drugs', getDrugs);
router.get('/investigations', getInvestigations);

router.post('/drugs', authorize('admin', 'doctor'), addDrug);
router.post('/investigations', authorize('admin', 'doctor'), addInvestigation);

module.exports = router;
