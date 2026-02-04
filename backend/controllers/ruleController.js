const Rule = require('../models/Rule');

// @desc    Get all rules
// @route   GET /api/rules
// @access  Private
exports.getRules = async (req, res, next) => {
    try {
        const { type, isActive } = req.query;

        let query = {};
        if (type) query.type = type;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const rules = await Rule.find(query)
            .populate('createdBy', 'username email')
            .sort({ priority: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rules.length,
            data: rules
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single rule
// @route   GET /api/rules/:id
// @access  Private
exports.getRule = async (req, res, next) => {
    try {
        const rule = await Rule.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create rule
// @route   POST /api/rules
// @access  Private
exports.createRule = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const rule = await Rule.create(req.body);

        res.status(201).json({
            success: true,
            data: rule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update rule
// @route   PUT /api/rules/:id
// @access  Private
exports.updateRule = async (req, res, next) => {
    try {
        const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete rule
// @route   DELETE /api/rules/:id
// @access  Private
exports.deleteRule = async (req, res, next) => {
    try {
        const rule = await Rule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }

        await rule.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Evaluate rules
// @route   POST /api/rules/evaluate
// @access  Private
exports.evaluateRules = async (req, res, next) => {
    try {
        const { formData, ruleIds } = req.body;

        if (!formData) {
            return res.status(400).json({
                success: false,
                error: 'Please provide form data'
            });
        }

        let rules;
        if (ruleIds && ruleIds.length > 0) {
            rules = await Rule.find({ _id: { $in: ruleIds }, isActive: true });
        } else {
            rules = await Rule.find({ isActive: true });
        }

        // Sort by priority
        rules.sort((a, b) => b.priority - a.priority);

        const results = [];

        for (const rule of rules) {
            const conditionsMet = evaluateConditions(rule.conditions, formData);

            if (conditionsMet) {
                results.push({
                    ruleId: rule._id,
                    ruleName: rule.name,
                    type: rule.type,
                    actions: rule.actions,
                    applied: true
                });
            }
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to evaluate conditions
function evaluateConditions(conditions, formData) {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every(condition => {
        const fieldValue = formData[condition.field];

        switch (condition.operator) {
            case 'equals':
                return fieldValue == condition.value;
            case 'not_equals':
                return fieldValue != condition.value;
            case 'greater_than':
                return Number(fieldValue) > Number(condition.value);
            case 'less_than':
                return Number(fieldValue) < Number(condition.value);
            case 'contains':
                return String(fieldValue).includes(String(condition.value));
            case 'not_contains':
                return !String(fieldValue).includes(String(condition.value));
            case 'is_empty':
                return !fieldValue || fieldValue === '';
            case 'is_not_empty':
                return fieldValue && fieldValue !== '';
            default:
                return false;
        }
    });
}
