const Facility = require('../models/Facility');
const User = require('../models/User');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public
exports.getFacilities = async (req, res, next) => {
    try {
        const facilities = await Facility.find({ isActive: true });
        res.status(200).json({
            success: true,
            count: facilities.length,
            data: facilities
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single facility
// @route   GET /api/facilities/:id
// @access  Public
exports.getFacility = async (req, res, next) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ success: false, error: 'Facility not found' });
        }
        res.status(200).json({ success: true, data: facility });
    } catch (error) {
        next(error);
    }
};

// @desc    Create facility
// @route   POST /api/facilities
// @access  Private (Admin)
exports.createFacility = async (req, res, next) => {
    try {
        const facility = await Facility.create(req.body);
        res.status(201).json({ success: true, data: facility });
    } catch (error) {
        next(error);
    }
};

// @desc    Get staff (doctors/nurses) for a facility
// @route   GET /api/facilities/:id/staff
// @access  Private
exports.getFacilityStaff = async (req, res, next) => {
    try {
        const staff = await User.find({
            facility: req.params.id,
            role: { $in: ['doctor', 'nurse', 'staff'] },
            isActive: true
        }).select('firstName lastName role profile');

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (error) {
        next(error);
    }
};
