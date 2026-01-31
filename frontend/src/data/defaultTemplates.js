// src/data/defaultTemplates.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Default templates for ADAPTA
 * These are JSON-defined, not hardcoded logic
 */
export const defaultTemplates = {
  // General Patient Intake Form
  patientIntake: {
    id: 'template-patient-intake',
    name: 'Patient Intake Form',
    type: 'patientIntake',
    category: 'general',
    genderSpecific: 'all',
    visitType: 'first',
    version: 1,
    sections: [
      {
        id: 'section-personal',
        title: 'Personal Information',
        order: 0,
        collapsible: true,
        columns: 2,
        fields: [
          {
            id: 'field-firstname',
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            required: true,
            width: 'half',
            order: 0,
          },
          {
            id: 'field-lastname',
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            required: true,
            width: 'half',
            order: 1,
          },
          {
            id: 'field-dob',
            type: 'date',
            name: 'dateOfBirth',
            label: 'Date of Birth',
            required: true,
            width: 'half',
            order: 2,
          },
          {
            id: 'field-gender',
            type: 'dropdown',
            name: 'gender',
            label: 'Gender',
            required: true,
            width: 'half',
            order: 3,
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ],
          },
          {
            id: 'field-phone',
            type: 'phone',
            name: 'phone',
            label: 'Phone Number',
            required: true,
            width: 'half',
            order: 4,
          },
          {
            id: 'field-email',
            type: 'email',
            name: 'email',
            label: 'Email Address',
            required: false,
            width: 'half',
            order: 5,
          },
          {
            id: 'field-address',
            type: 'textarea',
            name: 'address',
            label: 'Address',
            required: false,
            width: 'full',
            order: 6,
            config: { rows: 2 },
          },
        ],
      },
      {
        id: 'section-medical',
        title: 'Medical History',
        order: 1,
        collapsible: true,
        columns: 1,
        fields: [
          {
            id: 'field-allergies',
            type: 'multiselect',
            name: 'allergies',
            label: 'Known Allergies',
            required: false,
            width: 'full',
            order: 0,
            options: [
              { value: 'penicillin', label: 'Penicillin' },
              { value: 'sulfa', label: 'Sulfa Drugs' },
              { value: 'aspirin', label: 'Aspirin' },
              { value: 'ibuprofen', label: 'Ibuprofen' },
              { value: 'latex', label: 'Latex' },
              { value: 'peanuts', label: 'Peanuts' },
              { value: 'none', label: 'No Known Allergies' },
            ],
          },
          {
            id: 'field-conditions',
            type: 'multiselect',
            name: 'medicalConditions',
            label: 'Existing Medical Conditions',
            required: false,
            width: 'full',
            order: 1,
            options: [
              { value: 'diabetes', label: 'Diabetes' },
              { value: 'hypertension', label: 'Hypertension' },
              { value: 'heart-disease', label: 'Heart Disease' },
              { value: 'asthma', label: 'Asthma' },
              { value: 'thyroid', label: 'Thyroid Disorder' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            id: 'field-currentMeds',
            type: 'textarea',
            name: 'currentMedications',
            label: 'Current Medications',
            required: false,
            width: 'full',
            order: 2,
            config: { rows: 3, placeholder: 'List all current medications...' },
          },
        ],
      },
      {
        id: 'section-emergency',
        title: 'Emergency Contact',
        order: 2,
        collapsible: true,
        columns: 2,
        fields: [
          {
            id: 'field-emergency-name',
            type: 'text',
            name: 'emergencyContactName',
            label: 'Contact Name',
            required: false,
            width: 'half',
            order: 0,
          },
          {
            id: 'field-emergency-phone',
            type: 'phone',
            name: 'emergencyContactPhone',
            label: 'Contact Phone',
            required: false,
            width: 'half',
            order: 1,
          },
          {
            id: 'field-emergency-relation',
            type: 'dropdown',
            name: 'emergencyContactRelation',
            label: 'Relationship',
            required: false,
            width: 'half',
            order: 2,
            options: [
              { value: 'spouse', label: 'Spouse' },
              { value: 'parent', label: 'Parent' },
              { value: 'child', label: 'Child' },
              { value: 'sibling', label: 'Sibling' },
              { value: 'friend', label: 'Friend' },
              { value: 'other', label: 'Other' },
            ],
          },
        ],
      },
    ],
    metadata: {
      author: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: true,
      isActive: true,
    },
  },

  // General Consultation Form
  generalConsultation: {
    id: 'template-general-consultation',
    name: 'General Consultation',
    type: 'consultation',
    category: 'general',
    genderSpecific: 'all',
    visitType: 'all',
    version: 1,
    sections: [
      {
        id: 'section-vitals',
        title: 'Vitals',
        order: 0,
        collapsible: false,
        columns: 4,
        fields: [
          {
            id: 'field-vitals',
            type: 'vitals',
            name: 'vitals',
            label: 'Patient Vitals',
            required: false,
            width: 'full',
            order: 0,
          },
        ],
      },
      {
        id: 'section-complaint',
        title: 'Chief Complaint',
        order: 1,
        collapsible: false,
        columns: 1,
        fields: [
          {
            id: 'field-complaint',
            type: 'textarea',
            name: 'chiefComplaint',
            label: 'Chief Complaint',
            required: true,
            width: 'full',
            order: 0,
            config: { rows: 3, placeholder: 'Describe the main reason for visit...' },
          },
          {
            id: 'field-duration',
            type: 'text',
            name: 'symptomDuration',
            label: 'Duration of Symptoms',
            required: false,
            width: 'half',
            order: 1,
          },
          {
            id: 'field-severity',
            type: 'dropdown',
            name: 'severity',
            label: 'Severity',
            required: false,
            width: 'half',
            order: 2,
            options: [
              { value: 'mild', label: 'Mild' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'severe', label: 'Severe' },
            ],
          },
        ],
      },
      {
        id: 'section-examination',
        title: 'Physical Examination',
        order: 2,
        collapsible: true,
        columns: 1,
        fields: [
          {
            id: 'field-examination',
            type: 'textarea',
            name: 'physicalExamination',
            label: 'Examination Findings',
            required: false,
            width: 'full',
            order: 0,
            config: { rows: 4 },
          },
        ],
      },
      {
        id: 'section-diagnosis',
        title: 'Diagnosis',
        order: 3,
        collapsible: false,
        columns: 1,
        fields: [
          {
            id: 'field-diagnosis',
            type: 'textarea',
            name: 'diagnosis',
            label: 'Diagnosis',
            required: true,
            width: 'full',
            order: 0,
            config: { rows: 2 },
          },
        ],
      },
      {
        id: 'section-prescription',
        title: 'Prescription',
        order: 4,
        collapsible: false,
        columns: 1,
        fields: [
          {
            id: 'field-medications',
            type: 'medications',
            name: 'medications',
            label: 'Medications',
            required: false,
            width: 'full',
            order: 0,
          },
        ],
      },
      {
        id: 'section-investigations',
        title: 'Investigations',
        order: 5,
        collapsible: true,
        columns: 1,
        fields: [
          {
            id: 'field-investigations',
            type: 'investigations',
            name: 'investigations',
            label: 'Ordered Investigations',
            required: false,
            width: 'full',
            order: 0,
          },
        ],
      },
      {
        id: 'section-advice',
        title: 'Advice & Follow-up',
        order: 6,
        collapsible: true,
        columns: 2,
        fields: [
          {
            id: 'field-advice',
            type: 'textarea',
            name: 'advice',
            label: 'Advice',
            required: false,
            width: 'full',
            order: 0,
            config: { rows: 3 },
          },
          {
            id: 'field-followup',
            type: 'date',
            name: 'followUpDate',
            label: 'Follow-up Date',
            required: false,
            width: 'half',
            order: 1,
          },
        ],
      },
    ],
    metadata: {
      author: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: true,
      isActive: true,
    },
  },

  // Gynecology Consultation (Female-specific)
  gynecologyConsultation: {
    id: 'template-gynecology',
    name: 'Gynecology Consultation',
    type: 'consultation',
    category: 'gynecology',
    genderSpecific: 'female',
    visitType: 'all',
    version: 1,
    sections: [
      {
        id: 'section-vitals',
        title: 'Vitals',
        order: 0,
        collapsible: false,
        fields: [
          {
            id: 'field-vitals',
            type: 'vitals',
            name: 'vitals',
            label: 'Patient Vitals',
            required: false,
            width: 'full',
            order: 0,
          },
        ],
      },
      {
        id: 'section-menstrual',
        title: 'Menstrual History',
        order: 1,
        collapsible: false,
        columns: 2,
        fields: [
          {
            id: 'field-lmp',
            type: 'date',
            name: 'lastMenstrualPeriod',
            label: 'Last Menstrual Period (LMP)',
            required: true,
            width: 'half',
            order: 0,
          },
          {
            id: 'field-cycle',
            type: 'number',
            name: 'cycleLength',
            label: 'Cycle Length (days)',
            required: false,
            width: 'half',
            order: 1,
          },
          {
            id: 'field-flow',
            type: 'dropdown',
            name: 'menstrualFlow',
            label: 'Flow',
            required: false,
            width: 'half',
            order: 3,
            options: [
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'heavy', label: 'Heavy' },
            ],
          },
          {
            id: 'field-regularity',
            type: 'radio',
            name: 'cycleRegularity',
            label: 'Cycle Regularity',
            required: false,
            width: 'half',
            order: 4,
            options: [
              { value: 'regular', label: 'Regular' },
              { value: 'irregular', label: 'Irregular' },
            ],
          },
        ],
      },
      {
        id: 'section-complaint',
        title: 'Chief Complaint',
        order: 2,
        collapsible: false,
        fields: [
          {
            id: 'field-complaint',
            type: 'textarea',
            name: 'chiefComplaint',
            label: 'Chief Complaint',
            required: true,
            width: 'full',
            order: 0,
            config: { rows: 3 },
          },
        ],
      },
      {
        id: 'section-examination',
        title: 'Clinical Examination',
        order: 3,
        collapsible: true,
        fields: [
          {
            id: 'field-abdominal',
            type: 'textarea',
            name: 'abdominalExamination',
            label: 'Abdominal Examination',
            required: false,
            width: 'full',
            order: 0,
          },
          {
            id: 'field-pelvic',
            type: 'textarea',
            name: 'pelvicExamination',
            label: 'Pelvic Examination',
            required: false,
            width: 'full',
            order: 1,
          },
        ],
      },
      {
        id: 'section-prescription',
        title: 'Diagnosis & Prescription',
        order: 4,
        collapsible: false,
        fields: [
          {
            id: 'field-diagnosis',
            type: 'textarea',
            name: 'diagnosis',
            label: 'Diagnosis',
            required: true,
            width: 'full',
            order: 0,
          },
          {
            id: 'field-medications',
            type: 'medications',
            name: 'medications',
            label: 'Medications',
            required: false,
            width: 'full',
            order: 1,
          },
          {
            id: 'field-advice',
            type: 'textarea',
            name: 'advice',
            label: 'Advice',
            required: false,
            width: 'full',
            order: 2,
            config: { rows: 3 },
          },
        ],
      },
    ],
    metadata: {
      author: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: true,
      isActive: true,
    },
  },

  // Antenatal Booking Visit (First Visit)
  antenatalBookingVisit: {
    id: 'template-antenatal-booking',
    name: 'Antenatal Booking Visit',
    type: 'consultation',
    category: 'obstetrics',
    genderSpecific: 'female',
    visitType: 'first',
    version: 1,
    sections: [
      {
        id: 'section-general',
        title: 'General Information',
        order: 0,
        columns: 2,
        fields: [
          { id: 'occupation', type: 'text', label: 'Occupation', width: 'half' },
          { id: 'place', type: 'text', label: 'Place', width: 'half' },
          { id: 'reference', type: 'text', label: 'Reference', width: 'full' },
        ]
      },
      {
        id: 'section-obstetric-score',
        title: 'Obstetric Status',
        order: 1,
        columns: 5,
        fields: [
          { id: 'gravida', type: 'number', label: 'G (Gravida)', width: 'fifth' },
          { id: 'para', type: 'number', label: 'P (Para)', width: 'fifth' },
          { id: 'living', type: 'number', label: 'L (Living)', width: 'fifth' },
          { id: 'abortions', type: 'number', label: 'A (Abortions)', width: 'fifth' },
          { id: 'ectopic', type: 'number', label: 'E (Ectopic)', width: 'fifth' },
        ]
      },
      {
        id: 'section-pregnancy-details',
        title: 'Current Pregnancy',
        order: 2,
        columns: 2,
        fields: [
          { id: 'lmp', type: 'date', label: 'LMP (Last Menstrual Period)', width: 'half', required: true },
          { id: 'edd', type: 'date', label: 'EDD (Estimated Delivery Date)', width: 'half' },
          { id: 'pog', type: 'text', label: 'POG (Weeks)', width: 'half' },
          {
            id: 'conceptionMode',
            type: 'dropdown',
            label: 'Mode of Conception',
            width: 'half',
            options: [
              { value: 'spontaneous', label: 'Spontaneous' },
              { value: 'iui', label: 'IUI' },
              { value: 'icsi', label: 'ICSI' },
              { value: 'ivf', label: 'IVF' },
            ]
          },
        ]
      },
      {
        id: 'section-symptoms',
        title: '1st Trimester Symptoms',
        order: 3,
        columns: 2,
        fields: [
          { id: 'nausea', type: 'toggle', label: 'Nausea', width: 'half' },
          { id: 'vomiting', type: 'toggle', label: 'Vomiting', width: 'half' },
          { id: 'bleeding', type: 'toggle', label: 'Bleeding/Spotting', width: 'half' },
          { id: 'folicAcid', type: 'toggle', label: 'Preconceptional Folic Acid', width: 'half' },
          {
            id: 'ttInj', type: 'dropdown', label: 'Inj TT Taken', width: 'half', options: [
              { value: 'none', label: 'None' },
              { value: '1dose', label: '1 Dose' },
              { value: '2doses', label: '2 Doses' },
            ]
          },
          { id: 'picme', type: 'text', label: 'PICME Number', width: 'half' },
        ]
      },
      {
        id: 'section-comorbidities',
        title: 'Comorbidities in Pregnancy',
        order: 4,
        columns: 2,
        fields: [
          {
            id: 'dm', type: 'dropdown', label: 'GDM/Type 2 DM', width: 'half', options: [
              { value: 'nil', label: 'Nil' },
              { value: 'gdm', label: 'GDM' },
              { value: 'dm2', label: 'Type 2 DM' },
            ]
          },
          {
            id: 'htn', type: 'dropdown', label: 'PIH/Hypertension', width: 'half', options: [
              { value: 'nil', label: 'Nil' },
              { value: 'pih', label: 'PIH' },
              { value: 'essential', label: 'Essential HTN' },
            ]
          },
          { id: 'thyroid', type: 'toggle', label: 'Hypothyroidism', width: 'half' },
          { id: 'asthma', type: 'toggle', label: 'Asthma', width: 'half' },
        ]
      },
      {
        id: 'section-obstetric-history',
        title: 'Previous Obstetric History',
        order: 5,
        fields: [
          {
            id: 'prevObstetricHistory',
            type: 'table',
            label: 'History of Previous Pregnancies',
            width: 'full',
            config: {
              columns: [
                { id: 'outcome', header: 'Outcome', type: 'text', width: '15%' },
                {
                  id: 'modeConception', header: 'Mode of Conception', type: 'dropdown', width: '15%', options: [
                    { value: 'spontaneous', label: 'Spontaneous' },
                    { value: 'assisted', label: 'Assisted' },
                  ]
                },
                { id: 'weeks', header: 'Weeks', type: 'number', width: '10%' },
                { id: 'modeDelivery', header: 'Mode of Delivery', type: 'text', width: '15%' },
                { id: 'babyOutcome', header: 'Baby Outcome', type: 'text', width: '15%' },
                { id: 'complications', header: 'Complications', type: 'text', width: '30%' },
              ]
            }
          }
        ]
      },
    ],
    metadata: { author: 'system', isSystem: true, isActive: true }
  },

  // Antenatal Follow-up Prescription
  antenatalFollowupVisit: {
    id: 'template-antenatal-followup',
    name: 'Antenatal Follow-up',
    type: 'consultation',
    category: 'obstetrics',
    genderSpecific: 'female',
    visitType: 'followup',
    version: 1,
    sections: [
      {
        id: 'section-vitals-pog',
        title: 'Status & Vitals',
        order: 0,
        columns: 4,
        fields: [
          { id: 'obstetricScoreSummary', type: 'text', label: 'Obstetric Score', width: 'half' },
          { id: 'pog', type: 'text', label: 'POG (Weeks)', width: 'half' },
          { id: 'vitals', type: 'vitals', label: 'Vitals', width: 'full' },
          { id: 'prevWeight', type: 'number', label: 'Previous Visit Weight (kg)', width: 'half' },
          {
            id: 'pallor', type: 'dropdown', label: 'Pallor', width: 'half', options: [
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]
          },
          {
            id: 'pedalEdema', type: 'dropdown', label: 'Pedal Edema', width: 'half', options: [
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]
          },
        ]
      },
      {
        id: 'section-screening',
        title: 'Screening & Reports',
        order: 1,
        columns: 2,
        fields: [
          {
            id: 'screeningReport', type: 'dropdown', label: 'Screening Report', width: 'half', options: [
              { value: 'double-marker', label: 'Double Marker' },
              { value: 'nipt', label: 'NIPT' },
              { value: 'none', label: 'None' },
            ]
          },
          {
            id: 'riskStatus', type: 'dropdown', label: 'Risk Level', width: 'half', options: [
              { value: 'low', label: 'Low Risk' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'high', label: 'High Risk' },
            ]
          },
          {
            id: 'bloodReports', type: 'radio', label: 'Blood Reports', width: 'half', options: [
              { value: 'entered', label: 'Entered' },
              { value: 'not-entered', label: 'Not Entered' },
            ]
          },
        ]
      },
      {
        id: 'section-examination',
        title: 'Examination (O/E)',
        order: 2,
        columns: 1,
        fields: [
          { id: 'paFindings', type: 'textarea', label: 'Per Abdomen (P/A)', width: 'full', config: { rows: 2, placeholder: 'e.g., Uterus 16 weeks, relaxed, liquor average, FHS good' } },
          { id: 'cervicalLength', type: 'text', label: 'Cervical Length', width: 'half' },
        ]
      },
      {
        id: 'section-vaccination',
        title: 'Vaccination',
        order: 3,
        columns: 2,
        fields: [
          {
            id: 'tdVac', type: 'dropdown', label: 'Inj. Td vac 0.5 ml IM', width: 'half', options: [
              { value: 'given', label: 'Given' },
              { value: 'not-given', label: 'Not Given' },
            ]
          },
          {
            id: 'tdap', type: 'dropdown', label: 'Tdap vaccine', width: 'half', options: [
              { value: 'discussed', label: 'Discussed' },
              { value: 'taken', label: 'Taken' },
              { value: 'pending', label: 'Pending' },
            ]
          },
        ]
      },
      {
        id: 'section-prescription',
        title: 'Prescription',
        order: 4,
        fields: [
          { id: 'medications', type: 'medications', label: 'Medications Advised', width: 'full' },
          { id: 'investigations', type: 'investigations', label: 'Ordered Investigations', width: 'full' },
          { id: 'advice', type: 'textarea', label: 'Advice', width: 'full', config: { rows: 3 } },
        ]
      },
    ],
    metadata: { author: 'system', isSystem: true, isActive: true }
  },

  // Pediatric Consultation
  pediatricConsultation: {
    id: 'template-pediatric',
    name: 'Pediatric Consultation',
    type: 'consultation',
    category: 'pediatrics',
    genderSpecific: 'pediatric',
    ageRange: { min: 0, max: 18 },
    visitType: 'all',
    version: 1,
    sections: [
      {
        id: 'section-vitals',
        title: 'Vitals & Growth',
        order: 0,
        collapsible: false,
        fields: [
          {
            id: 'field-vitals',
            type: 'vitals',
            name: 'vitals',
            label: 'Patient Vitals',
            required: false,
            width: 'full',
            order: 0,
          },
        ],
      },
      {
        id: 'section-development',
        title: 'Developmental Assessment',
        order: 1,
        collapsible: true,
        fields: [
          {
            id: 'field-milestones',
            type: 'multiselect',
            name: 'developmentalMilestones',
            label: 'Developmental Milestones',
            required: false,
            width: 'full',
            order: 0,
            options: [
              { value: 'social-smile', label: 'Social Smile' },
              { value: 'head-holding', label: 'Head Holding' },
              { value: 'rolling', label: 'Rolling Over' },
              { value: 'sitting', label: 'Sitting' },
              { value: 'crawling', label: 'Crawling' },
              { value: 'standing', label: 'Standing' },
              { value: 'walking', label: 'Walking' },
              { value: 'talking', label: 'Talking' },
            ],
          },
        ],
      },
      {
        id: 'section-immunization',
        title: 'Immunization Status',
        order: 2,
        collapsible: true,
        fields: [
          {
            id: 'field-immunization',
            type: 'radio',
            name: 'immunizationStatus',
            label: 'Immunization Up-to-date?',
            required: false,
            width: 'full',
            order: 0,
            options: [
              { value: 'uptodate', label: 'Up-to-date' },
              { value: 'partial', label: 'Partially Complete' },
              { value: 'unknown', label: 'Unknown' },
            ],
          },
        ],
      },
      {
        id: 'section-complaint',
        title: 'Chief Complaint',
        order: 3,
        collapsible: false,
        fields: [
          {
            id: 'field-complaint',
            type: 'textarea',
            name: 'chiefComplaint',
            label: 'Chief Complaint (from parent/guardian)',
            required: true,
            width: 'full',
            order: 0,
            config: { rows: 3 },
          },
        ],
      },
      {
        id: 'section-prescription',
        title: 'Prescription',
        order: 4,
        collapsible: false,
        fields: [
          {
            id: 'field-diagnosis',
            type: 'textarea',
            name: 'diagnosis',
            label: 'Diagnosis',
            required: true,
            width: 'full',
            order: 0,
          },
          {
            id: 'field-medications',
            type: 'medications',
            name: 'medications',
            label: 'Medications (Pediatric Dosing)',
            required: false,
            width: 'full',
            order: 1,
          },
        ],
      },
    ],
    metadata: {
      author: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: true,
      isActive: true,
    },
  },
};

export default defaultTemplates;