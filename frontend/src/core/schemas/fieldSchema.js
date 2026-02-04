// src/core/schemas/fieldSchema.js
/**
 * Field Schema Definitions
 * These schemas define the structure of fields in the LCNC system
 */

/**
 * Base field schema
 */
export const baseFieldSchema = {
  id: '', // Unique identifier
  type: 'text', // Field type
  name: '', // Field name for data binding
  label: '', // Display label
  required: false, // Is field required
  defaultValue: null, // Default value
  description: '', // Help text / description
  placeholder: '', // Placeholder text
  width: 'full', // Width: 'full', 'half', 'third', 'quarter'
  order: 0, // Display order
  disabled: false, // Is field disabled
  hidden: false, // Is field hidden
  validation: [], // Validation rules array
  visibilityRules: [], // Visibility rules array
  config: {}, // Type-specific configuration
  tags: [], // Tags for categorization
};

/**
 * Validation rule schema
 */
export const validationRuleSchema = {
  type: '', // 'required', 'email', 'phone', 'min', 'max', 'pattern', etc.
  value: null, // Value for the rule (e.g., min value)
  message: '', // Custom error message
};

/**
 * Visibility rule schema
 */
export const visibilityRuleSchema = {
  id: '',
  conditions: {
    id: '',
    operator: 'AND', // 'AND' or 'OR'
    conditions: [], // Array of conditions
  },
  action: 'show', // 'show', 'hide', 'enable', 'disable', 'require', 'optional'
};

/**
 * Condition schema
 */
export const conditionSchema = {
  id: '',
  field: '', // Field path to check
  operator: 'equals', // Comparison operator
  value: null, // Value to compare against
  valueField: null, // Optional: compare against another field
};

/**
 * Field option schema (for dropdowns, radio, etc.)
 */
export const fieldOptionSchema = {
  value: '', // Option value
  label: '', // Display label
  disabled: false, // Is option disabled
  icon: null, // Optional icon
  color: null, // Optional color
};

/**
 * Table column schema
 */
export const tableColumnSchema = {
  id: '',
  header: '', // Column header
  type: 'text', // Column field type
  width: null, // Column width
  options: [], // For dropdown columns
  defaultValue: null,
};

/**
 * Field type specific configs
 */
export const fieldTypeConfigs = {
  text: {
    maxLength: null,
    minLength: null,
    pattern: null,
    prefix: null,
    suffix: null,
  },
  
  number: {
    min: null,
    max: null,
    step: 1,
    unit: null,
    precision: null,
  },
  
  textarea: {
    rows: 4,
    maxLength: null,
    resize: true,
  },
  
  date: {
    format: 'YYYY-MM-DD',
    minDate: null,
    maxDate: null,
    disablePast: false,
    disableFuture: false,
  },
  
  time: {
    format: 'HH:mm',
    minuteStep: 1,
  },
  
  dropdown: {
    options: [],
    searchable: false,
    clearable: true,
    dataSource: null, // For dynamic options
  },
  
  multiselect: {
    options: [],
    maxSelections: null,
    searchable: true,
  },
  
  checkbox: {
    labelPlacement: 'end', // 'start', 'end', 'top', 'bottom'
  },
  
  radio: {
    options: [],
    direction: 'horizontal', // 'horizontal', 'vertical'
  },
  
  table: {
    columns: [],
    minRows: 0,
    maxRows: null,
    allowAddRow: true,
    allowDeleteRow: true,
    allowReorder: false,
  },
  
  vitals: {
    fields: [
      { id: 'temperature', label: 'Temperature', unit: '°C' },
      { id: 'bloodPressureSystolic', label: 'BP Systolic', unit: 'mmHg' },
      { id: 'bloodPressureDiastolic', label: 'BP Diastolic', unit: 'mmHg' },
      { id: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
      { id: 'respiratoryRate', label: 'Resp. Rate', unit: '/min' },
      { id: 'oxygenSaturation', label: 'SpO2', unit: '%' },
      { id: 'weight', label: 'Weight', unit: 'kg' },
      { id: 'height', label: 'Height', unit: 'cm' },
    ],
  },
  
  medications: {
    columns: [
      { id: 'name', header: 'Medicine', type: 'text' },
      { id: 'dose', header: 'Dose', type: 'text' },
      { id: 'route', header: 'Route', type: 'dropdown' },
      { id: 'frequency', header: 'Frequency', type: 'dropdown' },
      { id: 'duration', header: 'Duration', type: 'text' },
      { id: 'instructions', header: 'Instructions', type: 'text' },
    ],
    showAllergyWarnings: true,
    enablePediatricDosing: true,
  },
  
  fileUpload: {
    accept: '*/*',
    maxSize: 10485760, // 10MB
    multiple: false,
    maxFiles: 5,
  },
  
  signature: {
    width: 300,
    height: 150,
    penColor: '#000000',
  },
};

/**
 * Create a new field with defaults
 */
export const createField = (type, overrides = {}) => {
  return {
    ...baseFieldSchema,
    id: `field_${Date.now()}`,
    type,
    name: `field_${Date.now()}`,
    label: 'New Field',
    config: { ...(fieldTypeConfigs[type] || {}) },
    ...overrides,
  };
};

export default {
  baseFieldSchema,
  validationRuleSchema,
  visibilityRuleSchema,
  conditionSchema,
  fieldOptionSchema,
  tableColumnSchema,
  fieldTypeConfigs,
  createField,
};