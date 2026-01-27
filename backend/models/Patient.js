const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    medicalRecordNumber: {
        type: String,
        required: [true, 'Medical record number is required'],
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    contact: {
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: {
                type: String,
                default: 'USA'
            }
        }
    },
    insurance: {
        provider: String,
        policyNumber: String,
        groupNumber: String,
        effectiveDate: Date,
        expirationDate: Date
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    allergies: [String],
    medications: [String],
    medicalHistory: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for searching
patientSchema.index({ firstName: 'text', lastName: 'text', medicalRecordNumber: 'text' });
patientSchema.index({ medicalRecordNumber: 1 });

module.exports = mongoose.model('Patient', patientSchema);
