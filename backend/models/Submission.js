const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {}
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
        default: 'draft'
    },
    version: {
        type: Number,
        default: 1
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
submissionSchema.index({ patient: 1, createdAt: -1 });
submissionSchema.index({ template: 1, createdAt: -1 });
submissionSchema.index({ visit: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
