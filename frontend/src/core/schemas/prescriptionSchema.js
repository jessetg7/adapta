// src/core/schemas/prescriptionSchema.js
/**
 * Prescription Schema Definitions
 */

/**
 * Medication schema
 */
export const medicationSchema = {
  id: '',
  name: '',
  genericName: '',
  dose: '',
  route: 'oral',
  frequency: 'OD',
  duration: '',
  timing: '', // Before food, after food, etc.
  instructions: '',
  quantity: null,
  refills: 0,
  startDate: null,
  endDate: null,
};

/**
 * Prescription section schema
 */
export const prescriptionSectionSchema = {
  id: '',
  type: 'custom', // 'header', 'patient-info', 'diagnosis', 'medications', etc.
  title: '',
  enabled: true,
  order: 0,
  content: null,
  styling: {},
};

/**
 * Clinic info schema
 */
export const clinicInfoSchema = {
  name: '',
  logo: null,
  address: '',
  phone: '',
  email: '',
  website: '',
  registrationNumber: '',
  tagline: '',
};

/**
 * Prescription styling schema
 */
export const prescriptionStylingSchema = {
  primaryColor: '#1976d2',
  secondaryColor: '#666666',
  fontFamily: 'Arial, sans-serif',
  headerFontSize: '18pt',
  bodyFontSize: '12pt',
  lineHeight: '1.5',
};

/**
 * Prescription template schema
 */
export const prescriptionTemplateSchema = {
  id: '',
  name: '',
  sections: [],
  clinicInfo: { ...clinicInfoSchema },
  pageSize: 'A4',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  styling: { ...prescriptionStylingSchema },
  metadata: {
    author: 'user',
    createdAt: '',
    updatedAt: '',
  },
};

/**
 * Prescription data schema
 */
export const prescriptionDataSchema = {
  id: '',
  templateId: null,
  patientId: '',
  doctorId: '',
  visitId: '',
  date: '',
  diagnosis: [],
  medications: [],
  investigations: [],
  advice: [],
  followUpDate: null,
  notes: '',
  vitals: {},
  createdAt: '',
  updatedAt: '',
};

/**
 * Default prescription sections
 */
export const DEFAULT_PRESCRIPTION_SECTIONS = [
  { id: 'header', type: 'header', title: 'Clinic Header', enabled: true, order: 0 },
  { id: 'patient-info', type: 'patient-info', title: 'Patient Information', enabled: true, order: 1 },
  { id: 'vitals', type: 'vitals', title: 'Vitals', enabled: true, order: 2 },
  { id: 'diagnosis', type: 'diagnosis', title: 'Diagnosis', enabled: true, order: 3 },
  { id: 'medications', type: 'medications', title: 'Medications', enabled: true, order: 4 },
  { id: 'investigations', type: 'investigations', title: 'Investigations', enabled: false, order: 5 },
  { id: 'advice', type: 'advice', title: 'Advice', enabled: true, order: 6 },
  { id: 'follow-up', type: 'follow-up', title: 'Follow-up', enabled: true, order: 7 },
  { id: 'signature', type: 'signature', title: 'Signature', enabled: true, order: 8 },
];

/**
 * Route options
 */
export const MEDICATION_ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'iv', label: 'IV (Intravenous)' },
  { value: 'im', label: 'IM (Intramuscular)' },
  { value: 'sc', label: 'SC (Subcutaneous)' },
  { value: 'topical', label: 'Topical' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'ophthalmic', label: 'Ophthalmic' },
  { value: 'otic', label: 'Otic (Ear)' },
  { value: 'nasal', label: 'Nasal' },
  { value: 'transdermal', label: 'Transdermal' },
];

/**
 * Frequency options
 */
export const MEDICATION_FREQUENCIES = [
  { value: 'OD', label: 'Once daily (OD)', times: 1 },
  { value: 'BD', label: 'Twice daily (BD)', times: 2 },
  { value: 'TDS', label: 'Three times daily (TDS)', times: 3 },
  { value: 'QID', label: 'Four times daily (QID)', times: 4 },
  { value: 'Q4H', label: 'Every 4 hours', times: 6 },
  { value: 'Q6H', label: 'Every 6 hours', times: 4 },
  { value: 'Q8H', label: 'Every 8 hours', times: 3 },
  { value: 'Q12H', label: 'Every 12 hours', times: 2 },
  { value: 'PRN', label: 'As needed (PRN)', times: null },
  { value: 'STAT', label: 'Immediately (STAT)', times: 1 },
  { value: 'HS', label: 'At bedtime (HS)', times: 1 },
  { value: 'AC', label: 'Before meals (AC)', times: 3 },
  { value: 'PC', label: 'After meals (PC)', times: 3 },
  { value: 'Weekly', label: 'Weekly', times: null },
];

/**
 * Create a new medication with defaults
 */
export const createMedication = (overrides = {}) => {
  return {
    ...medicationSchema,
    id: `med_${Date.now()}`,
    ...overrides,
  };
};

/**
 * Create a new prescription template
 */
export const createPrescriptionTemplate = (name, overrides = {}) => {
  const now = new Date().toISOString();
  
  return {
    ...prescriptionTemplateSchema,
    id: `rx_template_${Date.now()}`,
    name,
    sections: DEFAULT_PRESCRIPTION_SECTIONS.map(s => ({ ...s })),
    metadata: {
      author: 'user',
      createdAt: now,
      updatedAt: now,
    },
    ...overrides,
  };
};

export default {
  medicationSchema,
  prescriptionSectionSchema,
  clinicInfoSchema,
  prescriptionStylingSchema,
  prescriptionTemplateSchema,
  prescriptionDataSchema,
  DEFAULT_PRESCRIPTION_SECTIONS,
  MEDICATION_ROUTES,
  MEDICATION_FREQUENCIES,
  createMedication,
  createPrescriptionTemplate,
};