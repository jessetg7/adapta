const express = require('express');
const router = express.Router();
const {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionsByPatient
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/auditLogger');

// All routes require authentication
router.use(protect);

// Patient-specific route must come before /:id
router.get('/patient/:patientId', getPrescriptionsByPatient);

router.route('/')
    .get(getPrescriptions)
    .post(
        authorize('admin', 'doctor'),
        auditMiddleware('CREATE_PRESCRIPTION', 'Prescription'),
        createPrescription
    );

router.route('/:id')
    .get(
        auditMiddleware('VIEW_PRESCRIPTION', 'Prescription'),
        getPrescription
    )
    .put(
        authorize('admin', 'doctor'),
        auditMiddleware('UPDATE_PRESCRIPTION', 'Prescription'),
        updatePrescription
    )
    .delete(
        authorize('admin', 'doctor'),
        auditMiddleware('DELETE_PRESCRIPTION', 'Prescription'),
        deletePrescription
    );

module.exports = router;
