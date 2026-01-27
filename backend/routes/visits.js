const express = require('express');
const router = express.Router();
const {
    getVisits,
    getVisit,
    createVisit,
    updateVisit,
    deleteVisit,
    getVisitsByPatient
} = require('../controllers/visitController');
const { protect, authorize } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/auditLogger');

// All routes require authentication
router.use(protect);

// Patient-specific route must come before /:id
router.get('/patient/:patientId', getVisitsByPatient);

router.route('/')
    .get(getVisits)
    .post(
        authorize('admin', 'doctor', 'nurse'),
        auditMiddleware('CREATE_VISIT', 'Visit'),
        createVisit
    );

router.route('/:id')
    .get(
        auditMiddleware('VIEW_VISIT', 'Visit'),
        getVisit
    )
    .put(
        authorize('admin', 'doctor', 'nurse'),
        auditMiddleware('UPDATE_VISIT', 'Visit'),
        updateVisit
    )
    .delete(
        authorize('admin'),
        auditMiddleware('DELETE_VISIT', 'Visit'),
        deleteVisit
    );

module.exports = router;
