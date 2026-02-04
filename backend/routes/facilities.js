const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacility,
    createFacility,
    getFacilityStaff
} = require('../controllers/facilityController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getFacilities)
    .post(protect, authorize('admin'), createFacility);

router.route('/:id').get(getFacility);
router.route('/:id/staff').get(protect, getFacilityStaff);

module.exports = router;
