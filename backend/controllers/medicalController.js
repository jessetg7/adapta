const Drug = require('../models/Drug');
const Investigation = require('../models/Investigation');

// @desc    Get all drugs (searchable)
// @route   GET /api/medical/drugs
// @access  Private
exports.getDrugs = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = { isActive: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { genericName: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const drugs = await Drug.find(query).limit(50).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: drugs.length,
            data: drugs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all investigations (searchable)
// @route   GET /api/medical/investigations
// @access  Private
exports.getInvestigations = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = { isActive: true };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        const investigations = await Investigation.find(query).limit(50).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: investigations.length,
            data: investigations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a drug
// @route   POST /api/medical/drugs
// @access  Private (Admin/Doctor)
exports.addDrug = async (req, res, next) => {
    try {
        const drug = await Drug.create(req.body);
        res.status(201).json({
            success: true,
            data: drug
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add an investigation
// @route   POST /api/medical/investigations
// @access  Private (Admin/Doctor)
exports.addInvestigation = async (req, res, next) => {
    try {
        const investigation = await Investigation.create(req.body);
        res.status(201).json({
            success: true,
            data: investigation
        });
    } catch (error) {
        next(error);
    }
};
