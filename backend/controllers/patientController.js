const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res, next) => {
    try {
        const { isActive, search } = req.query;

        let query = {};

        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$text = { $search: search };
        }

        const patients = await Patient.find(query).sort({ lastName: 1, firstName: 1 });

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);

        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        await patient.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Private
exports.searchPatients = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Please provide search query'
            });
        }

        const patients = await Patient.find({
            $or: [
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } },
                { medicalRecordNumber: { $regex: q, $options: 'i' } },
                { 'contact.email': { $regex: q, $options: 'i' } }
            ]
        }).limit(20);

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        next(error);
    }
};
