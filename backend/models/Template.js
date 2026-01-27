const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a template name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['medical', 'administrative', 'consent', 'assessment', 'other'],
        default: 'other'
    },
    fields: [{
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['text', 'textarea', 'number', 'date', 'select', 'checkbox', 'radio', 'file', 'signature']
        },
        label: {
            type: String,
            required: true
        },
        placeholder: String,
        defaultValue: mongoose.Schema.Types.Mixed,
        required: {
            type: Boolean,
            default: false
        },
        validation: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        options: [String],
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }],
    layout: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    rules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rule'
    }],
    workflows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow'
    }],
    version: {
        type: Number,
        default: 1
    },
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

// Index for searching
templateSchema.index({ name: 'text', description: 'text' });
templateSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Template', templateSchema);
