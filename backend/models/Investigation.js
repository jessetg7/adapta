const mongoose = require('mongoose');

const investigationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an investigation name'],
        unique: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Laboratory', 'Radiology', 'Pathology', 'Cardiology', 'Other'],
        default: 'Laboratory'
    },
    description: String,
    normalRange: String,
    unit: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

investigationSchema.index({ name: 'text' });

module.exports = mongoose.model('Investigation', investigationSchema);
