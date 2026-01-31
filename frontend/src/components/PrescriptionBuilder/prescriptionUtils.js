// src/components/PrescriptionBuilder/prescriptionUtils.js

/**
 * Common formatting for prescription dates
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Common formatting for vitals
 */
export const formatVitals = (vitals) => {
    const items = [];
    if (vitals?.temperature) items.push(`Temp: ${vitals.temperature}°C`);
    if (vitals?.bloodPressureSystolic && vitals?.bloodPressureDiastolic) {
        items.push(`BP: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`);
    }
    if (vitals?.heartRate) items.push(`HR: ${vitals.heartRate} bpm`);
    if (vitals?.weight) items.push(`Weight: ${vitals.weight} kg`);
    if (vitals?.height) items.push(`Height: ${vitals.height} cm`);
    if (vitals?.oxygenSaturation) items.push(`SpO2: ${vitals.oxygenSaturation}%`);
    return items;
};

/**
 * Common logic to determine if a section should be rendered based on data
 */
export const shouldRenderSection = (section, data) => {
    if (!section.enabled) return false;

    switch (section.type) {
        case 'vitals':
            return Object.keys(data?.vitals || {}).length > 0;
        case 'diagnosis':
            return !!data?.diagnosis && (Array.isArray(data.diagnosis) ? data.diagnosis.length > 0 : true);
        case 'medications':
            return Array.isArray(data?.medications) && data.medications.length > 0;
        case 'investigations':
            return Array.isArray(data?.investigations) && data.investigations.length > 0;
        case 'advice':
            return !!data?.advice && (Array.isArray(data.advice) ? data.advice.length > 0 : true);
        case 'follow-up':
            return !!data?.followUp || !!data?.followUpDate;
        case 'table':
            return Array.isArray(data?.[section.id]) && data[section.id].length > 0;
        default:
            return true; // Header, Patient Info, Signature usually always show if enabled
    }
};
