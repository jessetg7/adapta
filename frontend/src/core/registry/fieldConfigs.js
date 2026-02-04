// src/core/registry/fieldConfigs.js
/**
 * Field Type Configurations - JSON-driven, extensible
 * This is the SINGLE SOURCE OF TRUTH for all field types
 */

export const FIELD_CATEGORIES = {
  BASIC: 'Basic',
  SELECTION: 'Selection',
  DATE_TIME: 'Date & Time',
  MEDICAL: 'Medical',
  ADVANCED: 'Advanced',
  LAYOUT: 'Layout',
};

export const FIELD_TYPES = {
  // Basic Fields
  text: {
    type: 'text',
    label: 'Text Input',
    icon: 'TextFields',
    category: FIELD_CATEGORIES.BASIC,
    defaultConfig: {
      type: 'text',
      label: 'Text Field',
      required: false,
      width: 'full',
      config: {
        placeholder: '',
        maxLength: null,
      },
    },
  },

  number: {
    type: 'number',
    label: 'Number',
    icon: 'Numbers',
    category: FIELD_CATEGORIES.BASIC,
    defaultConfig: {
      type: 'number',
      label: 'Number Field',
      required: false,
      width: 'half',
      config: {
        min: null,
        max: null,
        step: 1,
        unit: '',
      },
    },
  },

  textarea: {
    type: 'textarea',
    label: 'Text Area',
    icon: 'Notes',
    category: FIELD_CATEGORIES.BASIC,
    defaultConfig: {
      type: 'textarea',
      label: 'Text Area',
      required: false,
      width: 'full',
      config: {
        rows: 4,
        maxLength: null,
        placeholder: '',
      },
    },
  },

  email: {
    type: 'email',
    label: 'Email',
    icon: 'Email',
    category: FIELD_CATEGORIES.BASIC,
    defaultConfig: {
      type: 'email',
      label: 'Email Address',
      required: false,
      width: 'half',
      validation: [
        { type: 'email', message: 'Please enter a valid email address' }
      ],
    },
  },

  phone: {
    type: 'phone',
    label: 'Phone',
    icon: 'Phone',
    category: FIELD_CATEGORIES.BASIC,
    defaultConfig: {
      type: 'phone',
      label: 'Phone Number',
      required: false,
      width: 'half',
      validation: [
        { type: 'phone', message: 'Please enter a valid phone number' }
      ],
    },
  },

  // Selection Fields
  dropdown: {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'ArrowDropDownCircle',
    category: FIELD_CATEGORIES.SELECTION,
    defaultConfig: {
      type: 'dropdown',
      label: 'Dropdown',
      required: false,
      width: 'half',
      options: [],
    },
  },

  multiselect: {
    type: 'multiselect',
    label: 'Multi-Select',
    icon: 'PlaylistAddCheck',
    category: FIELD_CATEGORIES.SELECTION,
    defaultConfig: {
      type: 'multiselect',
      label: 'Multi-Select',
      required: false,
      width: 'full',
      options: [],
    },
  },

  checkbox: {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckBox',
    category: FIELD_CATEGORIES.SELECTION,
    defaultConfig: {
      type: 'checkbox',
      label: 'Checkbox',
      required: false,
      width: 'half',
    },
  },

  radio: {
    type: 'radio',
    label: 'Radio Group',
    icon: 'RadioButtonChecked',
    category: FIELD_CATEGORIES.SELECTION,
    defaultConfig: {
      type: 'radio',
      label: 'Radio Group',
      required: false,
      width: 'full',
      options: [],
    },
  },

  toggle: {
    type: 'toggle',
    label: 'Toggle Switch',
    icon: 'ToggleOn',
    category: FIELD_CATEGORIES.SELECTION,
    defaultConfig: {
      type: 'toggle',
      label: 'Toggle',
      required: false,
      width: 'half',
    },
  },

  // Date & Time Fields
  date: {
    type: 'date',
    label: 'Date Picker',
    icon: 'CalendarMonth',
    category: FIELD_CATEGORIES.DATE_TIME,
    defaultConfig: {
      type: 'date',
      label: 'Date',
      required: false,
      width: 'half',
      config: {
        format: 'YYYY-MM-DD',
      },
    },
  },

  time: {
    type: 'time',
    label: 'Time Picker',
    icon: 'Schedule',
    category: FIELD_CATEGORIES.DATE_TIME,
    defaultConfig: {
      type: 'time',
      label: 'Time',
      required: false,
      width: 'half',
      config: {
        format: 'HH:mm',
      },
    },
  },

  datetime: {
    type: 'datetime',
    label: 'Date & Time',
    icon: 'Event',
    category: FIELD_CATEGORIES.DATE_TIME,
    defaultConfig: {
      type: 'datetime',
      label: 'Date & Time',
      required: false,
      width: 'half',
    },
  },

  // Medical Fields
  vitals: {
    type: 'vitals',
    label: 'Vitals Table',
    icon: 'MonitorHeart',
    category: FIELD_CATEGORIES.MEDICAL,
    defaultConfig: {
      type: 'vitals',
      label: 'Patient Vitals',
      required: false,
      width: 'full',
      config: {
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
    },
  },

  medications: {
    type: 'medications',
    label: 'Medication Grid',
    icon: 'Medication',
    category: FIELD_CATEGORIES.MEDICAL,
    defaultConfig: {
      type: 'medications',
      label: 'Medications',
      required: false,
      width: 'full',
      config: {
        columns: [
          { id: 'name', header: 'Medicine Name', type: 'text', width: '25%' },
          { id: 'dose', header: 'Dose', type: 'text', width: '15%' },
          {
            id: 'route', header: 'Route', type: 'dropdown', width: '15%', options: [
              { label: 'Oral', value: 'oral' },
              { label: 'IV', value: 'iv' },
              { label: 'IM', value: 'im' },
              { label: 'SC', value: 'sc' },
              { label: 'Topical', value: 'topical' },
              { label: 'Inhalation', value: 'inhalation' },
            ]
          },
          {
            id: 'frequency', header: 'Frequency', type: 'dropdown', width: '15%', options: [
              { label: 'Once daily', value: 'OD' },
              { label: 'Twice daily', value: 'BD' },
              { label: 'Thrice daily', value: 'TDS' },
              { label: 'Four times', value: 'QID' },
              { label: 'As needed', value: 'PRN' },
              { label: 'At bedtime', value: 'HS' },
            ]
          },
          { id: 'duration', header: 'Duration', type: 'text', width: '15%' },
          { id: 'instructions', header: 'Instructions', type: 'text', width: '15%' },
        ],
        allowAddRow: true,
        allowDeleteRow: true,
      },
    },
  },

  investigations: {
    type: 'investigations',
    label: 'Investigations',
    icon: 'Science',
    category: FIELD_CATEGORIES.MEDICAL,
    defaultConfig: {
      type: 'investigations',
      label: 'Investigations',
      required: false,
      width: 'full',
      config: {
        columns: [
          { id: 'name', header: 'Investigation', type: 'text', width: '40%' },
          {
            id: 'priority', header: 'Priority', type: 'dropdown', width: '20%', options: [
              { label: 'Routine', value: 'routine' },
              { label: 'Urgent', value: 'urgent' },
              { label: 'STAT', value: 'stat' },
            ]
          },
          { id: 'notes', header: 'Notes', type: 'text', width: '40%' },
        ],
        allowAddRow: true,
        allowDeleteRow: true,
      },
    },
  },

  diagnosis: {
    type: 'diagnosis',
    label: 'Diagnosis',
    icon: 'MedicalServices',
    category: FIELD_CATEGORIES.MEDICAL,
    defaultConfig: {
      type: 'diagnosis',
      label: 'Diagnosis',
      required: false,
      width: 'full',
      config: {
        allowMultiple: true,
        showICD: true,
      },
    },
  },

  allergies: {
    type: 'allergies',
    label: 'Allergies',
    icon: 'Warning',
    category: FIELD_CATEGORIES.MEDICAL,
    defaultConfig: {
      type: 'allergies',
      label: 'Known Allergies',
      required: false,
      width: 'full',
      config: {
        showSeverity: true,
        categories: ['Drug', 'Food', 'Environmental', 'Other'],
      },
    },
  },

  // Advanced Fields
  table: {
    type: 'table',
    label: 'Data Table',
    icon: 'TableChart',
    category: FIELD_CATEGORIES.ADVANCED,
    defaultConfig: {
      type: 'table',
      label: 'Table',
      required: false,
      width: 'full',
      config: {
        columns: [],
        allowAddRow: true,
        allowDeleteRow: true,
        minRows: 1,
        maxRows: 50,
      },
    },
  },

  signature: {
    type: 'signature',
    label: 'Signature',
    icon: 'Draw',
    category: FIELD_CATEGORIES.ADVANCED,
    defaultConfig: {
      type: 'signature',
      label: 'Signature',
      required: false,
      width: 'half',
    },
  },

  fileUpload: {
    type: 'fileUpload',
    label: 'File Upload',
    icon: 'UploadFile',
    category: FIELD_CATEGORIES.ADVANCED,
    defaultConfig: {
      type: 'fileUpload',
      label: 'Upload File',
      required: false,
      width: 'full',
      config: {
        accept: '*/*',
        maxSize: 10485760, // 10MB
        multiple: false,
      },
    },
  },

  calculated: {
    type: 'calculated',
    label: 'Calculated Field',
    icon: 'Calculate',
    category: FIELD_CATEGORIES.ADVANCED,
    defaultConfig: {
      type: 'calculated',
      label: 'Calculated',
      required: false,
      width: 'half',
      config: {
        formula: '',
        precision: 2,
      },
    },
  },

  aiAssistant: {
    type: 'aiAssistant',
    label: 'AI Field Assist',
    icon: 'AutoAwesome',
    category: FIELD_CATEGORIES.ADVANCED,
    description: 'LLM-powered field for real-time clinical suggestion and summarization.',
    defaultConfig: {
      type: 'aiAssistant',
      label: 'AI Insights',
      required: false,
      width: 'full',
      config: {
        prompt: 'Summarize the patient vitals and suggest potential follow-up tests.',
        model: 'gemini-1.5-pro',
        inputFields: ['vitals', 'medicalHistory'],
      },
    },
  },

  // Layout Fields
  sectionHeader: {
    type: 'sectionHeader',
    label: 'Section Header',
    icon: 'Title',
    category: FIELD_CATEGORIES.LAYOUT,
    defaultConfig: {
      type: 'sectionHeader',
      label: 'Section Title',
      required: false,
      width: 'full',
    },
  },

  divider: {
    type: 'divider',
    label: 'Divider',
    icon: 'HorizontalRule',
    category: FIELD_CATEGORIES.LAYOUT,
    defaultConfig: {
      type: 'divider',
      label: '',
      required: false,
      width: 'full',
    },
  },

  spacer: {
    type: 'spacer',
    label: 'Spacer',
    icon: 'SpaceBar',
    category: FIELD_CATEGORIES.LAYOUT,
    defaultConfig: {
      type: 'spacer',
      label: '',
      required: false,
      width: 'full',
      config: {
        height: 24,
      },
    },
  },

  richText: {
    type: 'richText',
    label: 'Rich Text',
    icon: 'FormatQuote',
    category: FIELD_CATEGORIES.LAYOUT,
    defaultConfig: {
      type: 'richText',
      label: 'Information',
      required: false,
      width: 'full',
      config: {
        content: '',
      },
    },
  },
};

// Operator configurations for rule builder
export const OPERATORS = {
  equals: { label: 'Equals', valueRequired: true },
  notEquals: { label: 'Not Equals', valueRequired: true },
  contains: { label: 'Contains', valueRequired: true },
  notContains: { label: 'Not Contains', valueRequired: true },
  greaterThan: { label: 'Greater Than', valueRequired: true, numeric: true },
  lessThan: { label: 'Less Than', valueRequired: true, numeric: true },
  greaterThanOrEqual: { label: 'Greater or Equal', valueRequired: true, numeric: true },
  lessThanOrEqual: { label: 'Less or Equal', valueRequired: true, numeric: true },
  isEmpty: { label: 'Is Empty', valueRequired: false },
  isNotEmpty: { label: 'Is Not Empty', valueRequired: false },
  in: { label: 'Is One Of', valueRequired: true, array: true },
  notIn: { label: 'Is Not One Of', valueRequired: true, array: true },
  between: { label: 'Between', valueRequired: true, range: true },
  startsWith: { label: 'Starts With', valueRequired: true },
  endsWith: { label: 'Ends With', valueRequired: true },
  matches: { label: 'Matches Pattern', valueRequired: true },
};

// Action types for rule builder
export const ACTION_TYPES = {
  show: { label: 'Show Field/Section', icon: 'Visibility' },
  hide: { label: 'Hide Field/Section', icon: 'VisibilityOff' },
  enable: { label: 'Enable Field', icon: 'LockOpen' },
  disable: { label: 'Disable Field', icon: 'Lock' },
  require: { label: 'Make Required', icon: 'Star' },
  optional: { label: 'Make Optional', icon: 'StarBorder' },
  setValue: { label: 'Set Value', icon: 'Edit' },
  clearValue: { label: 'Clear Value', icon: 'Clear' },
  calculate: { label: 'Calculate', icon: 'Calculate' },
  showAlert: { label: 'Show Alert', icon: 'Error' },
  showWarning: { label: 'Show Warning', icon: 'Warning' },
};

// Template types
export const TEMPLATE_TYPES = {
  patientIntake: { label: 'Patient Intake', icon: 'PersonAdd' },
  consultation: { label: 'Consultation', icon: 'LocalHospital' },
  prescription: { label: 'Prescription', icon: 'Medication' },
  investigation: { label: 'Investigation', icon: 'Science' },
  followUp: { label: 'Follow-up', icon: 'Replay' },
  discharge: { label: 'Discharge', icon: 'ExitToApp' },
  labReport: { label: 'Lab Report', icon: 'Biotech' },
  custom: { label: 'Custom', icon: 'Article' },
};

// Template categories (departments)
export const TEMPLATE_CATEGORIES = {
  general: { label: 'General', color: '#1976d2' },
  gynecology: { label: 'Gynecology', color: '#e91e63' },
  pediatrics: { label: 'Pediatrics', color: '#4caf50' },
  fertility: { label: 'Fertility', color: '#9c27b0' },
  cardiology: { label: 'Cardiology', color: '#f44336' },
  orthopedics: { label: 'Orthopedics', color: '#ff9800' },
  dermatology: { label: 'Dermatology', color: '#795548' },
  neurology: { label: 'Neurology', color: '#607d8b' },
  ophthalmology: { label: 'Ophthalmology', color: '#00bcd4' },
  ent: { label: 'ENT', color: '#8bc34a' },
  dental: { label: 'Dental', color: '#03a9f4' },
  emergency: { label: 'Emergency', color: '#d32f2f' },
  custom: { label: 'Custom', color: '#757575' },
};

// Gender options
export const GENDER_OPTIONS = {
  all: { label: 'All Genders', icon: 'People' },
  male: { label: 'Male Only', icon: 'Male' },
  female: { label: 'Female Only', icon: 'Female' },
  pediatric: { label: 'Pediatric', icon: 'ChildCare' },
};

// Visit types
export const VISIT_TYPES = {
  all: { label: 'All Visits' },
  first: { label: 'First Visit' },
  followUp: { label: 'Follow-up' },
  emergency: { label: 'Emergency' },
};

// Width options for fields
export const WIDTH_OPTIONS = [
  { value: 'full', label: 'Full Width (100%)' },
  { value: 'half', label: 'Half Width (50%)' },
  { value: 'third', label: 'One Third (33%)' },
  { value: 'quarter', label: 'One Quarter (25%)' },
];

export default FIELD_TYPES;