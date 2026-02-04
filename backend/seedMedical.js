require('dotenv').config();
const mongoose = require('mongoose');
const Drug = require('./models/Drug');
const Investigation = require('./models/Investigation');
const config = require('./config/config');

// I'll define the data directly to avoid ESM/CJS issues if the frontend file is ESM
const drugs = [
    { name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', defaultDose: '500mg', defaultRoute: 'Oral', defaultFrequency: 'TID', defaultDuration: '5 Days' },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic', defaultDose: '500mg', defaultRoute: 'Oral', defaultFrequency: 'BID', defaultDuration: '7 Days' },
    { name: 'Metformin 500mg', genericName: 'Metformin', category: 'Antidiabetic', defaultDose: '500mg', defaultRoute: 'Oral', defaultFrequency: 'BID', defaultDuration: '30 Days' },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'Antihypertensive', defaultDose: '5mg', defaultRoute: 'Oral', defaultFrequency: 'OD', defaultDuration: '30 Days' },
    { name: 'Pantoprazole 40mg', genericName: 'Pantoprazole', category: 'Other', defaultDose: '40mg', defaultRoute: 'Oral', defaultFrequency: 'OD (Empty Stomach)', defaultDuration: '14 Days' }
];

const investigations = [
    { name: 'Complete Blood Count (CBC)', category: 'Laboratory', description: 'Screening for anemia, infection, etc.' },
    { name: 'RBS (Random Blood Sugar)', category: 'Laboratory', unit: 'mg/dL' },
    { name: 'Chest X-Ray', category: 'Radiology' },
    { name: 'Urinalysis', category: 'Laboratory' },
    { name: 'Liver Function Test (LFT)', category: 'Laboratory' }
];

const seedMedicalData = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing
        await Drug.deleteMany();
        await Investigation.deleteMany();

        await Drug.create(drugs);
        await Investigation.create(investigations);

        console.log('Medical data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding medical data:', error);
        process.exit(1);
    }
};

seedMedicalData();
