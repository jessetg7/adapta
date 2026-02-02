
export const semenAnalysisTemplate = {
    id: 'template-semen-analysis',
    name: 'Semen Analysis',
    type: 'investigation',
    category: 'department',
    specialty: 'Andrology',
    visitType: 'investigation',
    version: 1,
    sections: [
        // --- PARTNER DETAILS ---
        {
            id: 'section-partners',
            title: 'Partner Details',
            order: 0,
            columns: 2,
            fields: [
                { id: 'malePartnerName', type: 'text', label: 'Male Partner Name', width: '50%' },
                { id: 'femalePartnerName', type: 'text', label: 'Female Partner Name', width: '50%' },
                { id: 'malePartnerAge', type: 'number', label: 'Male Age', width: '50%' },
                { id: 'femalePartnerAge', type: 'number', label: 'Female Age', width: '50%' },
                { id: 'malePartnerID', type: 'text', label: 'Male Patient ID', width: '50%' },
                { id: 'femalePartnerID', type: 'text', label: 'Female Patient ID', width: '50%' },
            ]
        },
        // --- GENERAL INFORMATION ---
        {
            id: 'section-general-info',
            title: 'General Information',
            order: 1,
            columns: 2,
            fields: [
                {
                    id: 'collectionType',
                    type: 'dropdown',
                    label: 'Sample Collection Type',
                    width: '50%',
                    options: [{ value: 'center', label: 'Center' }, { value: 'home', label: 'Home' }]
                },
                { id: 'examTime', type: 'time', label: 'Time of Examination', width: '50%' },
                {
                    id: 'modeOfCollection',
                    type: 'dropdown',
                    label: 'Mode of Collection',
                    width: '50%',
                    options: [{ value: 'ejaculate', label: 'Masturbation / Ejaculate' }]
                },
                { id: 'abstinencePeriod', type: 'text', label: 'Abstinence Period (Days)', width: '50%' },
                { id: 'collectionTime', type: 'time', label: 'Time of Collection', width: '50%' },
                {
                    id: 'completeCollection',
                    type: 'dropdown',
                    label: 'Complete Collection',
                    width: '50%',
                    options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
                },
            ]
        },
        // --- MACROSCOPIC EXAMINATION ---
        {
            id: 'section-macroscopic',
            title: 'MACROSCOPIC EXAMINATION',
            order: 2,
            columns: 2,
            fields: [
                { id: 'volume', type: 'text', label: 'Volume (ml)', width: '50%' },
                { id: 'ph', type: 'number', label: 'pH', width: '50%' },
                { id: 'appearance', type: 'text', label: 'Appearance', width: '50%' },
                { id: 'liquefactionTime', type: 'text', label: 'Time of Liquefaction (Mins)', width: '50%' },
                { id: 'viscosity', type: 'text', label: 'Viscosity', width: '50%' },
            ]
        },
        // --- MICROSCOPIC EXAMINATION ---
        {
            id: 'section-microscopic',
            title: 'MICROSCOPIC EXAMINATION',
            order: 3,
            columns: 2,
            fields: [
                { id: 'spermConcentration', type: 'text', label: 'Sperm Concentration (millions/ml)', width: '50%' },
                { id: 'totalMotile', type: 'text', label: 'Total Motile Progressive (TMSC)', width: '50%' },
                { id: 'totalSpermCount', type: 'text', label: 'Total Sperm Number (per ejaculate)', width: '50%' },
                { id: 'vitality', type: 'text', label: 'Vitality (%)', width: '50%' },
                { id: 'rapidMotility', type: 'text', label: 'Rapid Progressive Motility (a)', width: '50%' },
                { id: 'agglutination', type: 'text', label: 'Agglutination', width: '50%' },
                { id: 'slowMotility', type: 'text', label: 'Slow Progressive Motility (b)', width: '50%' },
                { id: 'roundCells', type: 'text', label: 'Round Cells / HPF', width: '50%' },
                { id: 'nonProgressive', type: 'text', label: 'Non-Progressive Motility (c)', width: '50%' },
                { id: 'otherCells', type: 'text', label: 'Other Cells / Debris', width: '50%' },
                { id: 'immotileSperm', type: 'text', label: 'Immotile Sperm', width: '50%' },
            ]
        },
        // --- MORPHOLOGY ---
        {
            id: 'section-morphology',
            title: 'MORPHOLOGY',
            order: 4,
            columns: 2,
            fields: [
                { id: 'normalForms', type: 'text', label: 'Normal Forms (%)', width: '50%' },
                { id: 'midpieceAbnormalities', type: 'text', label: 'Midpiece Abnormalities (%)', width: '50%' },
                { id: 'abnormalForms', type: 'text', label: 'Abnormal Forms (%)', width: '50%' },
                { id: 'tailAbnormalities', type: 'text', label: 'Tail Abnormalities (%)', width: '50%' },
                { id: 'headAbnormalities', type: 'text', label: 'Head Abnormalities (%)', width: '50%' },
                { id: 'cytoplasmicDroplets', type: 'text', label: 'Cytoplasmic Droplets (%)', width: '50%' },
            ]
        },
        // --- IMPRESSION / NOTES ---
        {
            id: 'section-impression',
            title: 'Impression',
            order: 5,
            fields: [
                { id: 'impression', type: 'textarea', label: 'Impression / Comments', width: 'full', config: { rows: 3 } }
            ]
        }
    ],
    metadata: {
        isSystem: true,
        version: '1.0'
    }
};
