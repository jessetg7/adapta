// src/data/fertilityTemplate.js

export const fertilityTemplate = {
    id: 'template-fertility',
    name: 'Initial Fertility Assessment',
    type: 'consultation',
    category: 'department',
    specialty: 'Fertility',
    genderSpecific: 'all', // Dual patient context
    visitType: 'first',
    version: 1,
    sections: [
        // --- PATIENT IDENTIFICATION ---
        {
            id: 'section-demographics',
            title: 'Patient Identification',
            order: 0,
            columns: 3,
            fields: [
                { id: 'occupation', type: 'text', label: 'Occupation', width: '33%' },
                { id: 'referredBy', type: 'text', label: 'Referred by', width: '33%' },
                { id: 'visitDate', type: 'date', label: 'Visit Date', width: '33%', defaultValue: new Date().toISOString() },
            ]
        },

        // --- FEMALE INFORMATION ---
        {
            id: 'section-female-info',
            title: 'FEMALE INFORMATION',
            order: 1,
            columns: 4,
            fields: [
                { id: 'femaleHeight', type: 'number', label: 'Height (cm)', width: '25%', config: { min: 100, max: 250, unit: 'cm' } },
                { id: 'femaleWeight', type: 'number', label: 'Weight (kg)', width: '25%', config: { min: 30, max: 200, unit: 'kg' } },
                { id: 'femaleBMI', type: 'number', label: 'BMI', width: '25%', config: { unit: 'kg/m2', readOnly: true } }, // Should ideally strictly calculate
                { id: 'femaleBP', type: 'text', label: 'BP (mm/Hg)', width: '25%' },
                { id: 'femalePR', type: 'number', label: 'PR (bpm)', width: '25%' },
                { id: 'yearsMarried', type: 'number', label: 'Married (years)', width: '25%' },
                { id: 'subfertilityYears', type: 'number', label: 'Subfertility (years)', width: '25%' },
            ]
        },

        // --- MENSTRUAL HISTORY ---
        {
            id: 'section-menstrual',
            title: 'Menstrual History',
            order: 2,
            columns: 3,
            fields: [
                { id: 'lmp', type: 'date', label: 'LMP', width: '33%', required: true },
                { id: 'cycleLength', type: 'number', label: 'Cycle Length (days)', width: '33%' },
                {
                    id: 'cyclePattern',
                    type: 'dropdown',
                    label: 'Cycle Pattern',
                    width: '33%',
                    options: [
                        { value: 'regular', label: 'Regular' },
                        { value: 'irregular', label: 'Irregular' },
                        { value: 'amenorrhea', label: 'Amenorrhea' }
                    ]
                },
                {
                    id: 'painInPeriods',
                    type: 'dropdown',
                    label: 'Pain in Periods',
                    width: '33%',
                    options: [
                        { value: 'none', label: 'None' },
                        { value: 'mild', label: 'Mild' },
                        { value: 'moderate', label: 'Moderate' },
                        { value: 'severe', label: 'Severe' }
                    ]
                },
                { id: 'needWithdrawal', type: 'toggle', label: 'Need Withdrawal Bleeding?', width: '33%' }
            ]
        },

        // --- OBSTETRIC HISTORY ---
        {
            id: 'section-obstetric-summary',
            title: 'OBSTETRIC HISTORY',
            order: 3,
            columns: 5,
            fields: [
                { id: 'gravida', type: 'number', label: 'G (Gravida)', width: '20%' },
                { id: 'para', type: 'number', label: 'P (Para)', width: '20%' },
                { id: 'abortions', type: 'number', label: 'A (Abortions)', width: '20%' },
                { id: 'living', type: 'number', label: 'L (Living)', width: '20%' },
                { id: 'ectopic', type: 'number', label: 'E (Ectopic)', width: '20%' },
            ]
        },
        {
            id: 'section-obstetric-detailed',
            title: 'Detailed Obstetric History',
            order: 4,
            fields: [
                {
                    id: 'detailedObstetricHistory',
                    type: 'table',
                    label: 'History Table',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'outcome', header: 'G Outcome', type: 'text', width: '15%' },
                            {
                                id: 'conception',
                                header: 'Mode of Conception',
                                type: 'dropdown',
                                width: '15%',
                                options: [
                                    { value: 'natural', label: 'Natural' },
                                    { value: 'iui', label: 'IUI' },
                                    { value: 'ivf', label: 'IVF' }
                                ]
                            },
                            { id: 'weeks', header: 'Weeks', type: 'number', width: '10%' },
                            {
                                id: 'delivery',
                                header: 'Mode of Delivery',
                                type: 'dropdown',
                                width: '15%',
                                options: [
                                    { value: 'normal', label: 'Normal' },
                                    { value: 'lscs', label: 'LSCS' },
                                    { value: 'instrumental', label: 'Instrumental' }
                                ]
                            },
                            { id: 'babyOutcome', header: 'Baby Outcome', type: 'text', width: '15%' },
                            { id: 'complications', header: 'Complications', type: 'text', width: '15%' },
                            { id: 'comments', header: 'Comments', type: 'text', width: '15%' },
                        ]
                    }
                }
            ]
        },

        // --- FERTILITY HISTORY ---
        {
            id: 'section-fertility-history',
            title: 'FERTILITY HISTORY',
            order: 5,
            columns: 3,
            fields: [
                {
                    id: 'infertilityType',
                    type: 'dropdown',
                    label: 'Type of Infertility',
                    width: '33%',
                    options: [
                        { value: 'primary', label: 'Primary' },
                        { value: 'secondary', label: 'Secondary' }
                    ]
                },
                { id: 'infertilityYears', type: 'number', label: 'Duration (Years)', width: '33%' },
                { id: 'infertilityMonths', type: 'number', label: 'Months', width: '33%' },
            ]
        },
        {
            id: 'section-chief-complaints',
            title: 'CHIEF COMPLAINTS',
            order: 6,
            fields: [
                { id: 'chiefComplaint', type: 'textarea', label: 'Chief Complaints', width: 'full', config: { rows: 3 } }
            ]
        },

        // --- PREVIOUS TREATMENTS ---
        {
            id: 'section-treatments',
            title: 'PREVIOUS FERTILITY TREATMENTS',
            order: 7,
            fields: [
                {
                    id: 'ovulationInduction',
                    type: 'table',
                    label: 'a) Ovulation Induction',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '20%' },
                            { id: 'drug', header: 'Drug Used', type: 'text', width: '30%' },
                            { id: 'etTrigger', header: 'ET a Trigger', type: 'text', width: '25%' },
                            { id: 'outcome', header: 'Outcome', type: 'text', width: '25%' },
                        ]
                    }
                },
                {
                    id: 'iuiHistory',
                    type: 'table',
                    label: 'b) Intrauterine Insemination (IUI)',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '20%' },
                            { id: 'drug', header: 'Drug Used', type: 'text', width: '30%' },
                            { id: 'etTrigger', header: 'ET a Trigger', type: 'text', width: '25%' },
                            { id: 'outcome', header: 'Outcome', type: 'text', width: '25%' },
                        ]
                    }
                },
                {
                    id: 'ivfHistory',
                    type: 'table',
                    label: 'c) In Vitro Fertilization (IVF)',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '15%' },
                            { id: 'center', header: 'Center', type: 'text', width: '25%' },
                            { id: 'protocol', header: 'Protocol', type: 'text', width: '20%' },
                            { id: 'eggs', header: 'No. of Eggs/Embryos', type: 'text', width: '20%' },
                            { id: 'outcome', header: 'Outcome/Comments', type: 'text', width: '20%' },
                        ]
                    }
                }
            ]
        },

        // --- FEMALE MEDICAL/SURGICAL ---
        {
            id: 'section-female-history',
            title: 'Female Medical & Surgical History',
            order: 8,
            fields: [
                {
                    id: 'femaleMedicalHistory',
                    type: 'table',
                    label: 'Female Medical History',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'condition', header: 'Conditions', type: 'text', width: '40%' },
                            { id: 'duration', header: 'Duration', type: 'text', width: '30%' },
                            { id: 'treatment', header: 'Treatment', type: 'text', width: '30%' },
                        ]
                    }
                },
                {
                    id: 'femaleSurgicalHistory',
                    type: 'table',
                    label: 'Female Surgical History',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '20%' },
                            { id: 'surgery', header: 'Surgery', type: 'text', width: '40%' },
                            { id: 'notes', header: 'Notes/Findings', type: 'text', width: '40%' },
                        ]
                    }
                }
            ]
        },

        // --- MALE INFORMATION ---
        {
            id: 'section-male-info',
            title: 'MALE INFORMATION',
            order: 9,
            columns: 4,
            fields: [
                { id: 'maleHeight', type: 'number', label: 'Height (cm)', width: '25%' },
                { id: 'maleWeight', type: 'number', label: 'Weight (kg)', width: '25%' },
                { id: 'maleBMI', type: 'number', label: 'BMI', width: '25%' },
                { id: 'maleBP', type: 'text', label: 'BP (mm/Hg)', width: '25%' },
                { id: 'malePR', type: 'number', label: 'PR (bpm)', width: '25%' },
                { id: 'sexualDysfunction', type: 'toggle', label: 'Sexual Dysfunction', width: '25%' },
                { id: 'erectileProblem', type: 'toggle', label: 'Erectile Problem', width: '25%' },
                { id: 'ejaculateProblem', type: 'toggle', label: 'Ejaculate Problem', width: '25%' },
                { id: 'maleOthers', type: 'text', label: 'Others', width: 'full' },
            ]
        },
        {
            id: 'section-male-history',
            title: 'Male History & Semen Analysis',
            order: 10,
            fields: [
                {
                    id: 'maleMedicalHistory',
                    type: 'table',
                    label: 'Male Medical History',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'condition', header: 'Conditions', type: 'text', width: '40%' },
                            { id: 'duration', header: 'Duration', type: 'text', width: '30%' },
                            { id: 'treatment', header: 'Treatment', type: 'text', width: '30%' },
                        ]
                    }
                },
                {
                    id: 'maleSurgicalHistory',
                    type: 'table',
                    label: 'Male Surgical History',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '20%' },
                            { id: 'surgery', header: 'Surgery', type: 'text', width: '40%' },
                            { id: 'notes', header: 'Notes/Findings', type: 'text', width: '40%' },
                        ]
                    }
                },
                {
                    id: 'semenAnalysis',
                    type: 'table',
                    label: 'PREVIOUS SEMEN ANALYSIS',
                    width: 'full',
                    config: {
                        columns: [
                            { id: 'year', header: 'Year', type: 'number', width: '15%' },
                            { id: 'center', header: 'Center', type: 'text', width: '25%' },
                            { id: 'volume', header: 'Volume (ml)', type: 'number', width: '15%' },
                            { id: 'concentration', header: 'Concentration (mill/ml)', type: 'number', width: '15%' },
                            { id: 'motility', header: 'Prog. Motility (%)', type: 'number', width: '15%' },
                            { id: 'morphology', header: 'Morphology (%)', type: 'number', width: '15%' },
                        ]
                    }
                }
            ]
        },

        // --- BASIC MEDICATIONS ---
        {
            id: 'section-basic-meds',
            title: 'BASIC MEDICATIONS',
            order: 11,
            fields: [
                {
                    id: 'basicMedications',
                    type: 'table',
                    label: 'Basic Medications',
                    width: 'full',
                    config: {
                        columns: [
                            {
                                id: 'patient',
                                header: 'Patient',
                                type: 'dropdown',
                                width: '15%',
                                options: [{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]
                            },
                            { id: 'brand', header: 'Brand', type: 'text', width: '20%' },
                            { id: 'generic', header: 'Generic', type: 'text', width: '20%' },
                            { id: 'dose', header: 'Dose', type: 'text', width: '15%' },
                            { id: 'frequency', header: 'Frequency', type: 'text', width: '15%' },
                            { id: 'duration', header: 'Duration', type: 'text', width: '15%' },
                        ]
                    }
                }
            ]
        },

        // --- INVESTIGATIONS CHECKLIST ---
        {
            id: 'section-investigations-checklist',
            title: 'RECOMMENDED BASIC INVESTIGATIONS',
            order: 12,
            fields: [
                {
                    id: 'investigationsChecklist',
                    type: 'table',
                    label: 'Investigations Checklist',
                    width: 'full',
                    defaultValue: [
                        { id: '1', investigation: 'CBC', female: false, male: false },
                        { id: '2', investigation: 'Blood Group', female: false, male: false },
                        { id: '3', investigation: 'TSH', female: false, male: false },
                        { id: '4', investigation: 'SFT3 / FT4', female: false, male: false },
                        { id: '5', investigation: 'PROLACTIN', female: false, male: false },
                        { id: '6', investigation: 'AMH', female: false, male: false },
                        { id: '7', investigation: 'HIV, HBsAg, Anti-HCV, VDRL', female: false, male: false },
                        { id: '8', investigation: 'Urea / Creatinine', female: false, male: false },
                        { id: '9', investigation: 'RBS, HbA1c', female: false, male: false },
                        { id: '10', investigation: 'SemenTest', female: false, male: true },
                        { id: '11', investigation: 'Karyotype if necessary', female: false, male: false },
                        { id: '12', investigation: 'DFI if necessary', female: false, male: false },
                    ],
                    config: {
                        allowAddRow: true, // Allow custom ones
                        columns: [
                            { id: 'investigation', header: 'Investigation', type: 'text', width: '60%' },
                            {
                                id: 'female',
                                header: 'Female',
                                type: 'dropdown',
                                width: '20%',
                                options: [{ value: 'yes', label: '✅' }, { value: 'no', label: '❌' }]
                            },
                            {
                                id: 'male',
                                header: 'Male',
                                type: 'dropdown',
                                width: '20%',
                                options: [{ value: 'yes', label: '✅' }, { value: 'no', label: '❌' }]
                            },
                        ]
                    }
                }
            ]
        },

        // --- ADVICE & FOLLOW UP ---
        {
            id: 'section-advice',
            title: 'Advice',
            order: 13,
            fields: [
                { id: 'advice', type: 'textarea', label: 'ADVICE:', width: 'full', config: { rows: 4 } },
                { id: 'nextAppointment', type: 'date', label: 'Next Appointment', width: 'half' },
            ]
        }
    ],
    metadata: {
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSystem: true,
        isActive: true,
    }
};
