// src/utils/initializeStarterTemplates.js
/**
 * Utility to initialize starter templates in the template store
 * This can be called on first app load or manually from Template Manager
 */

import { STARTER_TEMPLATES_ARRAY } from '../core/data/starterTemplates';

/**
 * Initialize starter templates in the store
 * @param {Function} addTemplate - Function from useTemplateStore to add templates
 * @param {Object} existingTemplates - Current templates in the store
 * @param {boolean} force - Force reload even if templates exist
 * @returns {number} Number of templates added
 */
export const initializeStarterTemplates = (addTemplate, existingTemplates = {}, force = false) => {
    let addedCount = 0;

    STARTER_TEMPLATES_ARRAY.forEach((template) => {
        // Check if template already exists
        const exists = Object.values(existingTemplates).some(
            (t) => t.id === template.id || (t.isStarter && t.name === template.name)
        );

        if (!exists || force) {
            try {
                addTemplate(template);
                addedCount++;
                console.log(`✅ Added starter template: ${template.name}`);
            } catch (error) {
                console.error(`❌ Failed to add template: ${template.name}`, error);
            }
        } else {
            console.log(`⏭️ Skipped existing template: ${template.name}`);
        }
    });

    return addedCount;
};

/**
 * Get list of available starter templates
 * @returns {Array} Array of starter template objects
 */
export const getStarterTemplates = () => {
    return STARTER_TEMPLATES_ARRAY;
};

/**
 * Get a specific starter template by ID
 * @param {string} templateId - Template ID
 * @returns {Object|null} Template object or null if not found
 */
export const getStarterTemplateById = (templateId) => {
    return STARTER_TEMPLATES_ARRAY.find((t) => t.id === templateId) || null;
};

/**
 * Get starter templates by category
 * @param {string} category - Template category
 * @returns {Array} Array of templates in the category
 */
export const getStarterTemplatesByCategory = (category) => {
    return STARTER_TEMPLATES_ARRAY.filter((t) => t.category === category);
};

/**
 * Get starter templates by type
 * @param {string} type - Template type
 * @returns {Array} Array of templates of the type
 */
export const getStarterTemplatesByType = (type) => {
    return STARTER_TEMPLATES_ARRAY.filter((t) => t.type === type);
};

/**
 * Check if starter templates are already loaded
 * @param {Object} existingTemplates - Current templates in the store
 * @returns {boolean} True if at least one starter template exists
 */
export const hasStarterTemplates = (existingTemplates = {}) => {
    return Object.values(existingTemplates).some((t) => t.isStarter === true);
};

/**
 * Get statistics about starter templates
 * @returns {Object} Statistics object
 */
export const getStarterTemplateStats = () => {
    const stats = {
        totalTemplates: STARTER_TEMPLATES_ARRAY.length,
        byCategory: {},
        byType: {},
        totalSections: 0,
        totalFields: 0,
    };

    STARTER_TEMPLATES_ARRAY.forEach((template) => {
        // Count by category
        stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;

        // Count by type
        stats.byType[template.type] = (stats.byType[template.type] || 0) + 1;

        // Count sections and fields
        stats.totalSections += template.sections?.length || 0;
        template.sections?.forEach((section) => {
            stats.totalFields += section.fields?.length || 0;
        });
    });

    return stats;
};

export default {
    initializeStarterTemplates,
    getStarterTemplates,
    getStarterTemplateById,
    getStarterTemplatesByCategory,
    getStarterTemplatesByType,
    hasStarterTemplates,
    getStarterTemplateStats,
};
