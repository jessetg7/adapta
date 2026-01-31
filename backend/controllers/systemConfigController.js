const VitalDefinition = require('../models/VitalDefinition');

// @desc    Get all vital definitions
// @route   GET /api/config/vitals
// @access  Public (or Private)
exports.getVitals = async (req, res, next) => {
    try {
        const vitals = await VitalDefinition.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: vitals.length,
            data: vitals
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a vital definition
// @route   POST /api/config/vitals
// @access  Private (Admin)
exports.addVital = async (req, res, next) => {
    try {
        const vital = await VitalDefinition.create(req.body);
        res.status(201).json({
            success: true,
            data: vital
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get system metadata (Routes, Frequencies)
// @route   GET /api/config/metadata
// @access  Public
exports.getMetadata = async (req, res, next) => {
    try {
        // These could also be moved to DB if even more flexibility is needed
        const metadata = {
            routes: ['Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Ear Drops', 'Eye Drops', 'Rectal', 'Vaginal'],
            frequencies: [
                { id: 'OD', label: 'Once a day' },
                { id: 'BID', label: 'Twice a day' },
                { id: 'TID', label: 'Three times a day' },
                { id: 'QID', label: 'Four times a day' },
                { id: 'STAT', label: 'Immediately' },
                { id: 'PRN', label: 'As needed' },
                { id: 'SOS', label: 'In emergency' },
                { id: 'HS', label: 'At bedtime' }
            ]
        };

        res.status(200).json({
            success: true,
            data: metadata
        });
    } catch (error) {
        next(error);
    }
};
