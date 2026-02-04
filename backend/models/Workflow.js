const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a workflow name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    trigger: {
        type: {
            type: String,
            enum: ['manual', 'form_submit', 'field_change', 'status_change', 'scheduled'],
            required: true
        },
        config: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    steps: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['notification', 'api_call', 'data_transform', 'approval', 'condition', 'delay'],
            required: true
        },
        config: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        nextStep: String,
        conditions: [{
            field: String,
            operator: String,
            value: mongoose.Schema.Types.Mixed,
            nextStep: String
        }]
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

module.exports = mongoose.model('Workflow', workflowSchema);
