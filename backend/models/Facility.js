const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a facility name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Hospital', 'Clinic', 'Pharmacy', 'Diagnostic Center'],
        default: 'Clinic'
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    branding: {
        logo: String,
        primaryColor: String,
        secondaryColor: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Facility', facilitySchema);
