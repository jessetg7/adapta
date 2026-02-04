const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
    },
    prescriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medication: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        genericName: String,
        strength: String,
        form: {
            type: String,
            enum: ['tablet', 'capsule', 'liquid', 'injection', 'cream', 'ointment', 'inhaler', 'other']
        }
    },
    dosage: {
        amount: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        route: {
            type: String,
            enum: ['oral', 'topical', 'injection', 'inhalation', 'other']
        },
        duration: String
    },
    quantity: {
        type: Number,
        required: true
    },
    refills: {
        type: Number,
        default: 0
    },
    instructions: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'discontinued'],
        default: 'active'
    },
    pharmacy: {
        name: String,
        phone: String,
        address: String
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
prescriptionSchema.index({ patient: 1, status: 1 });
prescriptionSchema.index({ prescriber: 1, createdAt: -1 });
prescriptionSchema.index({ visit: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
