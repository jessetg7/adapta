const express = require('express');
const router = express.Router();
const {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/auditLogger');

// All routes require authentication
router.use(protect);

// Search route must come before /:id
router.get('/search', searchPatients);

router.route('/')
    .get(getPatients)
    .post(
        authorize('admin', 'doctor', 'nurse', 'staff'),
        auditMiddleware('CREATE_PATIENT', 'Patient'),
        createPatient
    );

router.route('/:id')
    .get(
        auditMiddleware('VIEW_PATIENT', 'Patient'),
        getPatient
    )
    .put(
        authorize('admin', 'doctor', 'nurse', 'staff'),
        auditMiddleware('UPDATE_PATIENT', 'Patient'),
        updatePatient
    )
    .delete(
        authorize('admin'),
        auditMiddleware('DELETE_PATIENT', 'Patient'),
        deletePatient
    );

module.exports = router;
