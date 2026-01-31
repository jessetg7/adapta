// src/services/medicalService.js
// Mock data
const MOCK_DRUGS = [
    { name: 'Paracetamol', category: 'Analgesic', defaultDose: '500mg', defaultRoute: 'oral', defaultFrequency: 'TDS', defaultDuration: '3 days' },
    { name: 'Amoxicillin', category: 'Antibiotic', defaultDose: '500mg', defaultRoute: 'oral', defaultFrequency: 'TDS', defaultDuration: '5 days' },
    { name: 'Ibuprofen', category: 'NSAID', defaultDose: '400mg', defaultRoute: 'oral', defaultFrequency: 'BD', defaultDuration: '3 days' },
    { name: 'Pantoprazole', category: 'PPI', defaultDose: '40mg', defaultRoute: 'oral', defaultFrequency: 'OD', defaultDuration: '7 days' },
    { name: 'Metformin', category: 'Antidiabetic', defaultDose: '500mg', defaultRoute: 'oral', defaultFrequency: 'BD', defaultDuration: 'Continuous' },
    { name: 'Amlodipine', category: 'Antihypertensive', defaultDose: '5mg', defaultRoute: 'oral', defaultFrequency: 'OD', defaultDuration: 'Continuous' },
    { name: 'Cetirizine', category: 'Antihistamine', defaultDose: '10mg', defaultRoute: 'oral', defaultFrequency: 'OD', defaultDuration: '3 days' },
    { name: 'Azithromycin', category: 'Antibiotic', defaultDose: '500mg', defaultRoute: 'oral', defaultFrequency: 'OD', defaultDuration: '3 days' },
];

const MOCK_INVESTIGATIONS = [
    { name: 'Complete Blood Count (CBC)' },
    { name: 'Lipid Profile' },
    { name: 'HbA1c' },
    { name: 'Thyroid Function Test (TFT)' },
    { name: 'Liver Function Test (LFT)' },
    { name: 'Renal Function Test (RFT)' },
    { name: 'Urine Routine' },
    { name: 'Chest X-Ray PA View' },
    { name: 'ECG' },
    { name: 'USG Abdomen' },
];

// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const medicalService = {
    searchDrugs: async (query) => {
        await delay(300);
        if (!query) return { data: [] };
        const lowerQuery = query.toLowerCase();
        const results = MOCK_DRUGS.filter(d =>
            d.name.toLowerCase().includes(lowerQuery) ||
            d.category.toLowerCase().includes(lowerQuery)
        );
        return { data: results };
    },

    searchInvestigations: async (query) => {
        await delay(300);
        if (!query) return { data: [] };
        const lowerQuery = query.toLowerCase();
        const results = MOCK_INVESTIGATIONS.filter(i =>
            i.name.toLowerCase().includes(lowerQuery)
        );
        return { data: results };
    }
};

export default medicalService;
