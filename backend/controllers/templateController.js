const Template = require('../models/Template');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
exports.getTemplates = async (req, res, next) => {
    try {
        const { category, isActive, search } = req.query;

        let query = {};

        if (category) query.category = category;
        if (specialty) query.specialty = specialty;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$text = { $search: search };
        }

        const templates = await Template.find(query)
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private
exports.getTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id)
            .populate('createdBy', 'username email')
            .populate('rules')
            .populate('workflows');

        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private
exports.createTemplate = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const template = await Template.create(req.body);

        res.status(201).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
exports.updateTemplate = async (req, res, next) => {
    try {
        let template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }

        // Increment version on update
        req.body.version = (template.version || 1) + 1;

        template = await Template.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }

        await template.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clone template
// @route   POST /api/templates/:id/clone
// @access  Private
exports.cloneTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }

        const clonedData = {
            ...template.toObject(),
            name: `${template.name} (Copy)`,
            createdBy: req.user.id,
            version: 1
        };

        delete clonedData._id;
        delete clonedData.createdAt;
        delete clonedData.updatedAt;

        const clonedTemplate = await Template.create(clonedData);

        res.status(201).json({
            success: true,
            data: clonedTemplate
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unique specialties for department templates
// @route   GET /api/templates/specialties
// @access  Private
exports.getSpecialties = async (req, res, next) => {
    try {
        const specialties = await Template.distinct('specialty', { category: 'department', isActive: true });

        const data = specialties.map(s => ({
            id: s,
            name: s.charAt(0).toUpperCase() + s.slice(1)
        }));

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
};
