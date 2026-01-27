const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res, next) => {
    try {
        const { patient, prescriber, status } = req.query;

        let query = {};

        if (patient) query.patient = patient;
        if (prescriber) query.prescriber = prescriber;
        if (status) query.status = status;

        const prescriptions = await Prescription.find(query)
            .populate('patient', 'firstName lastName medicalRecordNumber')
            .populate('prescriber', 'firstName lastName username')
            .populate('visit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('patient')
            .populate('prescriber', 'firstName lastName username')
            .populate('visit');

        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private
exports.createPrescription = async (req, res, next) => {
    try {
        req.body.prescriber = req.user.id;

        const prescription = await Prescription.create(req.body);

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
exports.updatePrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
exports.deletePrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }

        await prescription.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get prescriptions by patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private
exports.getPrescriptionsByPatient = async (req, res, next) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId })
            .populate('prescriber', 'firstName lastName username')
            .populate('visit')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        next(error);
    }
};
