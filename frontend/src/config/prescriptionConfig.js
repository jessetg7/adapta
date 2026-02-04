// src/config/prescriptionConfig.js

export const MEDICATION_ROUTES = [
    { label: 'Oral', value: 'oral' },
    { label: 'IV', value: 'iv' },
    { label: 'IM', value: 'im' },
    { label: 'SC', value: 'sc' },
    { label: 'Topical', value: 'topical' },
    { label: 'Inhalation', value: 'inhalation' },
    { label: 'Nasal', value: 'nasal' },
    { label: 'Ophthalmic', value: 'ophthalmic' },
    { label: 'Otic', value: 'otic' },
];

export const MEDICATION_FREQUENCIES = [
    { label: 'OD (Once Daily)', value: 'OD' },
    { label: 'BD (Twice Daily)', value: 'BD' },
    { label: 'TDS (Thrice Daily)', value: 'TDS' },
    { label: 'QID (Four Times Daily)', value: 'QID' },
    { label: 'PRN (As Needed)', value: 'PRN' },
    { label: 'STAT (Immediately)', value: 'STAT' },
    { label: 'HS (At Bedtime)', value: 'HS' },
    { label: 'SOS (In Emergency)', value: 'SOS' },
];

export const DEFAULT_VITALS_CONFIG = [
    { id: 'temperature', label: 'Temperature', unit: '°C' },
    { id: 'bloodPressureSystolic', label: 'BP Systolic', unit: 'mmHg' },
    { id: 'bloodPressureDiastolic', label: 'BP Diastolic', unit: 'mmHg' },
    { id: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
    { id: 'respiratoryRate', label: 'Resp. Rate', unit: '/min' },
    { id: 'oxygenSaturation', label: 'SpO2', unit: '%' },
    { id: 'weight', label: 'Weight', unit: 'kg' },
    { id: 'height', label: 'Height', unit: 'cm' },
];

export const PAGE_SIZES = [
    { label: 'A4', value: 'A4' },
    { label: 'A5', value: 'A5' },
    { label: 'Letter', value: 'Letter' },
];

export const FONT_FAMILIES = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '\"Times New Roman\", serif' },
    { label: 'Courier New', value: '\"Courier New\", monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
];
