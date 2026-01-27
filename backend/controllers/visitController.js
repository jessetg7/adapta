const Visit = require('../models/Visit');

// @desc    Get all visits
// @route   GET /api/visits
// @access  Private
exports.getVisits = async (req, res, next) => {
    try {
        const { patient, provider, status } = req.query;

        let query = {};

        if (patient) query.patient = patient;
        if (provider) query.provider = provider;
        if (status) query.status = status;

        const visits = await Visit.find(query)
            .populate('patient', 'firstName lastName medicalRecordNumber')
            .populate('provider', 'firstName lastName username')
            .populate('submissions')
            .sort({ visitDate: -1 });

        res.status(200).json({
            success: true,
            count: visits.length,
            data: visits
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single visit
// @route   GET /api/visits/:id
// @access  Private
exports.getVisit = async (req, res, next) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('patient')
            .populate('provider', 'firstName lastName username')
            .populate('submissions');

        if (!visit) {
            return res.status(404).json({
                success: false,
                error: 'Visit not found'
            });
        }

        res.status(200).json({
            success: true,
            data: visit
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create visit
// @route   POST /api/visits
// @access  Private
exports.createVisit = async (req, res, next) => {
    try {
        req.body.provider = req.user.id;

        const visit = await Visit.create(req.body);

        res.status(201).json({
            success: true,
            data: visit
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update visit
// @route   PUT /api/visits/:id
// @access  Private
exports.updateVisit = async (req, res, next) => {
    try {
        const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!visit) {
            return res.status(404).json({
                success: false,
                error: 'Visit not found'
            });
        }

        res.status(200).json({
            success: true,
            data: visit
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete visit
// @route   DELETE /api/visits/:id
// @access  Private
exports.deleteVisit = async (req, res, next) => {
    try {
        const visit = await Visit.findById(req.params.id);

        if (!visit) {
            return res.status(404).json({
                success: false,
                error: 'Visit not found'
            });
        }

        await visit.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get visits by patient
// @route   GET /api/visits/patient/:patientId
// @access  Private
exports.getVisitsByPatient = async (req, res, next) => {
    try {
        const visits = await Visit.find({ patient: req.params.patientId })
            .populate('provider', 'firstName lastName username')
            .populate('submissions')
            .sort({ visitDate: -1 });

        res.status(200).json({
            success: true,
            count: visits.length,
            data: visits
        });
    } catch (error) {
        next(error);
    }
};
