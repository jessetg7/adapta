// src/services/configService.js
import { DEFAULT_VITALS_CONFIG, MEDICATION_ROUTES, MEDICATION_FREQUENCIES } from '../config/prescriptionConfig';

// Mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const configService = {
    getVitals: async () => {
        await delay(300);
        return { data: DEFAULT_VITALS_CONFIG };
    },

    getMetadata: async () => {
        await delay(300);
        return {
            data: {
                routes: MEDICATION_ROUTES.map(r => r.value),
                frequencies: MEDICATION_FREQUENCIES
            }
        };
    }
};

export default configService;
