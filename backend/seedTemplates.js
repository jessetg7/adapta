// backend/seedTemplates.js
const mongoose = require('mongoose');
const config = require('./config/config');
const Template = require('./models/Template');
const User = require('./models/User');

const seedTemplates = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB for seeding...');

        // Find a user to associate with templates
        let user = await User.findOne();
        if (!user) {
            console.log('No user found, creating mock user...');
            user = await User.create({
                username: 'admin',
                email: 'admin@adapta.com',
                password: 'password123',
                role: 'admin'
            });
        }

        const templates = [
            {
                name: 'General Consultation',
                category: 'department',
                specialty: 'general',
                isActive: true,
                createdBy: user._id,
                sections: [
                    {
                        id: 'vitalsAndComplaint',
                        title: 'Vitals & Complaint',
                        fields: [
                            { id: 'chiefComplaint', type: 'textarea', label: 'Chief Complaint', required: true, width: 'full' },
                            { id: 'vitals', type: 'vitals', label: 'Vitals Signs', width: 'full' },
                        ]
                    },
                    {
                        id: 'clinicalExamination',
                        title: 'Clinical Examination',
                        fields: [
                            { id: 'notes', label: 'Examination Notes', type: 'textarea', width: 'full' },
                            { id: 'diagnosis', label: 'Diagnosis', type: 'text', width: 'full', required: true }
                        ]
                    }
                ]
            },
            {
                name: 'Gynaecology',
                category: 'department',
                specialty: 'gynaecology',
                isActive: true,
                createdBy: user._id,
                sections: [
                    {
                        id: 'vitalsAndComplaint',
                        title: 'Vitals & Complaint',
                        fields: [
                            { id: 'chiefComplaint', type: 'textarea', label: 'Chief Complaint', required: true, width: 'full' },
                            { id: 'vitals', type: 'vitals', label: 'Vitals Signs', width: 'full' },
                        ]
                    },
                    {
                        id: 'obstetricHistory',
                        title: 'Obstetric History',
                        fields: [
                            {
                                id: 'pregnancyStatus', label: 'Pregnancy Status', type: 'dropdown', width: 'half', options: [
                                    { label: 'Not Pregnant', value: 'Not Pregnant' },
                                    { label: 'Pregnant', value: 'Pregnant' },
                                    { label: 'Postpartum', value: 'Postpartum' }
                                ]
                            },
                            { id: 'lmp', label: 'LMP (Last Menstrual Period)', type: 'date', width: 'half' },
                            { id: 'edd', label: 'EDD (Expected Delivery Date)', type: 'date', width: 'half' },
                            { id: 'gravida', label: 'Gravida (G)', type: 'number', width: 'half' },
                            { id: 'para', label: 'Para (P)', type: 'number', width: 'half' },
                        ]
                    },
                    {
                        id: 'clinicalExamination',
                        title: 'Clinical Examination',
                        fields: [
                            { id: 'examinationNotes', label: 'Examination Notes', type: 'textarea', width: 'full' },
                            { id: 'diagnosis', label: 'Diagnosis', type: 'text', width: 'full', required: true }
                        ]
                    }
                ]
            },
            {
                name: 'Paediatrics',
                category: 'department',
                specialty: 'paediatrics',
                isActive: true,
                createdBy: user._id,
                sections: [
                    {
                        id: 'vitalsAndComplaint',
                        title: 'Growth & Vitals',
                        fields: [
                            { id: 'chiefComplaint', type: 'textarea', label: 'Chief Complaint', required: true, width: 'full' },
                            { id: 'weight', label: 'Weight (kg)', type: 'number', width: 'half' },
                            { id: 'height', label: 'Height (cm)', type: 'number', width: 'half' },
                            { id: 'headCircumference', label: 'Head Circumference (cm)', type: 'number', width: 'half' },
                            { id: 'vitals', type: 'vitals', label: 'Vitals', width: 'full' },
                        ]
                    },
                    {
                        id: 'developmentAndImmunization',
                        title: 'Development & Immunization',
                        fields: [
                            { id: 'developmentMilestones', label: 'Developmental Milestones', type: 'textarea', width: 'full' },
                            {
                                id: 'immunizationStatus', label: 'Immunization Up to Date?', type: 'dropdown', width: 'half', options: [
                                    { label: 'Yes', value: 'Yes' },
                                    { label: 'No', value: 'No' },
                                    { label: 'Partial', value: 'Partial' }
                                ]
                            },
                        ]
                    },
                    {
                        id: 'clinicalExamination',
                        title: 'Clinical Examination',
                        fields: [
                            { id: 'diagnosis', label: 'Diagnosis', type: 'text', width: 'full', required: true }
                        ]
                    }
                ]
            }
        ];

        // Clear existing department templates
        await Template.deleteMany({ category: 'department' });

        // Insert new templates
        await Template.insertMany(templates);
        console.log('Successfully seeded department templates!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding templates:', error);
        process.exit(1);
    }
};

seedTemplates();
