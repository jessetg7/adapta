// src/services/templateService.js
import { defaultTemplates } from '../data/defaultTemplates';

// Mock delay to simulate network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const templateService = {
    /**
     * Fetch all templates, optionally filtered by category or specialty
     */
    getTemplates: async (params = {}) => {
        await delay(500);
        let templates = Object.values(defaultTemplates);

        if (params.category) {
            templates = templates.filter(t => t.category === params.category);
        }

        // Return wrapped response like axios
        return { data: templates };
    },

    /**
     * Fetch templates specifically for a department
     */
    getDepartmentTemplates: async (specialty) => {
        await delay(500);
        // For demo, just return relevant templates or all if none specific
        const templates = Object.values(defaultTemplates).filter(t =>
            t.category === 'department' && (!specialty || t.specialty === specialty)
        );
        return { data: templates.length > 0 ? templates : Object.values(defaultTemplates) };
    },

    /**
     * Fetch unique specialties for department templates
     */
    getSpecialties: async () => {
        await delay(300);
        return { data: ['General Medicine', 'Cardiology', 'Pediatrics', 'Gynecology', 'Orthopedics'] };
    },

    /**
     * Fetch a single template by ID
     */
    getTemplate: async (id) => {
        await delay(200);
        const template = Object.values(defaultTemplates).find(t => t.id === id);
        if (!template) throw new Error('Template not found');
        return { data: template };
    }
};

export default templateService;
