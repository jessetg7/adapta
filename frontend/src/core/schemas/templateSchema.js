// src/core/schemas/templateSchema.js
/**
 * Template Schema Definitions
 */

/**
 * Section schema
 */
export const sectionSchema = {
  id: '',
  title: 'New Section',
  description: '',
  collapsible: true,
  defaultCollapsed: false,
  columns: 2, // 1, 2, 3, or 4
  fields: [],
  visibilityRules: [],
  order: 0,
  icon: null,
  color: null,
};

/**
 * Template metadata schema
 */
export const templateMetadataSchema = {
  author: 'user',
  createdAt: '',
  updatedAt: '',
  description: '',
  tags: [],
  isSystem: false,
  isActive: true,
  usageCount: 0,
};

/**
 * Template schema
 */
export const templateSchema = {
  id: '',
  name: '',
  type: 'custom', // 'patientIntake', 'consultation', 'prescription', etc.
  category: 'general', // Department/category
  version: 1,
  department: null,
  genderSpecific: 'all', // 'all', 'male', 'female', 'pediatric'
  ageRange: null, // { min: number, max: number }
  visitType: 'all', // 'all', 'first', 'followUp', 'emergency'
  sections: [],
  visibilityRules: [],
  metadata: { ...templateMetadataSchema },
  printConfig: null,
};

/**
 * Print configuration schema
 */
export const printConfigSchema = {
  pageSize: 'A4', // 'A4', 'A5', 'Letter'
  orientation: 'portrait', // 'portrait', 'landscape'
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  showHeader: true,
  showFooter: true,
  showPageNumbers: true,
  watermark: null,
};

/**
 * Create a new template with defaults
 */
export const createTemplate = (name, type = 'custom', category = 'general', overrides = {}) => {
  const now = new Date().toISOString();
  
  return {
    ...templateSchema,
    id: `template_${Date.now()}`,
    name,
    type,
    category,
    sections: [],
    metadata: {
      ...templateMetadataSchema,
      createdAt: now,
      updatedAt: now,
    },
    ...overrides,
  };
};

/**
 * Create a new section with defaults
 */
export const createSection = (title = 'New Section', overrides = {}) => {
  return {
    ...sectionSchema,
    id: `section_${Date.now()}`,
    title,
    fields: [],
    ...overrides,
  };
};

/**
 * Template types
 */
export const TEMPLATE_TYPES = [
  { value: 'patientIntake', label: 'Patient Intake' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'investigation', label: 'Investigation' },
  { value: 'followUp', label: 'Follow-up' },
  { value: 'discharge', label: 'Discharge' },
  { value: 'labReport', label: 'Lab Report' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Template categories (departments)
 */
export const TEMPLATE_CATEGORIES = [
  { value: 'general', label: 'General', color: '#1976d2' },
  { value: 'gynecology', label: 'Gynecology', color: '#e91e63' },
  { value: 'pediatrics', label: 'Pediatrics', color: '#4caf50' },
  { value: 'fertility', label: 'Fertility', color: '#9c27b0' },
  { value: 'cardiology', label: 'Cardiology', color: '#f44336' },
  { value: 'orthopedics', label: 'Orthopedics', color: '#ff9800' },
  { value: 'dermatology', label: 'Dermatology', color: '#795548' },
  { value: 'neurology', label: 'Neurology', color: '#607d8b' },
  { value: 'emergency', label: 'Emergency', color: '#d32f2f' },
  { value: 'custom', label: 'Custom', color: '#757575' },
];

export default {
  sectionSchema,
  templateMetadataSchema,
  templateSchema,
  printConfigSchema,
  createTemplate,
  createSection,
  TEMPLATE_TYPES,
  TEMPLATE_CATEGORIES,
};