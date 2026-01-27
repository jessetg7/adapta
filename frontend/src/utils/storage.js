// src/utils/storage.js
import { defaultTemplates } from '../data/defaultTemplates';
import { defaultRules } from '../data/defaultRules';
import { samplePatients } from '../data/samplePatients';

/**
 * Initialize default data in localStorage if not present
 */
export const initializeDefaultData = () => {
  // Check if already initialized
  const initialized = localStorage.getItem('adapta-initialized');
  if (initialized) return;

  // Initialize templates
  const existingTemplates = localStorage.getItem('adapta-templates');
  if (!existingTemplates) {
    const templateData = { state: { templates: {}, prescriptionTemplates: {}, activeTemplateId: null }, version: 0 };
    Object.values(defaultTemplates).forEach((template) => {
      templateData.state.templates[template.id] = template;
    });
    localStorage.setItem('adapta-templates', JSON.stringify(templateData));
  }

  // Initialize rules
  const existingRules = localStorage.getItem('adapta-rules');
  if (!existingRules) {
    const ruleData = { state: { rules: {} }, version: 0 };
    Object.values(defaultRules).forEach((rule) => {
      ruleData.state.rules[rule.id] = rule;
    });
    localStorage.setItem('adapta-rules', JSON.stringify(ruleData));
  }

  // Initialize patients
  const existingPatients = localStorage.getItem('adapta-patients');
  if (!existingPatients) {
    const patientData = {
      state: { patients: {}, visits: {}, prescriptions: {}, activePatientId: null, activeVisitId: null },
      version: 0,
    };
    samplePatients.forEach((patient) => {
      patientData.state.patients[patient.id] = patient;
    });
    localStorage.setItem('adapta-patients', JSON.stringify(patientData));
  }

  // Mark as initialized
  localStorage.setItem('adapta-initialized', 'true');
};

/**
 * Clear all ADAPTA data
 */
export const clearAllData = () => {
  localStorage.removeItem('adapta-templates');
  localStorage.removeItem('adapta-patients');
  localStorage.removeItem('adapta-rules');
  localStorage.removeItem('adapta-workflows');
  localStorage.removeItem('adapta-initialized');
};

/**
 * Export all data
 */
export const exportAllData = () => {
  return {
    templates: localStorage.getItem('adapta-templates'),
    patients: localStorage.getItem('adapta-patients'),
    rules: localStorage.getItem('adapta-rules'),
    workflows: localStorage.getItem('adapta-workflows'),
  };
};

/**
 * Import all data
 */
export const importAllData = (data) => {
  if (data.templates) localStorage.setItem('adapta-templates', data.templates);
  if (data.patients) localStorage.setItem('adapta-patients', data.patients);
  if (data.rules) localStorage.setItem('adapta-rules', data.rules);
  if (data.workflows) localStorage.setItem('adapta-workflows', data.workflows);
};

export default { initializeDefaultData, clearAllData, exportAllData, importAllData };