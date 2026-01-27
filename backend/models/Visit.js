const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    visitDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    visitType: {
        type: String,
        enum: ['initial', 'follow-up', 'emergency', 'routine', 'consultation', 'procedure'],
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chiefComplaint: {
        type: String,
        trim: true
    },
    vitalSigns: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        respiratoryRate: Number,
        oxygenSaturation: Number,
        weight: Number,
        height: Number
    },
    diagnosis: [{
        code: String,
        description: String
    }],
    procedures: [{
        code: String,
        description: String
    }],
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }]
}, {
    timestamps: true
});

// Indexes for efficient querying
visitSchema.index({ patient: 1, visitDate: -1 });
visitSchema.index({ provider: 1, visitDate: -1 });
visitSchema.index({ status: 1 });

module.exports = mongoose.model('Visit', visitSchema);
