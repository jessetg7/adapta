const Workflow = require('../models/Workflow');

// @desc    Get all workflows
// @route   GET /api/workflows
// @access  Private
exports.getWorkflows = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        let query = {};
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const workflows = await Workflow.find(query)
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: workflows.length,
            data: workflows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single workflow
// @route   GET /api/workflows/:id
// @access  Private
exports.getWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!workflow) {
            return res.status(404).json({
                success: false,
                error: 'Workflow not found'
            });
        }

        res.status(200).json({
            success: true,
            data: workflow
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create workflow
// @route   POST /api/workflows
// @access  Private
exports.createWorkflow = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const workflow = await Workflow.create(req.body);

        res.status(201).json({
            success: true,
            data: workflow
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update workflow
// @route   PUT /api/workflows/:id
// @access  Private
exports.updateWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!workflow) {
            return res.status(404).json({
                success: false,
                error: 'Workflow not found'
            });
        }

        res.status(200).json({
            success: true,
            data: workflow
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete workflow
// @route   DELETE /api/workflows/:id
// @access  Private
exports.deleteWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({
                success: false,
                error: 'Workflow not found'
            });
        }

        await workflow.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Execute workflow
// @route   POST /api/workflows/:id/execute
// @access  Private
exports.executeWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({
                success: false,
                error: 'Workflow not found'
            });
        }

        if (!workflow.isActive) {
            return res.status(400).json({
                success: false,
                error: 'Workflow is not active'
            });
        }

        // TODO: Implement workflow execution logic
        // This is a placeholder for workflow execution
        const result = {
            workflowId: workflow._id,
            status: 'executed',
            message: 'Workflow execution logic to be implemented',
            data: req.body
        };

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
