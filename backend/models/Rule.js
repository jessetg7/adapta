const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a rule name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['validation', 'calculation', 'visibility', 'required', 'default_value'],
        required: true
    },
    priority: {
        type: Number,
        default: 0
    },
    conditions: [{
        field: {
            type: String,
            required: true
        },
        operator: {
            type: String,
            enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains', 'is_empty', 'is_not_empty'],
            required: true
        },
        value: mongoose.Schema.Types.Mixed
    }],
    actions: [{
        type: {
            type: String,
            enum: ['show', 'hide', 'set_value', 'set_required', 'set_optional', 'show_error', 'calculate'],
            required: true
        },
        target: {
            type: String,
            required: true
        },
        value: mongoose.Schema.Types.Mixed
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for priority-based sorting
ruleSchema.index({ priority: -1 });

module.exports = mongoose.model('Rule', ruleSchema);
