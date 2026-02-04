const mongoose = require('mongoose');

const vitalDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    label: {
        type: String,
        required: true,
        trim: true
    },
    unit: String,
    category: {
        type: String,
        enum: ['Basic', 'Cardiovascular', 'Respiratory', 'Metabolic', 'Other'],
        default: 'Basic'
    },
    config: {
        min: Number,
        max: Number,
        step: Number,
        helpText: String,
        prefix: String,
        suffix: String
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VitalDefinition', vitalDefinitionSchema);
