const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a drug name'],
        unique: true,
        trim: true
    },
    genericName: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['Antibiotic', 'Analgesic', 'Antipyretic', 'Antihypertensive', 'Antidiabetic', 'Supplements', 'Other'],
        default: 'Other'
    },
    defaultDose: String,
    defaultRoute: String,
    defaultFrequency: String,
    defaultDuration: String,
    indications: [String],
    contraindications: [String],
    sideEffects: [String],
    warnings: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

drugSchema.index({ name: 'text', genericName: 'text' });

module.exports = mongoose.model('Drug', drugSchema);
