require('dotenv').config();
const mongoose = require('mongoose');
const VitalDefinition = require('./models/VitalDefinition');
const Facility = require('./models/Facility');
const config = require('./config/config');

const vitals = [
    { id: 'height', label: 'Height', unit: 'cm', category: 'Basic', config: { min: 30, max: 250, step: 1 }, order: 1 },
    { id: 'weight', label: 'Weight', unit: 'kg', category: 'Basic', config: { min: 1, max: 300, step: 0.1 }, order: 2 },
    { id: 'bmi', label: 'BMI', unit: 'kg/m²', category: 'Basic', config: { step: 0.1 }, order: 3 },
    { id: 'temperature', label: 'Temperature', unit: '°C', category: 'Basic', config: { min: 34, max: 43, step: 0.1 }, order: 4 },
    { id: 'bloodPressure', label: 'BP', unit: 'mmHg', category: 'Cardiovascular', config: { placeholder: '120/80' }, order: 5 },
    { id: 'heartRate', label: 'HR', unit: 'bpm', category: 'Cardiovascular', config: { min: 30, max: 250, step: 1 }, order: 6 },
    { id: 'spo2', label: 'SpO2', unit: '%', category: 'Respiratory', config: { min: 50, max: 100, step: 1 }, order: 7 }
];

const facilities = [
    {
        name: 'City General Hospital',
        type: 'Hospital',
        address: { city: 'New York', state: 'NY' },
        branding: { primaryColor: '#1976d2', secondaryColor: '#dc004e' }
    },
    {
        name: 'Sunrise Clinic',
        type: 'Clinic',
        address: { city: 'Jersey City', state: 'NJ' }
    }
];

const seedSystemData = async () => {
    try {
        await mongoose.connect(config.mongoUri);

        await VitalDefinition.deleteMany();
        await Facility.deleteMany();

        await VitalDefinition.create(vitals);
        await Facility.create(facilities);

        console.log('System metadata seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding system data:', error);
        process.exit(1);
    }
};

seedSystemData();
