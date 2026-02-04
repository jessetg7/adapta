// src/data/defaultRules.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Default rules for ADAPTA
 * These demonstrate the rule engine capabilities
 */
export const defaultRules = {
  // Show gynecology section for female patients
  showGynecologyForFemale: {
    id: 'rule-gyn-female',
    name: 'Show Gynecology for Female',
    description: 'Show gynecology-related fields when patient is female',
    enabled: true,
    priority: 1,
    conditions: {
      id: uuidv4(),
      operator: 'AND',
      conditions: [
        {
          id: uuidv4(),
          field: 'patient.gender',
          operator: 'equals',
          value: 'female',
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'show',
        target: 'section-menstrual',
      },
      {
        id: uuidv4(),
        type: 'show',
        target: 'section-obstetric',
      },
    ],
    category: 'gender',
    tags: ['gender', 'gynecology'],
  },

  // Pediatric dosing warning
  pediatricDosingWarning: {
    id: 'rule-pediatric-warning',
    name: 'Pediatric Dosing Warning',
    description: 'Show warning for patients under 12',
    enabled: true,
    priority: 2,
    conditions: {
      id: uuidv4(),
      operator: 'AND',
      conditions: [
        {
          id: uuidv4(),
          field: 'patient.age',
          operator: 'lessThan',
          value: 12,
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'showWarning',
        target: 'medications',
        message: '⚠️ Pediatric patient: Please verify dosing is appropriate for age and weight.',
      },
    ],
    category: 'safety',
    tags: ['pediatric', 'dosing', 'safety'],
  },

  // Allergy alert
  allergyAlert: {
    id: 'rule-allergy-alert',
    name: 'Allergy Alert',
    description: 'Show alert when patient has known allergies',
    enabled: true,
    priority: 0,
    conditions: {
      id: uuidv4(),
      operator: 'AND',
      conditions: [
        {
          id: uuidv4(),
          field: 'patient.allergies',
          operator: 'isNotEmpty',
          value: null,
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'showAlert',
        target: 'form',
        message: '🚨 Patient has known allergies. Please review before prescribing.',
      },
    ],
    category: 'safety',
    tags: ['allergy', 'safety'],
  },

  // Emergency visit - hide non-critical fields
  emergencySimplify: {
    id: 'rule-emergency-simplify',
    name: 'Emergency Visit Simplification',
    description: 'Hide non-critical fields during emergency visits',
    enabled: true,
    priority: 5,
    conditions: {
      id: uuidv4(),
      operator: 'AND',
      conditions: [
        {
          id: uuidv4(),
          field: 'visit.type',
          operator: 'equals',
          value: 'emergency',
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'hide',
        target: 'section-emergency-contact',
      },
      {
        id: uuidv4(),
        type: 'hide',
        target: 'section-development',
      },
    ],
    category: 'workflow',
    tags: ['emergency', 'workflow'],
  },

  // Calculate BMI
  calculateBMI: {
    id: 'rule-calculate-bmi',
    name: 'Calculate BMI',
    description: 'Auto-calculate BMI from weight and height',
    enabled: true,
    priority: 10,
    conditions: {
      id: uuidv4(),
      operator: 'AND',
      conditions: [
        {
          id: uuidv4(),
          field: 'vitals.weight',
          operator: 'isNotEmpty',
          value: null,
        },
        {
          id: uuidv4(),
          field: 'vitals.height',
          operator: 'isNotEmpty',
          value: null,
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'calculate',
        target: 'vitals.bmi',
        formula: '{vitals.weight} / (({vitals.height} / 100) * ({vitals.height} / 100))',
      },
    ],
    category: 'calculation',
    tags: ['vitals', 'calculation'],
  },

  // Follow-up required for chronic conditions
  chronicFollowUp: {
    id: 'rule-chronic-followup',
    name: 'Chronic Condition Follow-up',
    description: 'Make follow-up required for patients with chronic conditions',
    enabled: true,
    priority: 3,
    conditions: {
      id: uuidv4(),
      operator: 'OR',
      conditions: [
        {
          id: uuidv4(),
          field: 'patient.medicalConditions',
          operator: 'contains',
          value: 'diabetes',
        },
        {
          id: uuidv4(),
          field: 'patient.medicalConditions',
          operator: 'contains',
          value: 'hypertension',
        },
        {
          id: uuidv4(),
          field: 'patient.medicalConditions',
          operator: 'contains',
          value: 'heart-disease',
        },
      ],
    },
    actions: [
      {
        id: uuidv4(),
        type: 'require',
        target: 'field-followup',
      },
      {
        id: uuidv4(),
        type: 'showWarning',
        target: 'form',
        message: 'Patient has chronic condition(s). Follow-up is recommended.',
      },
    ],
    category: 'clinical',
    tags: ['chronic', 'follow-up'],
  },
};

export default defaultRules;