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
        enum: ['medical', 'administrative', 'consent', 'assessment', 'department', 'other'],
        default: 'other'
    },
    specialty: {
        type: String,
        trim: true
    },
    sections: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        fields: [{
            id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            label: {
                type: String,
                required: true
            },
            width: {
                type: String,
                default: 'full'
            },
            options: [mongoose.Schema.Types.Mixed],
            required: {
                type: Boolean,
                default: false
            },
            visibilityRules: [mongoose.Schema.Types.Mixed],
            validation: [mongoose.Schema.Types.Mixed]
        }]
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
