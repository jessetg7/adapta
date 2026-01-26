
import React, { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext(null);

// ============================================
// COMPREHENSIVE BUILT-IN TEMPLATES
// ============================================
const BUILT_IN_TEMPLATES = [
  // ==========================================
  // 1. CARDIOLOGY INTAKE FORM
  // ==========================================
  {
    id: 'cardiology-intake-v1',
    name: 'Cardiology Intake Form',
    description: 'Comprehensive cardiac assessment including patient history, risk factors, symptoms, vitals, and clinical evaluation',
    category: 'Cardiology',
    version: '2.0.0',
    author: 'Dr. Heart Specialist',
    icon: 'favorite',
    color: '#e53935',
    tags: ['cardiac', 'intake', 'assessment', 'heart', 'cardiovascular'],
    usageCount: 1245,
    createdAt: '2024-01-15T10:30:00Z',
    sections: [
      // Section 1: Patient Demographics
      {
        id: 'section-demographics',
        title: 'Patient Demographics',
        description: 'Basic patient identification and contact information',
        order: 1,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'patient-mrn', type: 'text', label: 'Medical Record Number (MRN)', required: true, placeholder: 'Enter MRN' },
          { id: 'patient-first-name', type: 'text', label: 'First Name', required: true, placeholder: 'Enter first name' },
          { id: 'patient-middle-name', type: 'text', label: 'Middle Name', required: false, placeholder: 'Enter middle name' },
          { id: 'patient-last-name', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter last name' },
          { id: 'patient-dob', type: 'date', label: 'Date of Birth', required: true },
          { id: 'patient-age', type: 'number', label: 'Age (Years)', required: true, placeholder: '0-120', validation: { min: 0, max: 120 } },
          { id: 'patient-gender', type: 'dropdown', label: 'Gender', required: true, options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' }
          ]},
          { id: 'patient-blood-group', type: 'dropdown', label: 'Blood Group', required: true, options: [
            { value: 'a-positive', label: 'A+' },
            { value: 'a-negative', label: 'A-' },
            { value: 'b-positive', label: 'B+' },
            { value: 'b-negative', label: 'B-' },
            { value: 'ab-positive', label: 'AB+' },
            { value: 'ab-negative', label: 'AB-' },
            { value: 'o-positive', label: 'O+' },
            { value: 'o-negative', label: 'O-' },
            { value: 'unknown', label: 'Unknown' }
          ]},
          { id: 'patient-marital-status', type: 'dropdown', label: 'Marital Status', required: false, options: [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
            { value: 'separated', label: 'Separated' }
          ]},
          { id: 'patient-occupation', type: 'text', label: 'Occupation', required: false, placeholder: 'Enter occupation' },
          { id: 'patient-phone', type: 'text', label: 'Phone Number', required: true, placeholder: '+1 (xxx) xxx-xxxx' },
          { id: 'patient-alt-phone', type: 'text', label: 'Alternate Phone', required: false, placeholder: '+1 (xxx) xxx-xxxx' },
          { id: 'patient-email', type: 'text', label: 'Email Address', required: false, placeholder: 'patient@email.com' },
          { id: 'patient-address', type: 'textarea', label: 'Full Address', required: true, placeholder: 'Street, City, State, ZIP Code' },
        ]
      },
      // Section 2: Emergency Contact
      {
        id: 'section-emergency-contact',
        title: 'Emergency Contact Information',
        description: 'Person to contact in case of emergency',
        order: 2,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'emergency-name', type: 'text', label: 'Emergency Contact Name', required: true, placeholder: 'Full name' },
          { id: 'emergency-relationship', type: 'dropdown', label: 'Relationship to Patient', required: true, options: [
            { value: 'spouse', label: 'Spouse' },
            { value: 'parent', label: 'Parent' },
            { value: 'child', label: 'Child' },
            { value: 'sibling', label: 'Sibling' },
            { value: 'friend', label: 'Friend' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'emergency-phone', type: 'text', label: 'Emergency Contact Phone', required: true, placeholder: '+1 (xxx) xxx-xxxx' },
          { id: 'emergency-alt-phone', type: 'text', label: 'Alternate Phone', required: false, placeholder: '+1 (xxx) xxx-xxxx' },
          { id: 'emergency-address', type: 'textarea', label: 'Address (if different from patient)', required: false, placeholder: 'Full address' },
        ]
      },
      // Section 3: Insurance Information
      {
        id: 'section-insurance',
        title: 'Insurance Information',
        description: 'Health insurance and billing details',
        order: 3,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'has-insurance', type: 'checkbox', label: 'Has Health Insurance', checkboxLabel: 'Patient has health insurance coverage' },
          { id: 'insurance-provider', type: 'text', label: 'Insurance Provider', required: false, placeholder: 'Insurance company name',
            conditionalVisibility: { dependsOn: 'has-insurance', condition: 'equals', value: true }
          },
          { id: 'insurance-policy-number', type: 'text', label: 'Policy Number', required: false, placeholder: 'Policy/Member ID',
            conditionalVisibility: { dependsOn: 'has-insurance', condition: 'equals', value: true }
          },
          { id: 'insurance-group-number', type: 'text', label: 'Group Number', required: false, placeholder: 'Group number',
            conditionalVisibility: { dependsOn: 'has-insurance', condition: 'equals', value: true }
          },
          { id: 'insurance-holder-name', type: 'text', label: 'Policy Holder Name', required: false, placeholder: 'Name on insurance card',
            conditionalVisibility: { dependsOn: 'has-insurance', condition: 'equals', value: true }
          },
          { id: 'insurance-holder-dob', type: 'date', label: 'Policy Holder DOB', required: false,
            conditionalVisibility: { dependsOn: 'has-insurance', condition: 'equals', value: true }
          },
          { id: 'payment-method', type: 'dropdown', label: 'Preferred Payment Method', required: true, options: [
            { value: 'insurance', label: 'Insurance' },
            { value: 'cash', label: 'Cash' },
            { value: 'credit-card', label: 'Credit Card' },
            { value: 'debit-card', label: 'Debit Card' },
            { value: 'check', label: 'Check' }
          ]},
        ]
      },
      // Section 4: Chief Complaint & Referral
      {
        id: 'section-chief-complaint',
        title: 'Chief Complaint & Referral',
        description: 'Primary reason for visit and referral information',
        order: 4,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'referral-source', type: 'dropdown', label: 'Referral Source', required: true, options: [
            { value: 'self', label: 'Self-Referral' },
            { value: 'primary-care', label: 'Primary Care Physician' },
            { value: 'emergency', label: 'Emergency Department' },
            { value: 'specialist', label: 'Other Specialist' },
            { value: 'hospital', label: 'Hospital Discharge' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'referring-physician', type: 'text', label: 'Referring Physician Name', required: false, placeholder: 'Dr. Name' },
          { id: 'referring-physician-phone', type: 'text', label: 'Referring Physician Phone', required: false, placeholder: 'Phone number' },
          { id: 'chief-complaint', type: 'textarea', label: 'Chief Complaint', required: true, placeholder: 'Describe the primary reason for this cardiology visit...', helpText: 'What is the main cardiac concern?' },
          { id: 'symptom-onset', type: 'text', label: 'When did symptoms begin?', required: true, placeholder: 'e.g., 2 weeks ago, 3 days ago' },
          { id: 'symptom-progression', type: 'dropdown', label: 'Symptom Progression', required: true, options: [
            { value: 'stable', label: 'Stable - No change' },
            { value: 'improving', label: 'Improving' },
            { value: 'worsening', label: 'Worsening' },
            { value: 'fluctuating', label: 'Fluctuating' }
          ]},
          { id: 'visit-urgency', type: 'dropdown', label: 'Visit Urgency', required: true, options: [
            { value: 'routine', label: 'Routine Follow-up' },
            { value: 'urgent', label: 'Urgent (Within 24-48 hours)' },
            { value: 'emergency', label: 'Emergency' }
          ]},
        ]
      },
      // Section 5: Cardiac History
      {
        id: 'section-cardiac-history',
        title: 'Cardiac History',
        description: 'Previous cardiac conditions, procedures, and treatments',
        order: 5,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'history-mi', type: 'checkbox', label: 'Myocardial Infarction (Heart Attack)', checkboxLabel: 'History of heart attack' },
          { id: 'mi-date', type: 'text', label: 'When did the heart attack occur?', required: false, placeholder: 'Month/Year',
            conditionalVisibility: { dependsOn: 'history-mi', condition: 'equals', value: true }
          },
          { id: 'mi-treatment', type: 'text', label: 'Treatment received for heart attack', required: false, placeholder: 'e.g., Stent, CABG, Medical management',
            conditionalVisibility: { dependsOn: 'history-mi', condition: 'equals', value: true }
          },
          { id: 'history-chf', type: 'checkbox', label: 'Congestive Heart Failure (CHF)', checkboxLabel: 'History of heart failure' },
          { id: 'chf-class', type: 'dropdown', label: 'NYHA Heart Failure Class', required: false, options: [
            { value: 'class-1', label: 'Class I - No limitation' },
            { value: 'class-2', label: 'Class II - Slight limitation' },
            { value: 'class-3', label: 'Class III - Marked limitation' },
            { value: 'class-4', label: 'Class IV - Severe limitation' }
          ], conditionalVisibility: { dependsOn: 'history-chf', condition: 'equals', value: true }},
          { id: 'history-arrhythmia', type: 'checkbox', label: 'Arrhythmia', checkboxLabel: 'History of irregular heartbeat' },
          { id: 'arrhythmia-type', type: 'multiselect', label: 'Type of Arrhythmia', options: [
            { value: 'afib', label: 'Atrial Fibrillation (AFib)' },
            { value: 'aflutter', label: 'Atrial Flutter' },
            { value: 'svt', label: 'Supraventricular Tachycardia (SVT)' },
            { value: 'vt', label: 'Ventricular Tachycardia (VT)' },
            { value: 'vf', label: 'Ventricular Fibrillation (VF)' },
            { value: 'bradycardia', label: 'Bradycardia' },
            { value: 'heart-block', label: 'Heart Block' },
            { value: 'pvc', label: 'Premature Ventricular Contractions (PVC)' },
            { value: 'pac', label: 'Premature Atrial Contractions (PAC)' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'history-arrhythmia', condition: 'equals', value: true }},
          { id: 'history-valve-disease', type: 'checkbox', label: 'Valvular Heart Disease', checkboxLabel: 'History of heart valve problems' },
          { id: 'valve-affected', type: 'multiselect', label: 'Valve(s) Affected', options: [
            { value: 'aortic-stenosis', label: 'Aortic Stenosis' },
            { value: 'aortic-regurgitation', label: 'Aortic Regurgitation' },
            { value: 'mitral-stenosis', label: 'Mitral Stenosis' },
            { value: 'mitral-regurgitation', label: 'Mitral Regurgitation' },
            { value: 'mitral-prolapse', label: 'Mitral Valve Prolapse' },
            { value: 'tricuspid', label: 'Tricuspid Valve Disease' },
            { value: 'pulmonary', label: 'Pulmonary Valve Disease' }
          ], conditionalVisibility: { dependsOn: 'history-valve-disease', condition: 'equals', value: true }},
          { id: 'history-cad', type: 'checkbox', label: 'Coronary Artery Disease (CAD)', checkboxLabel: 'History of blocked arteries' },
          { id: 'history-cardiomyopathy', type: 'checkbox', label: 'Cardiomyopathy', checkboxLabel: 'History of heart muscle disease' },
          { id: 'cardiomyopathy-type', type: 'dropdown', label: 'Type of Cardiomyopathy', options: [
            { value: 'dilated', label: 'Dilated Cardiomyopathy' },
            { value: 'hypertrophic', label: 'Hypertrophic Cardiomyopathy (HCM)' },
            { value: 'restrictive', label: 'Restrictive Cardiomyopathy' },
            { value: 'arvc', label: 'Arrhythmogenic Right Ventricular Cardiomyopathy' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'history-cardiomyopathy', condition: 'equals', value: true }},
          { id: 'history-pericarditis', type: 'checkbox', label: 'Pericarditis/Pericardial Disease', checkboxLabel: 'History of pericardial inflammation' },
          { id: 'history-endocarditis', type: 'checkbox', label: 'Endocarditis', checkboxLabel: 'History of heart infection' },
          { id: 'history-congenital', type: 'checkbox', label: 'Congenital Heart Disease', checkboxLabel: 'Born with heart defect' },
          { id: 'congenital-details', type: 'textarea', label: 'Describe Congenital Heart Condition', required: false, placeholder: 'Describe the congenital heart defect...',
            conditionalVisibility: { dependsOn: 'history-congenital', condition: 'equals', value: true }
          },
          { id: 'history-aortic-disease', type: 'checkbox', label: 'Aortic Disease', checkboxLabel: 'History of aortic aneurysm or dissection' },
          { id: 'history-pulmonary-hypertension', type: 'checkbox', label: 'Pulmonary Hypertension', checkboxLabel: 'History of high blood pressure in lungs' },
          { id: 'history-dvt-pe', type: 'checkbox', label: 'DVT/Pulmonary Embolism', checkboxLabel: 'History of blood clots' },
        ]
      },
      // Section 6: Cardiac Procedures & Interventions
      {
        id: 'section-cardiac-procedures',
        title: 'Previous Cardiac Procedures',
        description: 'Cardiac surgeries, interventions, and device implants',
        order: 6,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'had-cardiac-procedures', type: 'checkbox', label: 'Previous Cardiac Procedures', checkboxLabel: 'Patient has had cardiac procedures' },
          { id: 'procedures-list', type: 'multiselect', label: 'Select All Previous Procedures', options: [
            { value: 'cabg', label: 'CABG (Bypass Surgery)' },
            { value: 'pci-stent', label: 'PCI/Stent Placement' },
            { value: 'valve-repair', label: 'Valve Repair' },
            { value: 'valve-replacement', label: 'Valve Replacement' },
            { value: 'tavr', label: 'TAVR (Transcatheter Valve Replacement)' },
            { value: 'ablation', label: 'Cardiac Ablation' },
            { value: 'cardioversion', label: 'Cardioversion' },
            { value: 'pacemaker', label: 'Pacemaker Implant' },
            { value: 'icd', label: 'ICD (Defibrillator) Implant' },
            { value: 'crt', label: 'CRT (Cardiac Resynchronization)' },
            { value: 'watchman', label: 'Watchman Device (LAA Closure)' },
            { value: 'catheterization', label: 'Cardiac Catheterization' },
            { value: 'angioplasty', label: 'Angioplasty' },
            { value: 'heart-transplant', label: 'Heart Transplant' },
            { value: 'lvad', label: 'LVAD (Ventricular Assist Device)' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'had-cardiac-procedures', condition: 'equals', value: true }},
          { id: 'procedure-dates', type: 'textarea', label: 'Procedure Details & Dates', required: false, placeholder: 'List procedures with approximate dates...',
            conditionalVisibility: { dependsOn: 'had-cardiac-procedures', condition: 'equals', value: true }
          },
          { id: 'has-cardiac-device', type: 'checkbox', label: 'Implanted Cardiac Device', checkboxLabel: 'Patient has implanted cardiac device' },
          { id: 'device-type', type: 'dropdown', label: 'Device Type', options: [
            { value: 'pacemaker', label: 'Pacemaker' },
            { value: 'icd', label: 'ICD (Implantable Cardioverter Defibrillator)' },
            { value: 'crt-p', label: 'CRT-P (Biventricular Pacemaker)' },
            { value: 'crt-d', label: 'CRT-D (Biventricular ICD)' },
            { value: 'loop-recorder', label: 'Loop Recorder' },
            { value: 'lvad', label: 'LVAD' }
          ], conditionalVisibility: { dependsOn: 'has-cardiac-device', condition: 'equals', value: true }},
          { id: 'device-manufacturer', type: 'dropdown', label: 'Device Manufacturer', options: [
            { value: 'medtronic', label: 'Medtronic' },
            { value: 'boston-scientific', label: 'Boston Scientific' },
            { value: 'abbott', label: 'Abbott (St. Jude)' },
            { value: 'biotronik', label: 'Biotronik' },
            { value: 'unknown', label: 'Unknown' }
          ], conditionalVisibility: { dependsOn: 'has-cardiac-device', condition: 'equals', value: true }},
          { id: 'device-implant-date', type: 'date', label: 'Device Implant Date',
            conditionalVisibility: { dependsOn: 'has-cardiac-device', condition: 'equals', value: true }
          },
          { id: 'device-last-check', type: 'date', label: 'Last Device Check Date',
            conditionalVisibility: { dependsOn: 'has-cardiac-device', condition: 'equals', value: true }
          },
        ]
      },
      // Section 7: Cardiovascular Risk Factors
      {
        id: 'section-risk-factors',
        title: 'Cardiovascular Risk Factors',
        description: 'Modifiable and non-modifiable risk factors for heart disease',
        order: 7,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'risk-hypertension', type: 'checkbox', label: 'Hypertension', checkboxLabel: 'High blood pressure' },
          { id: 'hypertension-years', type: 'number', label: 'Years with Hypertension', placeholder: 'Number of years',
            conditionalVisibility: { dependsOn: 'risk-hypertension', condition: 'equals', value: true }
          },
          { id: 'hypertension-controlled', type: 'dropdown', label: 'Blood Pressure Control', options: [
            { value: 'well-controlled', label: 'Well Controlled' },
            { value: 'partially-controlled', label: 'Partially Controlled' },
            { value: 'uncontrolled', label: 'Uncontrolled' }
          ], conditionalVisibility: { dependsOn: 'risk-hypertension', condition: 'equals', value: true }},
          { id: 'risk-diabetes', type: 'checkbox', label: 'Diabetes Mellitus', checkboxLabel: 'Diabetes' },
          { id: 'diabetes-type', type: 'dropdown', label: 'Diabetes Type', options: [
            { value: 'type-1', label: 'Type 1 Diabetes' },
            { value: 'type-2', label: 'Type 2 Diabetes' },
            { value: 'prediabetes', label: 'Prediabetes' },
            { value: 'gestational', label: 'Gestational Diabetes (history)' }
          ], conditionalVisibility: { dependsOn: 'risk-diabetes', condition: 'equals', value: true }},
          { id: 'diabetes-a1c', type: 'number', label: 'Last HbA1c (%)', placeholder: 'e.g., 7.2', validation: { min: 4, max: 15 },
            conditionalVisibility: { dependsOn: 'risk-diabetes', condition: 'equals', value: true }
          },
          { id: 'risk-hyperlipidemia', type: 'checkbox', label: 'Hyperlipidemia', checkboxLabel: 'High cholesterol' },
          { id: 'risk-obesity', type: 'checkbox', label: 'Obesity', checkboxLabel: 'BMI ≥ 30' },
          { id: 'risk-smoking', type: 'dropdown', label: 'Smoking Status', required: true, options: [
            { value: 'never', label: 'Never Smoked' },
            { value: 'former', label: 'Former Smoker' },
            { value: 'current', label: 'Current Smoker' }
          ]},
          { id: 'smoking-pack-years', type: 'number', label: 'Pack Years', placeholder: 'Packs/day × years smoked',
            conditionalVisibility: { dependsOn: 'risk-smoking', condition: 'in', value: ['former', 'current'] }
          },
          { id: 'smoking-quit-date', type: 'text', label: 'Quit Date', placeholder: 'Month/Year',
            conditionalVisibility: { dependsOn: 'risk-smoking', condition: 'equals', value: 'former' }
          },
          { id: 'risk-family-history', type: 'checkbox', label: 'Family History', checkboxLabel: 'Family history of premature heart disease' },
          { id: 'family-history-details', type: 'textarea', label: 'Family History Details', placeholder: 'List affected family members, conditions, and ages of onset...',
            conditionalVisibility: { dependsOn: 'risk-family-history', condition: 'equals', value: true }
          },
          { id: 'risk-sedentary', type: 'checkbox', label: 'Sedentary Lifestyle', checkboxLabel: 'Minimal physical activity' },
          { id: 'risk-sleep-apnea', type: 'checkbox', label: 'Sleep Apnea', checkboxLabel: 'Diagnosed with sleep apnea' },
          { id: 'uses-cpap', type: 'checkbox', label: 'Uses CPAP', checkboxLabel: 'Patient uses CPAP machine',
            conditionalVisibility: { dependsOn: 'risk-sleep-apnea', condition: 'equals', value: true }
          },
          { id: 'risk-ckd', type: 'checkbox', label: 'Chronic Kidney Disease', checkboxLabel: 'History of kidney disease' },
          { id: 'ckd-stage', type: 'dropdown', label: 'CKD Stage', options: [
            { value: 'stage-1', label: 'Stage 1 (GFR ≥90)' },
            { value: 'stage-2', label: 'Stage 2 (GFR 60-89)' },
            { value: 'stage-3a', label: 'Stage 3a (GFR 45-59)' },
            { value: 'stage-3b', label: 'Stage 3b (GFR 30-44)' },
            { value: 'stage-4', label: 'Stage 4 (GFR 15-29)' },
            { value: 'stage-5', label: 'Stage 5/ESRD (GFR <15)' }
          ], conditionalVisibility: { dependsOn: 'risk-ckd', condition: 'equals', value: true }},
          { id: 'on-dialysis', type: 'checkbox', label: 'On Dialysis', checkboxLabel: 'Currently on dialysis',
            conditionalVisibility: { dependsOn: 'risk-ckd', condition: 'equals', value: true }
          },
          { id: 'risk-alcohol', type: 'dropdown', label: 'Alcohol Use', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'occasional', label: 'Occasional (< 1 drink/week)' },
            { value: 'moderate', label: 'Moderate (1-2 drinks/day)' },
            { value: 'heavy', label: 'Heavy (> 2 drinks/day)' },
            { value: 'former', label: 'Former Drinker' }
          ]},
          { id: 'risk-drug-use', type: 'checkbox', label: 'Illicit Drug Use', checkboxLabel: 'History of recreational drug use' },
          { id: 'drug-use-details', type: 'text', label: 'Specify Substances', placeholder: 'List substances',
            conditionalVisibility: { dependsOn: 'risk-drug-use', condition: 'equals', value: true }
          },
        ]
      },
      // Section 8: Current Cardiac Symptoms
      {
        id: 'section-symptoms',
        title: 'Current Cardiac Symptoms',
        description: 'Present symptoms and their characteristics',
        order: 8,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'symptom-chest-pain', type: 'dropdown', label: 'Chest Pain/Discomfort', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'rare', label: 'Rare (few times per month)' },
            { value: 'occasional', label: 'Occasional (few times per week)' },
            { value: 'frequent', label: 'Frequent (daily)' },
            { value: 'constant', label: 'Constant' }
          ]},
          { id: 'chest-pain-type', type: 'dropdown', label: 'Type of Chest Pain', options: [
            { value: 'pressure', label: 'Pressure/Squeezing' },
            { value: 'sharp', label: 'Sharp/Stabbing' },
            { value: 'burning', label: 'Burning' },
            { value: 'aching', label: 'Aching' },
            { value: 'tightness', label: 'Tightness' }
          ], conditionalVisibility: { dependsOn: 'symptom-chest-pain', condition: 'notEquals', value: 'none' }},
          { id: 'chest-pain-location', type: 'multiselect', label: 'Pain Location', options: [
            { value: 'substernal', label: 'Substernal (center of chest)' },
            { value: 'left-chest', label: 'Left Chest' },
            { value: 'right-chest', label: 'Right Chest' },
            { value: 'left-arm', label: 'Left Arm' },
            { value: 'jaw', label: 'Jaw' },
            { value: 'neck', label: 'Neck' },
            { value: 'back', label: 'Back' },
            { value: 'shoulder', label: 'Shoulder' }
          ], conditionalVisibility: { dependsOn: 'symptom-chest-pain', condition: 'notEquals', value: 'none' }},
          { id: 'chest-pain-trigger', type: 'multiselect', label: 'Pain Triggers', options: [
            { value: 'exertion', label: 'Physical Exertion' },
            { value: 'emotion', label: 'Emotional Stress' },
            { value: 'cold', label: 'Cold Weather' },
            { value: 'meals', label: 'After Meals' },
            { value: 'rest', label: 'At Rest' },
            { value: 'lying-down', label: 'Lying Down' },
            { value: 'unknown', label: 'No Clear Trigger' }
          ], conditionalVisibility: { dependsOn: 'symptom-chest-pain', condition: 'notEquals', value: 'none' }},
          { id: 'chest-pain-relief', type: 'multiselect', label: 'What Relieves Pain?', options: [
            { value: 'rest', label: 'Rest' },
            { value: 'nitro', label: 'Nitroglycerin' },
            { value: 'antacids', label: 'Antacids' },
            { value: 'position', label: 'Position Change' },
            { value: 'nothing', label: 'Nothing' }
          ], conditionalVisibility: { dependsOn: 'symptom-chest-pain', condition: 'notEquals', value: 'none' }},
          { id: 'symptom-dyspnea', type: 'dropdown', label: 'Shortness of Breath (Dyspnea)', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'strenuous', label: 'Only with strenuous activity' },
            { value: 'moderate', label: 'With moderate activity (climbing stairs)' },
            { value: 'minimal', label: 'With minimal activity (walking)' },
            { value: 'rest', label: 'At rest' }
          ]},
          { id: 'symptom-orthopnea', type: 'checkbox', label: 'Orthopnea', checkboxLabel: 'Difficulty breathing when lying flat' },
          { id: 'orthopnea-pillows', type: 'number', label: 'Number of Pillows Needed', placeholder: '1-5',
            conditionalVisibility: { dependsOn: 'symptom-orthopnea', condition: 'equals', value: true }
          },
          { id: 'symptom-pnd', type: 'checkbox', label: 'PND', checkboxLabel: 'Paroxysmal nocturnal dyspnea (waking up short of breath)' },
          { id: 'symptom-palpitations', type: 'dropdown', label: 'Palpitations', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'rare', label: 'Rare' },
            { value: 'occasional', label: 'Occasional' },
            { value: 'frequent', label: 'Frequent' }
          ]},
          { id: 'palpitation-type', type: 'multiselect', label: 'Palpitation Description', options: [
            { value: 'fast', label: 'Fast heartbeat' },
            { value: 'slow', label: 'Slow heartbeat' },
            { value: 'skipping', label: 'Skipping/Missed beats' },
            { value: 'pounding', label: 'Pounding' },
            { value: 'fluttering', label: 'Fluttering' },
            { value: 'irregular', label: 'Irregular rhythm' }
          ], conditionalVisibility: { dependsOn: 'symptom-palpitations', condition: 'notEquals', value: 'none' }},
          { id: 'symptom-syncope', type: 'dropdown', label: 'Syncope (Fainting)', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'presyncope', label: 'Near-fainting only (presyncope)' },
            { value: 'single', label: 'Single episode' },
            { value: 'multiple', label: 'Multiple episodes' }
          ]},
          { id: 'syncope-details', type: 'textarea', label: 'Describe Fainting Episodes', placeholder: 'When, where, warning signs, duration, injuries...',
            conditionalVisibility: { dependsOn: 'symptom-syncope', condition: 'notEquals', value: 'none' }
          },
          { id: 'symptom-dizziness', type: 'checkbox', label: 'Dizziness/Lightheadedness', checkboxLabel: 'Experiences dizziness or lightheadedness' },
          { id: 'symptom-fatigue', type: 'dropdown', label: 'Fatigue Level', required: true, options: [
            { value: 'none', label: 'Normal energy' },
            { value: 'mild', label: 'Mild fatigue' },
            { value: 'moderate', label: 'Moderate fatigue' },
            { value: 'severe', label: 'Severe fatigue' }
          ]},
          { id: 'symptom-edema', type: 'dropdown', label: 'Peripheral Edema (Leg Swelling)', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'trace', label: 'Trace (ankles only)' },
            { value: 'mild', label: 'Mild (ankles and feet)' },
            { value: 'moderate', label: 'Moderate (up to mid-calf)' },
            { value: 'severe', label: 'Severe (up to knee or higher)' }
          ]},
          { id: 'symptom-weight-gain', type: 'checkbox', label: 'Recent Weight Gain', checkboxLabel: 'Unexplained weight gain in past 1-2 weeks' },
          { id: 'weight-gain-amount', type: 'number', label: 'Weight Gain (lbs)', placeholder: 'Pounds gained',
            conditionalVisibility: { dependsOn: 'symptom-weight-gain', condition: 'equals', value: true }
          },
        ]
      },
      // Section 9: Other Medical History
      {
        id: 'section-medical-history',
        title: 'Other Medical History',
        description: 'Non-cardiac medical conditions',
        order: 9,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'other-conditions', type: 'multiselect', label: 'Other Medical Conditions', options: [
            { value: 'copd', label: 'COPD/Emphysema' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'thyroid', label: 'Thyroid Disease' },
            { value: 'liver', label: 'Liver Disease' },
            { value: 'stroke', label: 'Stroke/TIA' },
            { value: 'peripheral-artery', label: 'Peripheral Artery Disease' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'anemia', label: 'Anemia' },
            { value: 'gerd', label: 'GERD/Acid Reflux' },
            { value: 'depression', label: 'Depression' },
            { value: 'anxiety', label: 'Anxiety' },
            { value: 'arthritis', label: 'Arthritis' },
            { value: 'autoimmune', label: 'Autoimmune Disease' }
          ]},
          { id: 'other-conditions-details', type: 'textarea', label: 'Additional Medical History Details', placeholder: 'List any other medical conditions not mentioned above...' },
          { id: 'surgical-history', type: 'textarea', label: 'Surgical History', placeholder: 'List previous surgeries with dates...' },
          { id: 'hospitalization-history', type: 'textarea', label: 'Recent Hospitalizations', placeholder: 'List hospitalizations in the past 2 years...' },
        ]
      },
      // Section 10: Current Medications
      {
        id: 'section-medications',
        title: 'Current Medications',
        description: 'All current medications including cardiac and non-cardiac',
        order: 10,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'cardiac-meds', type: 'multiselect', label: 'Cardiac Medications', options: [
            { value: 'aspirin', label: 'Aspirin' },
            { value: 'plavix', label: 'Clopidogrel (Plavix)' },
            { value: 'eliquis', label: 'Apixaban (Eliquis)' },
            { value: 'xarelto', label: 'Rivaroxaban (Xarelto)' },
            { value: 'warfarin', label: 'Warfarin (Coumadin)' },
            { value: 'metoprolol', label: 'Metoprolol' },
            { value: 'carvedilol', label: 'Carvedilol' },
            { value: 'atenolol', label: 'Atenolol' },
            { value: 'lisinopril', label: 'Lisinopril' },
            { value: 'losartan', label: 'Losartan' },
            { value: 'entresto', label: 'Entresto' },
            { value: 'amlodipine', label: 'Amlodipine' },
            { value: 'diltiazem', label: 'Diltiazem' },
            { value: 'atorvastatin', label: 'Atorvastatin (Lipitor)' },
            { value: 'rosuvastatin', label: 'Rosuvastatin (Crestor)' },
            { value: 'furosemide', label: 'Furosemide (Lasix)' },
            { value: 'spironolactone', label: 'Spironolactone' },
            { value: 'digoxin', label: 'Digoxin' },
            { value: 'amiodarone', label: 'Amiodarone' },
            { value: 'nitro', label: 'Nitroglycerin' },
            { value: 'isosorbide', label: 'Isosorbide' },
            { value: 'hydralazine', label: 'Hydralazine' },
            { value: 'ranolazine', label: 'Ranolazine' }
          ]},
          { id: 'medication-list', type: 'textarea', label: 'Complete Medication List', required: true, placeholder: 'List ALL medications with dosages:\ne.g., Metoprolol 25mg twice daily\n        Lisinopril 10mg once daily\n        Aspirin 81mg once daily' },
          { id: 'medication-compliance', type: 'dropdown', label: 'Medication Compliance', required: true, options: [
            { value: 'excellent', label: 'Excellent (never miss doses)' },
            { value: 'good', label: 'Good (rarely miss doses)' },
            { value: 'fair', label: 'Fair (sometimes miss doses)' },
            { value: 'poor', label: 'Poor (frequently miss doses)' }
          ]},
          { id: 'otc-supplements', type: 'textarea', label: 'Over-the-Counter & Supplements', placeholder: 'List any OTC medications, vitamins, herbal supplements...' },
        ]
      },
      // Section 11: Allergies
      {
        id: 'section-allergies',
        title: 'Allergies',
        description: 'Drug, food, and environmental allergies',
        order: 11,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'has-allergies', type: 'checkbox', label: 'Known Allergies', checkboxLabel: 'Patient has known allergies' },
          { id: 'drug-allergies', type: 'textarea', label: 'Drug Allergies', placeholder: 'List drug allergies and reactions:\ne.g., Penicillin - Rash\n        Sulfa - Anaphylaxis',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: true }
          },
          { id: 'food-allergies', type: 'textarea', label: 'Food Allergies', placeholder: 'List food allergies...',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: true }
          },
          { id: 'contrast-allergy', type: 'checkbox', label: 'Contrast Dye Allergy', checkboxLabel: 'Allergic to IV contrast dye' },
          { id: 'latex-allergy', type: 'checkbox', label: 'Latex Allergy', checkboxLabel: 'Allergic to latex' },
        ]
      },
      // Section 12: Vital Signs
      {
        id: 'section-vitals',
        title: 'Vital Signs',
        description: 'Current vital sign measurements',
        order: 12,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'vital-date-time', type: 'text', label: 'Date/Time of Vitals', placeholder: 'Current date and time' },
          { id: 'vital-bp-systolic', type: 'number', label: 'Systolic BP (mmHg)', required: true, placeholder: 'e.g., 120', validation: { min: 60, max: 300 } },
          { id: 'vital-bp-diastolic', type: 'number', label: 'Diastolic BP (mmHg)', required: true, placeholder: 'e.g., 80', validation: { min: 30, max: 200 } },
          { id: 'vital-bp-position', type: 'dropdown', label: 'BP Position', options: [
            { value: 'sitting', label: 'Sitting' },
            { value: 'standing', label: 'Standing' },
            { value: 'lying', label: 'Lying' }
          ]},
          { id: 'vital-hr', type: 'number', label: 'Heart Rate (bpm)', required: true, placeholder: 'e.g., 72', validation: { min: 20, max: 300 } },
          { id: 'vital-hr-rhythm', type: 'dropdown', label: 'Heart Rhythm', required: true, options: [
            { value: 'regular', label: 'Regular' },
            { value: 'irregular', label: 'Irregular' },
            { value: 'irregularly-irregular', label: 'Irregularly Irregular' }
          ]},
          { id: 'vital-rr', type: 'number', label: 'Respiratory Rate (breaths/min)', required: true, placeholder: 'e.g., 16', validation: { min: 6, max: 60 } },
          { id: 'vital-spo2', type: 'number', label: 'Oxygen Saturation (%)', required: true, placeholder: 'e.g., 98', validation: { min: 50, max: 100 } },
          { id: 'vital-spo2-room-air', type: 'checkbox', label: 'On Room Air', checkboxLabel: 'SpO2 measured on room air' },
          { id: 'vital-o2-flow', type: 'number', label: 'Supplemental O2 (L/min)', placeholder: 'L/min',
            conditionalVisibility: { dependsOn: 'vital-spo2-room-air', condition: 'equals', value: false }
          },
          { id: 'vital-temp', type: 'number', label: 'Temperature (°F)', placeholder: 'e.g., 98.6', validation: { min: 90, max: 110 } },
          { id: 'vital-weight', type: 'number', label: 'Weight (lbs)', required: true, placeholder: 'Pounds', validation: { min: 50, max: 700 } },
          { id: 'vital-height', type: 'number', label: 'Height (inches)', required: true, placeholder: 'Inches', validation: { min: 36, max: 96 } },
          { id: 'vital-bmi', type: 'number', label: 'BMI (calculated)', placeholder: 'Auto-calculated', helpText: 'Will be calculated from height and weight' },
        ]
      },
      // Section 13: Physical Examination
      {
        id: 'section-physical-exam',
        title: 'Physical Examination',
        description: 'Cardiac physical exam findings',
        order: 13,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'exam-general', type: 'dropdown', label: 'General Appearance', options: [
            { value: 'no-distress', label: 'No acute distress' },
            { value: 'mild-distress', label: 'Mild distress' },
            { value: 'moderate-distress', label: 'Moderate distress' },
            { value: 'severe-distress', label: 'Severe distress' }
          ]},
          { id: 'exam-jvp', type: 'dropdown', label: 'Jugular Venous Pressure (JVP)', options: [
            { value: 'normal', label: 'Normal' },
            { value: 'elevated', label: 'Elevated' },
            { value: 'unable', label: 'Unable to assess' }
          ]},
          { id: 'exam-carotid', type: 'dropdown', label: 'Carotid Pulse', options: [
            { value: 'normal', label: 'Normal bilaterally' },
            { value: 'bruit-right', label: 'Bruit - Right' },
            { value: 'bruit-left', label: 'Bruit - Left' },
            { value: 'bruit-bilateral', label: 'Bruit - Bilateral' },
            { value: 'diminished', label: 'Diminished' }
          ]},
          { id: 'exam-heart-sounds', type: 'dropdown', label: 'Heart Sounds', options: [
            { value: 'normal-s1s2', label: 'Normal S1, S2' },
            { value: 's3', label: 'S3 present' },
            { value: 's4', label: 'S4 present' },
            { value: 's3s4', label: 'Both S3 and S4' },
            { value: 'distant', label: 'Distant heart sounds' }
          ]},
          { id: 'exam-murmur', type: 'checkbox', label: 'Murmur Present', checkboxLabel: 'Heart murmur detected' },
          { id: 'exam-murmur-grade', type: 'dropdown', label: 'Murmur Grade', options: [
            { value: 'grade-1', label: 'Grade I/VI' },
            { value: 'grade-2', label: 'Grade II/VI' },
            { value: 'grade-3', label: 'Grade III/VI' },
            { value: 'grade-4', label: 'Grade IV/VI' },
            { value: 'grade-5', label: 'Grade V/VI' },
            { value: 'grade-6', label: 'Grade VI/VI' }
          ], conditionalVisibility: { dependsOn: 'exam-murmur', condition: 'equals', value: true }},
          { id: 'exam-murmur-location', type: 'multiselect', label: 'Murmur Location', options: [
            { value: 'aortic', label: 'Aortic area' },
            { value: 'pulmonic', label: 'Pulmonic area' },
            { value: 'tricuspid', label: 'Tricuspid area' },
            { value: 'mitral', label: 'Mitral area' },
            { value: 'apex', label: 'Apex' }
          ], conditionalVisibility: { dependsOn: 'exam-murmur', condition: 'equals', value: true }},
          { id: 'exam-murmur-timing', type: 'dropdown', label: 'Murmur Timing', options: [
            { value: 'systolic', label: 'Systolic' },
            { value: 'diastolic', label: 'Diastolic' },
            { value: 'continuous', label: 'Continuous' }
          ], conditionalVisibility: { dependsOn: 'exam-murmur', condition: 'equals', value: true }},
          { id: 'exam-lungs', type: 'dropdown', label: 'Lung Sounds', options: [
            { value: 'clear', label: 'Clear to auscultation bilaterally' },
            { value: 'crackles-bases', label: 'Crackles at bases' },
            { value: 'crackles-diffuse', label: 'Diffuse crackles' },
            { value: 'wheezes', label: 'Wheezes' },
            { value: 'diminished', label: 'Diminished breath sounds' }
          ]},
          { id: 'exam-edema-pitting', type: 'dropdown', label: 'Peripheral Edema', options: [
            { value: 'none', label: 'None' },
            { value: 'trace', label: 'Trace' },
            { value: '1-plus', label: '1+' },
            { value: '2-plus', label: '2+' },
            { value: '3-plus', label: '3+' },
            { value: '4-plus', label: '4+' }
          ]},
          { id: 'exam-pulses', type: 'dropdown', label: 'Peripheral Pulses', options: [
            { value: 'normal', label: 'Normal bilaterally' },
            { value: 'diminished', label: 'Diminished' },
            { value: 'absent', label: 'Absent' }
          ]},
          { id: 'exam-abdomen', type: 'text', label: 'Abdominal Exam', placeholder: 'e.g., Soft, non-tender, no hepatomegaly' },
          { id: 'exam-notes', type: 'textarea', label: 'Additional Examination Notes', placeholder: 'Any other physical exam findings...' },
        ]
      },
      // Section 14: Diagnostic Tests
      {
        id: 'section-diagnostics',
        title: 'Recent Diagnostic Tests',
        description: 'Results of recent cardiac diagnostic tests',
        order: 14,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'ecg-available', type: 'checkbox', label: 'ECG Available', checkboxLabel: 'Recent ECG available for review' },
          { id: 'ecg-date', type: 'date', label: 'ECG Date',
            conditionalVisibility: { dependsOn: 'ecg-available', condition: 'equals', value: true }
          },
          { id: 'ecg-rhythm', type: 'dropdown', label: 'ECG Rhythm', options: [
            { value: 'nsr', label: 'Normal Sinus Rhythm' },
            { value: 'afib', label: 'Atrial Fibrillation' },
            { value: 'aflutter', label: 'Atrial Flutter' },
            { value: 'sinus-brady', label: 'Sinus Bradycardia' },
            { value: 'sinus-tachy', label: 'Sinus Tachycardia' },
            { value: 'paced', label: 'Paced Rhythm' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'ecg-available', condition: 'equals', value: true }},
          { id: 'ecg-findings', type: 'multiselect', label: 'ECG Abnormalities', options: [
            { value: 'lvh', label: 'Left Ventricular Hypertrophy' },
            { value: 'rvh', label: 'Right Ventricular Hypertrophy' },
            { value: 'lbbb', label: 'Left Bundle Branch Block' },
            { value: 'rbbb', label: 'Right Bundle Branch Block' },
            { value: 'st-elevation', label: 'ST Elevation' },
            { value: 'st-depression', label: 'ST Depression' },
            { value: 't-wave-inversion', label: 'T Wave Inversion' },
            { value: 'q-waves', label: 'Pathologic Q Waves' },
            { value: 'prolonged-qt', label: 'Prolonged QT' },
            { value: 'first-degree-block', label: 'First Degree AV Block' },
            { value: 'second-degree-block', label: 'Second Degree AV Block' },
            { value: 'third-degree-block', label: 'Third Degree AV Block' },
            { value: 'none', label: 'None' }
          ], conditionalVisibility: { dependsOn: 'ecg-available', condition: 'equals', value: true }},
          { id: 'echo-available', type: 'checkbox', label: 'Echocardiogram Available', checkboxLabel: 'Recent echo available' },
          { id: 'echo-date', type: 'date', label: 'Echo Date',
            conditionalVisibility: { dependsOn: 'echo-available', condition: 'equals', value: true }
          },
          { id: 'echo-ef', type: 'number', label: 'Ejection Fraction (%)', placeholder: 'e.g., 55', validation: { min: 5, max: 80 },
            conditionalVisibility: { dependsOn: 'echo-available', condition: 'equals', value: true }
          },
          { id: 'echo-lv-function', type: 'dropdown', label: 'LV Systolic Function', options: [
            { value: 'normal', label: 'Normal (EF ≥55%)' },
            { value: 'mildly-reduced', label: 'Mildly Reduced (EF 45-54%)' },
            { value: 'moderately-reduced', label: 'Moderately Reduced (EF 30-44%)' },
            { value: 'severely-reduced', label: 'Severely Reduced (EF <30%)' }
          ], conditionalVisibility: { dependsOn: 'echo-available', condition: 'equals', value: true }},
          { id: 'echo-wall-motion', type: 'dropdown', label: 'Wall Motion', options: [
            { value: 'normal', label: 'Normal' },
            { value: 'hypokinesis', label: 'Hypokinesis' },
            { value: 'akinesis', label: 'Akinesis' },
            { value: 'dyskinesis', label: 'Dyskinesis' }
          ], conditionalVisibility: { dependsOn: 'echo-available', condition: 'equals', value: true }},
          { id: 'echo-valve-findings', type: 'textarea', label: 'Valve Findings', placeholder: 'Describe any valve abnormalities...',
            conditionalVisibility: { dependsOn: 'echo-available', condition: 'equals', value: true }
          },
          { id: 'stress-test-available', type: 'checkbox', label: 'Stress Test Available', checkboxLabel: 'Recent stress test available' },
          { id: 'stress-test-type', type: 'dropdown', label: 'Stress Test Type', options: [
            { value: 'exercise-ecg', label: 'Exercise ECG' },
            { value: 'stress-echo', label: 'Stress Echocardiogram' },
            { value: 'nuclear', label: 'Nuclear Stress Test' },
            { value: 'pharmacologic', label: 'Pharmacologic Stress' }
          ], conditionalVisibility: { dependsOn: 'stress-test-available', condition: 'equals', value: true }},
          { id: 'stress-test-result', type: 'dropdown', label: 'Stress Test Result', options: [
            { value: 'negative', label: 'Negative for ischemia' },
            { value: 'positive', label: 'Positive for ischemia' },
            { value: 'equivocal', label: 'Equivocal' },
            { value: 'incomplete', label: 'Incomplete/Non-diagnostic' }
          ], conditionalVisibility: { dependsOn: 'stress-test-available', condition: 'equals', value: true }},
          { id: 'cath-available', type: 'checkbox', label: 'Cardiac Catheterization Available', checkboxLabel: 'Recent cath available' },
          { id: 'cath-findings', type: 'textarea', label: 'Catheterization Findings', placeholder: 'Describe coronary anatomy, interventions...',
            conditionalVisibility: { dependsOn: 'cath-available', condition: 'equals', value: true }
          },
        ]
      },
      // Section 15: Labs
      {
        id: 'section-labs',
        title: 'Laboratory Results',
        description: 'Recent laboratory values',
        order: 15,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'lab-date', type: 'date', label: 'Lab Date' },
          { id: 'lab-bnp', type: 'number', label: 'BNP (pg/mL)', placeholder: 'e.g., 150' },
          { id: 'lab-troponin', type: 'text', label: 'Troponin', placeholder: 'e.g., <0.01' },
          { id: 'lab-creatinine', type: 'number', label: 'Creatinine (mg/dL)', placeholder: 'e.g., 1.0' },
          { id: 'lab-gfr', type: 'number', label: 'eGFR (mL/min/1.73m²)', placeholder: 'e.g., 60' },
          { id: 'lab-potassium', type: 'number', label: 'Potassium (mEq/L)', placeholder: 'e.g., 4.0' },
          { id: 'lab-sodium', type: 'number', label: 'Sodium (mEq/L)', placeholder: 'e.g., 140' },
          { id: 'lab-hemoglobin', type: 'number', label: 'Hemoglobin (g/dL)', placeholder: 'e.g., 13.5' },
          { id: 'lab-hba1c', type: 'number', label: 'HbA1c (%)', placeholder: 'e.g., 6.5' },
          { id: 'lab-total-chol', type: 'number', label: 'Total Cholesterol (mg/dL)', placeholder: 'e.g., 180' },
          { id: 'lab-ldl', type: 'number', label: 'LDL Cholesterol (mg/dL)', placeholder: 'e.g., 100' },
          { id: 'lab-hdl', type: 'number', label: 'HDL Cholesterol (mg/dL)', placeholder: 'e.g., 50' },
          { id: 'lab-triglycerides', type: 'number', label: 'Triglycerides (mg/dL)', placeholder: 'e.g., 150' },
          { id: 'lab-tsh', type: 'number', label: 'TSH (mIU/L)', placeholder: 'e.g., 2.0' },
          { id: 'lab-inr', type: 'number', label: 'INR', placeholder: 'e.g., 2.5 (if on warfarin)' },
        ]
      },
      // Section 16: Assessment & Plan
      {
        id: 'section-assessment',
        title: 'Clinical Assessment & Plan',
        description: 'Physician assessment, diagnosis, and treatment plan',
        order: 16,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'risk-stratification', type: 'dropdown', label: 'Cardiac Risk Stratification', required: true, options: [
            { value: 'low', label: 'Low Risk' },
            { value: 'intermediate', label: 'Intermediate Risk' },
            { value: 'high', label: 'High Risk' },
            { value: 'critical', label: 'Critical' }
          ]},
          { id: 'primary-diagnosis', type: 'textarea', label: 'Primary Cardiac Diagnosis', required: true, placeholder: 'List primary cardiac diagnosis...' },
          { id: 'secondary-diagnoses', type: 'textarea', label: 'Secondary Diagnoses', placeholder: 'List other relevant diagnoses...' },
          { id: 'plan-medications', type: 'textarea', label: 'Medication Changes', placeholder: 'List any medication changes:\n- Add:\n- Stop:\n- Adjust:' },
          { id: 'plan-tests', type: 'multiselect', label: 'Ordered Tests', options: [
            { value: 'ecg', label: 'ECG' },
            { value: 'echo', label: 'Echocardiogram' },
            { value: 'stress-test', label: 'Stress Test' },
            { value: 'holter', label: 'Holter Monitor' },
            { value: 'event-monitor', label: 'Event Monitor' },
            { value: 'cta', label: 'CT Angiography' },
            { value: 'mri', label: 'Cardiac MRI' },
            { value: 'cath', label: 'Cardiac Catheterization' },
            { value: 'labs', label: 'Laboratory Tests' },
            { value: 'sleep-study', label: 'Sleep Study' }
          ]},
          { id: 'plan-referrals', type: 'multiselect', label: 'Referrals', options: [
            { value: 'ep', label: 'Electrophysiology' },
            { value: 'interventional', label: 'Interventional Cardiology' },
            { value: 'ct-surgery', label: 'Cardiothoracic Surgery' },
            { value: 'heart-failure', label: 'Heart Failure Clinic' },
            { value: 'cardiac-rehab', label: 'Cardiac Rehabilitation' },
            { value: 'nutrition', label: 'Nutrition/Dietitian' },
            { value: 'diabetes', label: 'Diabetes/Endocrine' },
            { value: 'nephrology', label: 'Nephrology' },
            { value: 'pulmonology', label: 'Pulmonology' }
          ]},
          { id: 'plan-lifestyle', type: 'textarea', label: 'Lifestyle Recommendations', placeholder: 'Diet, exercise, smoking cessation, etc...' },
          { id: 'follow-up-timing', type: 'dropdown', label: 'Follow-up Timing', required: true, options: [
            { value: '1-week', label: '1 Week' },
            { value: '2-weeks', label: '2 Weeks' },
            { value: '1-month', label: '1 Month' },
            { value: '2-months', label: '2 Months' },
            { value: '3-months', label: '3 Months' },
            { value: '6-months', label: '6 Months' },
            { value: '1-year', label: '1 Year' },
            { value: 'prn', label: 'As Needed' }
          ]},
          { id: 'urgent-flag', type: 'checkbox', label: 'Urgent Attention Required', checkboxLabel: 'Flag for urgent follow-up or intervention' },
          { id: 'clinical-notes', type: 'textarea', label: 'Additional Clinical Notes', placeholder: 'Any other relevant notes...' },
        ]
      },
    ]
  },

  // ==========================================
  // 2. GENERAL OPD REGISTRATION FORM
  // ==========================================
  {
    id: 'general-opd-v1',
    name: 'General OPD Registration',
    description: 'Comprehensive outpatient department registration with complete medical history, review of systems, and triage assessment',
    category: 'General',
    version: '2.0.0',
    author: 'System Admin',
    icon: 'local_hospital',
    color: '#1976d2',
    tags: ['opd', 'registration', 'outpatient', 'general', 'intake'],
    usageCount: 2845,
    createdAt: '2024-01-10T09:00:00Z',
    sections: [
      // Section 1: Registration Type
      {
        id: 'section-reg-type',
        title: 'Registration Type',
        description: 'Type of visit and registration',
        order: 1,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'visit-type', type: 'dropdown', label: 'Visit Type', required: true, options: [
            { value: 'new-patient', label: 'New Patient' },
            { value: 'follow-up', label: 'Follow-up Visit' },
            { value: 'referral', label: 'Referral' },
            { value: 'walk-in', label: 'Walk-in' },
            { value: 'emergency-transfer', label: 'Emergency Transfer' },
            { value: 'scheduled', label: 'Scheduled Appointment' }
          ]},
          { id: 'existing-mrn', type: 'text', label: 'Existing MRN', placeholder: 'Enter existing MRN',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'equals', value: 'follow-up' }
          },
          { id: 'referral-source', type: 'text', label: 'Referred By', placeholder: 'Referring doctor/hospital',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'equals', value: 'referral' }
          },
          { id: 'referral-letter', type: 'checkbox', label: 'Referral Letter', checkboxLabel: 'Referral letter available',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'equals', value: 'referral' }
          },
          { id: 'appointment-time', type: 'text', label: 'Appointment Time', placeholder: 'HH:MM AM/PM',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'equals', value: 'scheduled' }
          },
        ]
      },
      // Section 2: Patient Demographics
      {
        id: 'section-patient-info',
        title: 'Patient Demographics',
        description: 'Complete patient identification',
        order: 2,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'patient-title', type: 'dropdown', label: 'Title', options: [
            { value: 'mr', label: 'Mr.' },
            { value: 'mrs', label: 'Mrs.' },
            { value: 'ms', label: 'Ms.' },
            { value: 'dr', label: 'Dr.' },
            { value: 'master', label: 'Master' },
            { value: 'miss', label: 'Miss' }
          ]},
          { id: 'first-name', type: 'text', label: 'First Name', required: true, placeholder: 'Enter first name' },
          { id: 'middle-name', type: 'text', label: 'Middle Name', placeholder: 'Enter middle name' },
          { id: 'last-name', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter last name' },
          { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
          { id: 'age', type: 'number', label: 'Age', required: true, placeholder: 'Years', validation: { min: 0, max: 150 } },
          { id: 'age-months', type: 'number', label: 'Age (Months)', placeholder: 'For children under 2 years' },
          { id: 'gender', type: 'dropdown', label: 'Gender', required: true, options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'blood-group', type: 'dropdown', label: 'Blood Group', options: [
            { value: 'a-pos', label: 'A+' },
            { value: 'a-neg', label: 'A-' },
            { value: 'b-pos', label: 'B+' },
            { value: 'b-neg', label: 'B-' },
            { value: 'ab-pos', label: 'AB+' },
            { value: 'ab-neg', label: 'AB-' },
            { value: 'o-pos', label: 'O+' },
            { value: 'o-neg', label: 'O-' },
            { value: 'unknown', label: 'Unknown' }
          ]},
          { id: 'marital-status', type: 'dropdown', label: 'Marital Status', options: [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
            { value: 'separated', label: 'Separated' }
          ]},
          { id: 'nationality', type: 'text', label: 'Nationality', placeholder: 'Enter nationality' },
          { id: 'id-type', type: 'dropdown', label: 'ID Type', required: true, options: [
            { value: 'national-id', label: 'National ID' },
            { value: 'passport', label: 'Passport' },
            { value: 'drivers-license', label: "Driver's License" },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'id-number', type: 'text', label: 'ID Number', required: true, placeholder: 'Enter ID number' },
          { id: 'occupation', type: 'text', label: 'Occupation', placeholder: 'Enter occupation' },
          { id: 'employer', type: 'text', label: 'Employer/Company', placeholder: 'Enter employer name' },
        ]
      },
      // Section 3: Contact Information
      {
        id: 'section-contact',
        title: 'Contact Information',
        description: 'Phone, email, and address details',
        order: 3,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'mobile-primary', type: 'text', label: 'Primary Mobile', required: true, placeholder: '+XX-XXXXXXXXXX' },
          { id: 'mobile-secondary', type: 'text', label: 'Secondary Mobile', placeholder: '+XX-XXXXXXXXXX' },
          { id: 'home-phone', type: 'text', label: 'Home Phone', placeholder: 'Home telephone' },
          { id: 'work-phone', type: 'text', label: 'Work Phone', placeholder: 'Office telephone' },
          { id: 'email', type: 'text', label: 'Email Address', placeholder: 'email@example.com' },
          { id: 'address-line1', type: 'text', label: 'Address Line 1', required: true, placeholder: 'Street address' },
          { id: 'address-line2', type: 'text', label: 'Address Line 2', placeholder: 'Apartment, suite, unit, etc.' },
          { id: 'city', type: 'text', label: 'City', required: true, placeholder: 'City' },
          { id: 'state', type: 'text', label: 'State/Province', required: true, placeholder: 'State or Province' },
          { id: 'postal-code', type: 'text', label: 'Postal/ZIP Code', required: true, placeholder: 'Postal code' },
          { id: 'country', type: 'text', label: 'Country', required: true, placeholder: 'Country' },
        ]
      },
      // Section 4: Emergency Contact
      {
        id: 'section-emergency',
        title: 'Emergency Contact',
        description: 'Person to contact in emergencies',
        order: 4,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'emergency-name', type: 'text', label: 'Full Name', required: true, placeholder: 'Emergency contact name' },
          { id: 'emergency-relationship', type: 'dropdown', label: 'Relationship', required: true, options: [
            { value: 'spouse', label: 'Spouse' },
            { value: 'parent', label: 'Parent' },
            { value: 'child', label: 'Child' },
            { value: 'sibling', label: 'Sibling' },
            { value: 'relative', label: 'Other Relative' },
            { value: 'friend', label: 'Friend' },
            { value: 'colleague', label: 'Colleague' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'emergency-phone1', type: 'text', label: 'Primary Phone', required: true, placeholder: 'Contact number' },
          { id: 'emergency-phone2', type: 'text', label: 'Alternate Phone', placeholder: 'Alternate contact' },
          { id: 'emergency-address', type: 'textarea', label: 'Address', placeholder: 'Full address if different from patient' },
        ]
      },
      // Section 5: Insurance Information
      {
        id: 'section-insurance',
        title: 'Insurance & Payment',
        description: 'Health insurance and billing information',
        order: 5,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'payment-type', type: 'dropdown', label: 'Payment Type', required: true, options: [
            { value: 'self-pay', label: 'Self Pay (Cash)' },
            { value: 'insurance', label: 'Health Insurance' },
            { value: 'corporate', label: 'Corporate/Employer' },
            { value: 'government', label: 'Government Program' },
            { value: 'charity', label: 'Charity/Waiver' }
          ]},
          { id: 'insurance-provider', type: 'text', label: 'Insurance Company', placeholder: 'Insurance provider name',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'insurance-plan', type: 'text', label: 'Plan Name', placeholder: 'Insurance plan name',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'policy-number', type: 'text', label: 'Policy Number', placeholder: 'Policy/Member ID',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'group-number', type: 'text', label: 'Group Number', placeholder: 'Group number',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'insurance-phone', type: 'text', label: 'Insurance Phone', placeholder: 'Customer service number',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'policy-holder-name', type: 'text', label: 'Policy Holder Name', placeholder: 'If different from patient',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'policy-holder-dob', type: 'date', label: 'Policy Holder DOB',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'insurance' }
          },
          { id: 'employer-name', type: 'text', label: 'Employer/Company Name', placeholder: 'Company name',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'corporate' }
          },
          { id: 'employee-id', type: 'text', label: 'Employee ID', placeholder: 'Employee ID number',
            conditionalVisibility: { dependsOn: 'payment-type', condition: 'equals', value: 'corporate' }
          },
        ]
      },
      // Section 6: Chief Complaint
      {
        id: 'section-chief-complaint',
        title: 'Chief Complaint',
        description: 'Primary reason for visit',
        order: 6,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'department', type: 'dropdown', label: 'Department', required: true, options: [
            { value: 'general-medicine', label: 'General Medicine' },
            { value: 'family-medicine', label: 'Family Medicine' },
            { value: 'internal-medicine', label: 'Internal Medicine' },
            { value: 'surgery', label: 'General Surgery' },
            { value: 'orthopedics', label: 'Orthopedics' },
            { value: 'gynecology', label: 'Gynecology' },
            { value: 'obstetrics', label: 'Obstetrics' },
            { value: 'pediatrics', label: 'Pediatrics' },
            { value: 'ent', label: 'ENT' },
            { value: 'ophthalmology', label: 'Ophthalmology' },
            { value: 'dermatology', label: 'Dermatology' },
            { value: 'cardiology', label: 'Cardiology' },
            { value: 'neurology', label: 'Neurology' },
            { value: 'gastroenterology', label: 'Gastroenterology' },
            { value: 'urology', label: 'Urology' },
            { value: 'nephrology', label: 'Nephrology' },
            { value: 'pulmonology', label: 'Pulmonology' },
            { value: 'endocrinology', label: 'Endocrinology' },
            { value: 'psychiatry', label: 'Psychiatry' },
            { value: 'dental', label: 'Dental' },
            { value: 'physiotherapy', label: 'Physiotherapy' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'chief-complaint', type: 'textarea', label: 'Chief Complaint', required: true, placeholder: 'Describe the main reason for this visit in detail...', helpText: 'What brings the patient to the hospital today?' },
          { id: 'complaint-duration', type: 'text', label: 'Duration of Symptoms', required: true, placeholder: 'e.g., 3 days, 2 weeks, 1 month' },
          { id: 'complaint-onset', type: 'dropdown', label: 'Onset', required: true, options: [
            { value: 'sudden', label: 'Sudden' },
            { value: 'gradual', label: 'Gradual' },
            { value: 'intermittent', label: 'Intermittent' },
            { value: 'chronic', label: 'Chronic/Long-standing' }
          ]},
          { id: 'complaint-severity', type: 'dropdown', label: 'Severity', required: true, options: [
            { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe', label: 'Severe' },
            { value: 'very-severe', label: 'Very Severe' }
          ]},
          { id: 'complaint-progression', type: 'dropdown', label: 'Progression', options: [
            { value: 'stable', label: 'Stable' },
            { value: 'improving', label: 'Improving' },
            { value: 'worsening', label: 'Worsening' },
            { value: 'fluctuating', label: 'Fluctuating' }
          ]},
          { id: 'aggravating-factors', type: 'textarea', label: 'Aggravating Factors', placeholder: 'What makes symptoms worse?' },
          { id: 'relieving-factors', type: 'textarea', label: 'Relieving Factors', placeholder: 'What makes symptoms better?' },
          { id: 'associated-symptoms', type: 'textarea', label: 'Associated Symptoms', placeholder: 'List any other symptoms accompanying the main complaint' },
          { id: 'prior-treatment', type: 'textarea', label: 'Prior Treatment', placeholder: 'Any treatment already tried for this condition?' },
        ]
      },
      // Section 7: Vital Signs
      {
        id: 'section-vitals',
        title: 'Vital Signs',
        description: 'Current vital sign measurements',
        order: 7,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'vitals-time', type: 'text', label: 'Time Recorded', placeholder: 'HH:MM' },
          { id: 'bp-systolic', type: 'number', label: 'BP Systolic (mmHg)', required: true, placeholder: 'e.g., 120', validation: { min: 60, max: 300 } },
          { id: 'bp-diastolic', type: 'number', label: 'BP Diastolic (mmHg)', required: true, placeholder: 'e.g., 80', validation: { min: 30, max: 200 } },
          { id: 'pulse', type: 'number', label: 'Pulse Rate (bpm)', required: true, placeholder: 'e.g., 72', validation: { min: 20, max: 250 } },
          { id: 'temperature', type: 'number', label: 'Temperature (°F)', required: true, placeholder: 'e.g., 98.6', validation: { min: 90, max: 110 } },
          { id: 'temp-route', type: 'dropdown', label: 'Temperature Route', options: [
            { value: 'oral', label: 'Oral' },
            { value: 'axillary', label: 'Axillary' },
            { value: 'rectal', label: 'Rectal' },
            { value: 'tympanic', label: 'Tympanic' },
            { value: 'temporal', label: 'Temporal' }
          ]},
          { id: 'respiratory-rate', type: 'number', label: 'Respiratory Rate (breaths/min)', required: true, placeholder: 'e.g., 16', validation: { min: 6, max: 60 } },
          { id: 'spo2', type: 'number', label: 'SpO2 (%)', required: true, placeholder: 'e.g., 98', validation: { min: 50, max: 100 } },
          { id: 'spo2-on-oxygen', type: 'checkbox', label: 'On Supplemental O2', checkboxLabel: 'Patient is on supplemental oxygen' },
          { id: 'oxygen-flow', type: 'number', label: 'O2 Flow Rate (L/min)', placeholder: 'L/min',
            conditionalVisibility: { dependsOn: 'spo2-on-oxygen', condition: 'equals', value: true }
          },
          { id: 'weight-kg', type: 'number', label: 'Weight (kg)', required: true, placeholder: 'e.g., 70', validation: { min: 0.5, max: 400 } },
          { id: 'height-cm', type: 'number', label: 'Height (cm)', required: true, placeholder: 'e.g., 170', validation: { min: 30, max: 250 } },
          { id: 'bmi', type: 'number', label: 'BMI (calculated)', placeholder: 'Auto-calculated' },
          { id: 'pain-score', type: 'dropdown', label: 'Pain Score (0-10)', options: [
            { value: '0', label: '0 - No Pain' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5 - Moderate' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10 - Worst Pain' }
          ]},
          { id: 'pain-location', type: 'text', label: 'Pain Location', placeholder: 'Where is the pain?' },
          { id: 'blood-glucose', type: 'number', label: 'Blood Glucose (mg/dL)', placeholder: 'Random blood sugar' },
          { id: 'glucose-fasting', type: 'checkbox', label: 'Fasting', checkboxLabel: 'Fasting blood glucose' },
        ]
      },
      // Section 8: Past Medical History
      {
        id: 'section-pmh',
        title: 'Past Medical History',
        description: 'Previous and ongoing medical conditions',
        order: 8,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'chronic-conditions', type: 'multiselect', label: 'Chronic Conditions', options: [
            { value: 'diabetes', label: 'Diabetes Mellitus' },
            { value: 'hypertension', label: 'Hypertension' },
            { value: 'heart-disease', label: 'Heart Disease' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'copd', label: 'COPD' },
            { value: 'thyroid', label: 'Thyroid Disorder' },
            { value: 'kidney-disease', label: 'Kidney Disease' },
            { value: 'liver-disease', label: 'Liver Disease' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'stroke', label: 'Stroke' },
            { value: 'epilepsy', label: 'Epilepsy/Seizures' },
            { value: 'arthritis', label: 'Arthritis' },
            { value: 'depression', label: 'Depression' },
            { value: 'anxiety', label: 'Anxiety' },
            { value: 'tuberculosis', label: 'Tuberculosis' },
            { value: 'hepatitis', label: 'Hepatitis' },
            { value: 'hiv', label: 'HIV/AIDS' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'pmh-details', type: 'textarea', label: 'Medical History Details', placeholder: 'Provide details about medical conditions listed above or any others not listed...' },
          { id: 'surgical-history', type: 'textarea', label: 'Surgical History', placeholder: 'List all previous surgeries with approximate dates:\ne.g., Appendectomy - 2015\n        Cesarean section - 2018' },
          { id: 'hospitalization-history', type: 'textarea', label: 'Previous Hospitalizations', placeholder: 'List previous hospital admissions with reasons and dates' },
          { id: 'blood-transfusion', type: 'checkbox', label: 'Blood Transfusion', checkboxLabel: 'History of blood transfusion' },
          { id: 'transfusion-details', type: 'text', label: 'Transfusion Details', placeholder: 'When and why?',
            conditionalVisibility: { dependsOn: 'blood-transfusion', condition: 'equals', value: true }
          },
        ]
      },
      // Section 9: Medications
      {
        id: 'section-medications',
        title: 'Current Medications',
        description: 'All current medications and supplements',
        order: 9,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'taking-medications', type: 'checkbox', label: 'On Medications', checkboxLabel: 'Patient is currently taking medications' },
          { id: 'current-medications', type: 'textarea', label: 'Current Medications', placeholder: 'List all medications with doses and frequency:\ne.g., Metformin 500mg twice daily\n        Amlodipine 5mg once daily\n        Omeprazole 20mg before breakfast',
            conditionalVisibility: { dependsOn: 'taking-medications', condition: 'equals', value: true }
          },
          { id: 'otc-medications', type: 'textarea', label: 'Over-the-Counter Medications', placeholder: 'Pain relievers, antacids, etc.' },
          { id: 'supplements', type: 'textarea', label: 'Vitamins & Supplements', placeholder: 'Vitamins, minerals, herbal supplements...' },
          { id: 'medication-compliance', type: 'dropdown', label: 'Medication Compliance', options: [
            { value: 'excellent', label: 'Excellent - Never misses doses' },
            { value: 'good', label: 'Good - Rarely misses doses' },
            { value: 'fair', label: 'Fair - Sometimes misses doses' },
            { value: 'poor', label: 'Poor - Frequently misses doses' }
          ]},
        ]
      },
      // Section 10: Allergies
      {
        id: 'section-allergies',
        title: 'Allergies',
        description: 'Drug, food, and environmental allergies',
        order: 10,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'has-allergies', type: 'dropdown', label: 'Known Allergies', required: true, options: [
            { value: 'none', label: 'No Known Allergies (NKA)' },
            { value: 'nkda', label: 'No Known Drug Allergies (NKDA)' },
            { value: 'yes', label: 'Yes - Has Allergies' }
          ]},
          { id: 'drug-allergies', type: 'textarea', label: 'Drug Allergies', placeholder: 'Drug name → Reaction\ne.g., Penicillin → Rash\n        Sulfa → Difficulty breathing',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: 'yes' }
          },
          { id: 'food-allergies', type: 'textarea', label: 'Food Allergies', placeholder: 'List food allergies and reactions',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: 'yes' }
          },
          { id: 'environmental-allergies', type: 'textarea', label: 'Environmental Allergies', placeholder: 'Dust, pollen, latex, etc.',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: 'yes' }
          },
          { id: 'allergy-severity', type: 'dropdown', label: 'Worst Allergic Reaction', options: [
            { value: 'mild', label: 'Mild (rash, itching)' },
            { value: 'moderate', label: 'Moderate (swelling, hives)' },
            { value: 'severe', label: 'Severe (difficulty breathing)' },
            { value: 'anaphylaxis', label: 'Anaphylaxis' }
          ], conditionalVisibility: { dependsOn: 'has-allergies', condition: 'equals', value: 'yes' }},
        ]
      },
      // Section 11: Family History
      {
        id: 'section-family-history',
        title: 'Family History',
        description: 'Medical conditions in blood relatives',
        order: 11,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'family-conditions', type: 'multiselect', label: 'Family Medical Conditions', options: [
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'hypertension', label: 'Hypertension' },
            { value: 'heart-disease', label: 'Heart Disease' },
            { value: 'stroke', label: 'Stroke' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'thyroid', label: 'Thyroid Disease' },
            { value: 'kidney-disease', label: 'Kidney Disease' },
            { value: 'mental-health', label: 'Mental Health Conditions' },
            { value: 'epilepsy', label: 'Epilepsy' },
            { value: 'tuberculosis', label: 'Tuberculosis' },
            { value: 'genetic', label: 'Genetic Disorders' },
            { value: 'unknown', label: 'Unknown/Adopted' }
          ]},
          { id: 'family-history-details', type: 'textarea', label: 'Family History Details', placeholder: 'Specify which relatives have which conditions:\ne.g., Father - Diabetes, died of heart attack at 60\n        Mother - Hypertension, Thyroid\n        Sibling - Asthma' },
        ]
      },
      // Section 12: Social History
      {
        id: 'section-social-history',
        title: 'Social History',
        description: 'Lifestyle and social factors',
        order: 12,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'smoking-status', type: 'dropdown', label: 'Smoking Status', required: true, options: [
            { value: 'never', label: 'Never Smoked' },
            { value: 'former', label: 'Former Smoker' },
            { value: 'current', label: 'Current Smoker' }
          ]},
          { id: 'smoking-amount', type: 'text', label: 'Cigarettes per Day', placeholder: 'Number per day',
            conditionalVisibility: { dependsOn: 'smoking-status', condition: 'equals', value: 'current' }
          },
          { id: 'smoking-years', type: 'number', label: 'Years of Smoking', placeholder: 'Years',
            conditionalVisibility: { dependsOn: 'smoking-status', condition: 'in', value: ['former', 'current'] }
          },
          { id: 'quit-date', type: 'text', label: 'Quit Date', placeholder: 'Month/Year',
            conditionalVisibility: { dependsOn: 'smoking-status', condition: 'equals', value: 'former' }
          },
          { id: 'alcohol-use', type: 'dropdown', label: 'Alcohol Use', required: true, options: [
            { value: 'none', label: 'None' },
            { value: 'occasional', label: 'Occasional (Social)' },
            { value: 'moderate', label: 'Moderate (1-2 drinks/day)' },
            { value: 'heavy', label: 'Heavy (>2 drinks/day)' },
            { value: 'former', label: 'Former Drinker' }
          ]},
          { id: 'alcohol-type', type: 'text', label: 'Type of Alcohol', placeholder: 'Beer, wine, spirits...',
            conditionalVisibility: { dependsOn: 'alcohol-use', condition: 'in', value: ['occasional', 'moderate', 'heavy'] }
          },
          { id: 'drug-use', type: 'checkbox', label: 'Recreational Drug Use', checkboxLabel: 'History of recreational drug use' },
          { id: 'drug-details', type: 'text', label: 'Substances Used', placeholder: 'Specify substances',
            conditionalVisibility: { dependsOn: 'drug-use', condition: 'equals', value: true }
          },
          { id: 'exercise', type: 'dropdown', label: 'Exercise Frequency', options: [
            { value: 'none', label: 'Sedentary / None' },
            { value: 'light', label: 'Light (1-2x/week)' },
            { value: 'moderate', label: 'Moderate (3-4x/week)' },
            { value: 'active', label: 'Active (5+x/week)' }
          ]},
          { id: 'diet', type: 'dropdown', label: 'Diet Type', options: [
            { value: 'regular', label: 'Regular / No restrictions' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'diabetic', label: 'Diabetic Diet' },
            { value: 'low-salt', label: 'Low Salt' },
            { value: 'low-fat', label: 'Low Fat' },
            { value: 'gluten-free', label: 'Gluten Free' },
            { value: 'halal', label: 'Halal' },
            { value: 'kosher', label: 'Kosher' }
          ]},
          { id: 'living-situation', type: 'dropdown', label: 'Living Situation', options: [
            { value: 'alone', label: 'Lives Alone' },
            { value: 'spouse', label: 'With Spouse/Partner' },
            { value: 'family', label: 'With Family' },
            { value: 'roommates', label: 'With Roommates' },
            { value: 'assisted', label: 'Assisted Living' },
            { value: 'nursing-home', label: 'Nursing Home' }
          ]},
          { id: 'occupation-hazards', type: 'textarea', label: 'Occupational Hazards', placeholder: 'Exposure to chemicals, dust, radiation, etc.' },
        ]
      },
      // Section 13: Review of Systems
      {
        id: 'section-ros',
        title: 'Review of Systems',
        description: 'Comprehensive symptom review',
        order: 13,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'ros-constitutional', type: 'multiselect', label: 'Constitutional', options: [
            { value: 'fever', label: 'Fever' },
            { value: 'chills', label: 'Chills' },
            { value: 'fatigue', label: 'Fatigue' },
            { value: 'weight-loss', label: 'Weight Loss' },
            { value: 'weight-gain', label: 'Weight Gain' },
            { value: 'night-sweats', label: 'Night Sweats' },
            { value: 'appetite-loss', label: 'Loss of Appetite' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-heent', type: 'multiselect', label: 'Head/Eyes/Ears/Nose/Throat', options: [
            { value: 'headache', label: 'Headache' },
            { value: 'vision-changes', label: 'Vision Changes' },
            { value: 'hearing-loss', label: 'Hearing Loss' },
            { value: 'ear-pain', label: 'Ear Pain' },
            { value: 'nasal-congestion', label: 'Nasal Congestion' },
            { value: 'sore-throat', label: 'Sore Throat' },
            { value: 'difficulty-swallowing', label: 'Difficulty Swallowing' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-cardiovascular', type: 'multiselect', label: 'Cardiovascular', options: [
            { value: 'chest-pain', label: 'Chest Pain' },
            { value: 'palpitations', label: 'Palpitations' },
            { value: 'shortness-breath', label: 'Shortness of Breath' },
            { value: 'edema', label: 'Leg Swelling' },
            { value: 'orthopnea', label: 'Difficulty Breathing Lying Flat' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-respiratory', type: 'multiselect', label: 'Respiratory', options: [
            { value: 'cough', label: 'Cough' },
            { value: 'sputum', label: 'Sputum Production' },
            { value: 'hemoptysis', label: 'Coughing Blood' },
            { value: 'wheezing', label: 'Wheezing' },
            { value: 'dyspnea', label: 'Shortness of Breath' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-gi', type: 'multiselect', label: 'Gastrointestinal', options: [
            { value: 'nausea', label: 'Nausea' },
            { value: 'vomiting', label: 'Vomiting' },
            { value: 'diarrhea', label: 'Diarrhea' },
            { value: 'constipation', label: 'Constipation' },
            { value: 'abdominal-pain', label: 'Abdominal Pain' },
            { value: 'blood-stool', label: 'Blood in Stool' },
            { value: 'heartburn', label: 'Heartburn' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-gu', type: 'multiselect', label: 'Genitourinary', options: [
            { value: 'dysuria', label: 'Painful Urination' },
            { value: 'frequency', label: 'Urinary Frequency' },
            { value: 'urgency', label: 'Urinary Urgency' },
            { value: 'hematuria', label: 'Blood in Urine' },
            { value: 'incontinence', label: 'Incontinence' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-musculoskeletal', type: 'multiselect', label: 'Musculoskeletal', options: [
            { value: 'joint-pain', label: 'Joint Pain' },
            { value: 'muscle-pain', label: 'Muscle Pain' },
            { value: 'back-pain', label: 'Back Pain' },
            { value: 'stiffness', label: 'Stiffness' },
            { value: 'swelling', label: 'Joint Swelling' },
            { value: 'weakness', label: 'Weakness' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-neurological', type: 'multiselect', label: 'Neurological', options: [
            { value: 'headache', label: 'Headache' },
            { value: 'dizziness', label: 'Dizziness' },
            { value: 'numbness', label: 'Numbness/Tingling' },
            { value: 'weakness', label: 'Weakness' },
            { value: 'seizures', label: 'Seizures' },
            { value: 'memory-problems', label: 'Memory Problems' },
            { value: 'tremor', label: 'Tremor' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-skin', type: 'multiselect', label: 'Skin', options: [
            { value: 'rash', label: 'Rash' },
            { value: 'itching', label: 'Itching' },
            { value: 'lesions', label: 'Skin Lesions' },
            { value: 'bruising', label: 'Easy Bruising' },
            { value: 'wounds', label: 'Non-healing Wounds' },
            { value: 'none', label: 'None' }
          ]},
          { id: 'ros-psychiatric', type: 'multiselect', label: 'Psychiatric', options: [
            { value: 'depression', label: 'Depression' },
            { value: 'anxiety', label: 'Anxiety' },
            { value: 'sleep-problems', label: 'Sleep Problems' },
            { value: 'mood-changes', label: 'Mood Changes' },
            { value: 'suicidal-thoughts', label: 'Suicidal Thoughts' },
            { value: 'none', label: 'None' }
          ]},
        ]
      },
      // Section 14: Women's Health (conditional)
      {
        id: 'section-womens-health',
        title: "Women's Health",
        description: 'Menstrual and reproductive history (for female patients)',
        order: 14,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'lmp', type: 'date', label: 'Last Menstrual Period (LMP)' },
          { id: 'menstrual-regularity', type: 'dropdown', label: 'Menstrual Regularity', options: [
            { value: 'regular', label: 'Regular' },
            { value: 'irregular', label: 'Irregular' },
            { value: 'postmenopausal', label: 'Postmenopausal' },
            { value: 'na', label: 'Not Applicable' }
          ]},
          { id: 'pregnant', type: 'dropdown', label: 'Currently Pregnant', options: [
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
            { value: 'possibly', label: 'Possibly' },
            { value: 'na', label: 'Not Applicable' }
          ]},
          { id: 'pregnancy-weeks', type: 'number', label: 'Weeks Pregnant', placeholder: 'Weeks',
            conditionalVisibility: { dependsOn: 'pregnant', condition: 'equals', value: 'yes' }
          },
          { id: 'gravida', type: 'number', label: 'Gravida (Total Pregnancies)', placeholder: 'Number' },
          { id: 'para', type: 'number', label: 'Para (Live Births)', placeholder: 'Number' },
          { id: 'breastfeeding', type: 'checkbox', label: 'Breastfeeding', checkboxLabel: 'Currently breastfeeding' },
          { id: 'contraception', type: 'dropdown', label: 'Contraception Method', options: [
            { value: 'none', label: 'None' },
            { value: 'pills', label: 'Oral Contraceptives' },
            { value: 'iud', label: 'IUD' },
            { value: 'injection', label: 'Injection' },
            { value: 'implant', label: 'Implant' },
            { value: 'condoms', label: 'Condoms' },
            { value: 'sterilization', label: 'Sterilization' },
            { value: 'other', label: 'Other' }
          ]},
        ]
      },
      // Section 15: Triage Assessment
      {
        id: 'section-triage',
        title: 'Triage Assessment',
        description: 'Priority assessment by triage nurse',
        order: 15,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'triage-level', type: 'dropdown', label: 'Triage Level', required: true, options: [
            { value: 'level-1', label: 'Level 1 - Resuscitation (Immediate)' },
            { value: 'level-2', label: 'Level 2 - Emergency (Within 10 min)' },
            { value: 'level-3', label: 'Level 3 - Urgent (Within 30 min)' },
            { value: 'level-4', label: 'Level 4 - Less Urgent (Within 60 min)' },
            { value: 'level-5', label: 'Level 5 - Non-Urgent (Within 120 min)' }
          ]},
          { id: 'triage-notes', type: 'textarea', label: 'Triage Notes', placeholder: 'Initial assessment and observations...' },
          { id: 'isolation-required', type: 'checkbox', label: 'Isolation Required', checkboxLabel: 'Patient requires isolation precautions' },
          { id: 'isolation-type', type: 'dropdown', label: 'Isolation Type', options: [
            { value: 'contact', label: 'Contact Precautions' },
            { value: 'droplet', label: 'Droplet Precautions' },
            { value: 'airborne', label: 'Airborne Precautions' },
            { value: 'protective', label: 'Protective Isolation' }
          ], conditionalVisibility: { dependsOn: 'isolation-required', condition: 'equals', value: true }},
          { id: 'fall-risk', type: 'dropdown', label: 'Fall Risk', options: [
            { value: 'low', label: 'Low Risk' },
            { value: 'moderate', label: 'Moderate Risk' },
            { value: 'high', label: 'High Risk' }
          ]},
          { id: 'mobility', type: 'dropdown', label: 'Mobility Status', options: [
            { value: 'ambulatory', label: 'Ambulatory (walking)' },
            { value: 'with-assistance', label: 'Ambulatory with Assistance' },
            { value: 'wheelchair', label: 'Wheelchair' },
            { value: 'stretcher', label: 'Stretcher/Bed' }
          ]},
          { id: 'assigned-doctor', type: 'text', label: 'Assigned Doctor', placeholder: 'Dr. Name' },
          { id: 'assigned-room', type: 'text', label: 'Assigned Room/Bed', placeholder: 'Room number' },
          { id: 'triage-time', type: 'text', label: 'Triage Completed Time', placeholder: 'HH:MM' },
          { id: 'triage-nurse', type: 'text', label: 'Triage Nurse Name', placeholder: 'Nurse name' },
        ]
      },
      // Section 16: Consents
      {
        id: 'section-consents',
        title: 'Consents & Acknowledgments',
        description: 'Required patient consents',
        order: 16,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'consent-treatment', type: 'checkbox', label: 'Consent for Treatment', required: true, checkboxLabel: 'I consent to receive medical treatment as deemed necessary' },
          { id: 'consent-privacy', type: 'checkbox', label: 'Privacy Acknowledgment', required: true, checkboxLabel: 'I acknowledge receiving information about privacy practices' },
          { id: 'consent-insurance', type: 'checkbox', label: 'Financial Responsibility', required: true, checkboxLabel: 'I understand my financial responsibility for services rendered' },
          { id: 'consent-release', type: 'checkbox', label: 'Release of Information', checkboxLabel: 'I authorize release of information to my insurance company' },
          { id: 'advance-directive', type: 'checkbox', label: 'Advance Directive', checkboxLabel: 'Patient has advance directive on file' },
          { id: 'directive-details', type: 'text', label: 'Advance Directive Details', placeholder: 'Type of directive, location of document',
            conditionalVisibility: { dependsOn: 'advance-directive', condition: 'equals', value: true }
          },
          { id: 'signature-date', type: 'date', label: 'Signature Date' },
          { id: 'relationship-to-patient', type: 'text', label: 'If Signed by Other', placeholder: 'Relationship to patient (if not signed by patient)' },
        ]
      },
    ]
  },

  // ==========================================
  // 3. PEDIATRICS ASSESSMENT FORM
  // ==========================================
  {
    id: 'pediatrics-assessment-v1',
    name: 'Pediatrics Assessment Form',
    description: 'Comprehensive pediatric evaluation including growth, development, immunizations, and age-appropriate assessments',
    category: 'Pediatrics',
    version: '2.0.0',
    author: 'Dr. Child Specialist',
    icon: 'child_care',
    color: '#43a047',
    tags: ['pediatrics', 'child', 'growth', 'development', 'vaccination', 'immunization'],
    usageCount: 1567,
    createdAt: '2024-01-12T08:15:00Z',
    sections: [
      // Section 1: Child Information
      {
        id: 'section-child-info',
        title: 'Child Information',
        description: 'Basic child identification',
        order: 1,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'child-mrn', type: 'text', label: 'Medical Record Number', required: true, placeholder: 'MRN' },
          { id: 'child-first-name', type: 'text', label: 'First Name', required: true, placeholder: 'Child first name' },
          { id: 'child-middle-name', type: 'text', label: 'Middle Name', placeholder: 'Child middle name' },
          { id: 'child-last-name', type: 'text', label: 'Last Name', required: true, placeholder: 'Child last name' },
          { id: 'child-nickname', type: 'text', label: 'Nickname/Preferred Name', placeholder: 'What does the child like to be called?' },
          { id: 'child-dob', type: 'date', label: 'Date of Birth', required: true },
          { id: 'child-age-years', type: 'number', label: 'Age (Years)', required: true, placeholder: '0-18', validation: { min: 0, max: 18 } },
          { id: 'child-age-months', type: 'number', label: 'Age (Months)', required: true, placeholder: '0-11', validation: { min: 0, max: 11 } },
          { id: 'child-age-days', type: 'number', label: 'Age (Days)', placeholder: 'For newborns', validation: { min: 0, max: 30 } },
          { id: 'child-gender', type: 'dropdown', label: 'Gender', required: true, options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'child-blood-group', type: 'dropdown', label: 'Blood Group', options: [
            { value: 'a-pos', label: 'A+' },
            { value: 'a-neg', label: 'A-' },
            { value: 'b-pos', label: 'B+' },
            { value: 'b-neg', label: 'B-' },
            { value: 'ab-pos', label: 'AB+' },
            { value: 'ab-neg', label: 'AB-' },
            { value: 'o-pos', label: 'O+' },
            { value: 'o-neg', label: 'O-' },
            { value: 'unknown', label: 'Unknown' }
          ]},
          { id: 'child-nationality', type: 'text', label: 'Nationality', placeholder: 'Nationality' },
          { id: 'child-language', type: 'text', label: 'Primary Language', placeholder: 'Language spoken at home' },
        ]
      },
      // Section 2: Parent/Guardian Information
      {
        id: 'section-parent-info',
        title: 'Parent/Guardian Information',
        description: 'Primary caregiver details',
        order: 2,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'parent1-name', type: 'text', label: 'Parent/Guardian 1 Name', required: true, placeholder: 'Full name' },
          { id: 'parent1-relationship', type: 'dropdown', label: 'Relationship', required: true, options: [
            { value: 'mother', label: 'Mother' },
            { value: 'father', label: 'Father' },
            { value: 'grandmother', label: 'Grandmother' },
            { value: 'grandfather', label: 'Grandfather' },
            { value: 'legal-guardian', label: 'Legal Guardian' },
            { value: 'foster-parent', label: 'Foster Parent' },
            { value: 'step-parent', label: 'Step Parent' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'parent1-phone', type: 'text', label: 'Phone Number', required: true, placeholder: 'Primary contact' },
          { id: 'parent1-alt-phone', type: 'text', label: 'Alternate Phone', placeholder: 'Work or alternate number' },
          { id: 'parent1-email', type: 'text', label: 'Email', placeholder: 'Email address' },
          { id: 'parent1-occupation', type: 'text', label: 'Occupation', placeholder: 'Job/Profession' },
          { id: 'parent2-name', type: 'text', label: 'Parent/Guardian 2 Name', placeholder: 'Full name' },
          { id: 'parent2-relationship', type: 'dropdown', label: 'Relationship', options: [
            { value: 'mother', label: 'Mother' },
            { value: 'father', label: 'Father' },
            { value: 'grandmother', label: 'Grandmother' },
            { value: 'grandfather', label: 'Grandfather' },
            { value: 'legal-guardian', label: 'Legal Guardian' },
            { value: 'step-parent', label: 'Step Parent' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'parent2-phone', type: 'text', label: 'Phone Number', placeholder: 'Contact number' },
          { id: 'family-address', type: 'textarea', label: 'Home Address', required: true, placeholder: 'Full address' },
          { id: 'custody-situation', type: 'dropdown', label: 'Custody Situation', options: [
            { value: 'both-parents', label: 'Both Parents Together' },
            { value: 'single-mother', label: 'Single Mother' },
            { value: 'single-father', label: 'Single Father' },
            { value: 'shared-custody', label: 'Shared Custody' },
            { value: 'grandparents', label: 'Grandparents' },
            { value: 'foster-care', label: 'Foster Care' },
            { value: 'other', label: 'Other' }
          ]},
        ]
      },
      // Section 3: Emergency Contact
      {
        id: 'section-emergency',
        title: 'Emergency Contacts',
        description: 'People authorized to pick up child and emergency contacts',
        order: 3,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'emergency1-name', type: 'text', label: 'Emergency Contact 1', required: true, placeholder: 'Full name' },
          { id: 'emergency1-relationship', type: 'text', label: 'Relationship', required: true, placeholder: 'Relationship to child' },
          { id: 'emergency1-phone', type: 'text', label: 'Phone Number', required: true, placeholder: 'Contact number' },
          { id: 'emergency1-authorized', type: 'checkbox', label: 'Authorized to Pick Up', checkboxLabel: 'Authorized to pick up child from facility' },
          { id: 'emergency2-name', type: 'text', label: 'Emergency Contact 2', placeholder: 'Full name' },
          { id: 'emergency2-relationship', type: 'text', label: 'Relationship', placeholder: 'Relationship to child' },
          { id: 'emergency2-phone', type: 'text', label: 'Phone Number', placeholder: 'Contact number' },
          { id: 'emergency2-authorized', type: 'checkbox', label: 'Authorized to Pick Up', checkboxLabel: 'Authorized to pick up child from facility' },
          { id: 'unauthorized-pickup', type: 'textarea', label: 'Unauthorized Pickup', placeholder: 'Names of anyone NOT authorized to pick up child (if applicable)' },
        ]
      },
      // Section 4: Visit Information
      {
        id: 'section-visit',
        title: 'Visit Information',
        description: 'Reason for today\'s visit',
        order: 4,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'visit-type', type: 'dropdown', label: 'Visit Type', required: true, options: [
            { value: 'well-child', label: 'Well-Child Visit/Check-up' },
            { value: 'sick-visit', label: 'Sick Visit' },
            { value: 'follow-up', label: 'Follow-up Visit' },
            { value: 'vaccination', label: 'Vaccination Only' },
            { value: 'newborn', label: 'Newborn Visit' },
            { value: 'school-physical', label: 'School Physical' },
            { value: 'sports-physical', label: 'Sports Physical' },
            { value: 'emergency', label: 'Emergency/Urgent' },
            { value: 'specialist-referral', label: 'Specialist Referral' }
          ]},
          { id: 'chief-complaint', type: 'textarea', label: 'Chief Complaint / Reason for Visit', required: true, placeholder: 'Describe the main reason for today\'s visit...' },
          { id: 'symptom-duration', type: 'text', label: 'Duration of Symptoms', placeholder: 'How long has the child had these symptoms?',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'in', value: ['sick-visit', 'emergency'] }
          },
          { id: 'symptom-severity', type: 'dropdown', label: 'Severity', options: [
            { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe', label: 'Severe' }
          ], conditionalVisibility: { dependsOn: 'visit-type', condition: 'in', value: ['sick-visit', 'emergency'] }},
          { id: 'fever', type: 'checkbox', label: 'Fever', checkboxLabel: 'Child has or had fever',
            conditionalVisibility: { dependsOn: 'visit-type', condition: 'in', value: ['sick-visit', 'emergency'] }
          },
          { id: 'fever-max', type: 'number', label: 'Highest Temperature (°F)', placeholder: 'Maximum recorded',
            conditionalVisibility: { dependsOn: 'fever', condition: 'equals', value: true }
          },
          { id: 'fever-when', type: 'text', label: 'When was fever?', placeholder: 'Date/time of fever',
            conditionalVisibility: { dependsOn: 'fever', condition: 'equals', value: true }
          },
          { id: 'associated-symptoms', type: 'multiselect', label: 'Associated Symptoms', options: [
            { value: 'cough', label: 'Cough' },
            { value: 'runny-nose', label: 'Runny Nose' },
            { value: 'sore-throat', label: 'Sore Throat' },
            { value: 'ear-pain', label: 'Ear Pain' },
            { value: 'vomiting', label: 'Vomiting' },
            { value: 'diarrhea', label: 'Diarrhea' },
            { value: 'rash', label: 'Rash' },
            { value: 'difficulty-breathing', label: 'Difficulty Breathing' },
            { value: 'poor-feeding', label: 'Poor Feeding' },
            { value: 'lethargy', label: 'Lethargy' },
            { value: 'irritability', label: 'Irritability' }
          ], conditionalVisibility: { dependsOn: 'visit-type', condition: 'in', value: ['sick-visit', 'emergency'] }},
        ]
      },
      // Section 5: Growth Measurements
      {
        id: 'section-growth',
        title: 'Growth Measurements',
        description: 'Current growth parameters',
        order: 5,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'weight-kg', type: 'number', label: 'Weight (kg)', required: true, placeholder: 'e.g., 15.5', validation: { min: 0.5, max: 150 } },
          { id: 'weight-percentile', type: 'dropdown', label: 'Weight Percentile', options: [
            { value: 'below-3', label: '< 3rd percentile' },
            { value: '3-10', label: '3rd - 10th percentile' },
            { value: '10-25', label: '10th - 25th percentile' },
            { value: '25-50', label: '25th - 50th percentile' },
            { value: '50-75', label: '50th - 75th percentile' },
            { value: '75-90', label: '75th - 90th percentile' },
            { value: '90-97', label: '90th - 97th percentile' },
            { value: 'above-97', label: '> 97th percentile' }
          ]},
          { id: 'height-cm', type: 'number', label: 'Height/Length (cm)', required: true, placeholder: 'e.g., 100', validation: { min: 30, max: 200 } },
          { id: 'height-percentile', type: 'dropdown', label: 'Height Percentile', options: [
            { value: 'below-3', label: '< 3rd percentile' },
            { value: '3-10', label: '3rd - 10th percentile' },
            { value: '10-25', label: '10th - 25th percentile' },
            { value: '25-50', label: '25th - 50th percentile' },
            { value: '50-75', label: '50th - 75th percentile' },
            { value: '75-90', label: '75th - 90th percentile' },
            { value: '90-97', label: '90th - 97th percentile' },
            { value: 'above-97', label: '> 97th percentile' }
          ]},
          { id: 'head-circumference', type: 'number', label: 'Head Circumference (cm)', placeholder: 'For children < 3 years', validation: { min: 25, max: 60 },
            helpText: 'Required for children under 3 years'
          },
          { id: 'head-percentile', type: 'dropdown', label: 'Head Circumference Percentile', options: [
            { value: 'below-3', label: '< 3rd percentile' },
            { value: '3-10', label: '3rd - 10th percentile' },
            { value: '10-25', label: '10th - 25th percentile' },
            { value: '25-50', label: '25th - 50th percentile' },
            { value: '50-75', label: '50th - 75th percentile' },
            { value: '75-90', label: '75th - 90th percentile' },
            { value: '90-97', label: '90th - 97th percentile' },
            { value: 'above-97', label: '> 97th percentile' }
          ]},
          { id: 'bmi', type: 'number', label: 'BMI', placeholder: 'Calculated from height and weight' },
          { id: 'bmi-percentile', type: 'dropdown', label: 'BMI Percentile (for age ≥2 years)', options: [
            { value: 'underweight', label: 'Underweight (< 5th)' },
            { value: 'healthy', label: 'Healthy Weight (5th - 85th)' },
            { value: 'overweight', label: 'Overweight (85th - 95th)' },
            { value: 'obese', label: 'Obese (≥ 95th)' }
          ]},
          { id: 'growth-concerns', type: 'checkbox', label: 'Growth Concerns', checkboxLabel: 'Concerns about growth pattern' },
          { id: 'growth-concern-details', type: 'textarea', label: 'Growth Concern Details', placeholder: 'Describe concerns...',
            conditionalVisibility: { dependsOn: 'growth-concerns', condition: 'equals', value: true }
          },
        ]
      },
      // Section 6: Vital Signs
      {
        id: 'section-vitals',
        title: 'Vital Signs',
        description: 'Current vital measurements',
        order: 6,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'temperature', type: 'number', label: 'Temperature (°F)', required: true, placeholder: 'e.g., 98.6', validation: { min: 90, max: 108 } },
                    { id: 'temp-route', type: 'dropdown', label: 'Temperature Route', options: [
            { value: 'oral', label: 'Oral' },
            { value: 'axillary', label: 'Axillary' },
            { value: 'rectal', label: 'Rectal' },
            { value: 'tympanic', label: 'Tympanic (Ear)' },
            { value: 'temporal', label: 'Temporal' }
          ]},
          { id: 'heart-rate', type: 'number', label: 'Heart Rate (bpm)', required: true, placeholder: 'Age-appropriate range', validation: { min: 40, max: 220 },
            helpText: 'Normal: Newborn 120-160, Infant 80-140, Toddler 80-130, Child 70-120, Teen 60-100'
          },
          { id: 'respiratory-rate', type: 'number', label: 'Respiratory Rate (breaths/min)', required: true, placeholder: 'Age-appropriate range', validation: { min: 10, max: 70 },
            helpText: 'Normal: Newborn 30-60, Infant 25-40, Toddler 20-30, Child 18-25, Teen 12-20'
          },
          { id: 'blood-pressure-systolic', type: 'number', label: 'Systolic BP (mmHg)', placeholder: 'For children ≥3 years', validation: { min: 50, max: 180 } },
          { id: 'blood-pressure-diastolic', type: 'number', label: 'Diastolic BP (mmHg)', placeholder: 'For children ≥3 years', validation: { min: 30, max: 120 } },
          { id: 'spo2', type: 'number', label: 'Oxygen Saturation (%)', required: true, placeholder: 'e.g., 98', validation: { min: 70, max: 100 } },
          { id: 'capillary-refill', type: 'dropdown', label: 'Capillary Refill', options: [
            { value: 'less-2', label: '< 2 seconds (Normal)' },
            { value: '2-3', label: '2-3 seconds (Slightly delayed)' },
            { value: 'more-3', label: '> 3 seconds (Delayed)' }
          ]},
          { id: 'pain-assessment', type: 'dropdown', label: 'Pain Assessment', options: [
            { value: '0', label: '0 - No pain' },
            { value: '1-2', label: '1-2 - Mild pain' },
            { value: '3-4', label: '3-4 - Moderate pain' },
            { value: '5-6', label: '5-6 - Moderate-severe pain' },
            { value: '7-8', label: '7-8 - Severe pain' },
            { value: '9-10', label: '9-10 - Worst possible pain' }
          ]},
          { id: 'pain-scale-used', type: 'dropdown', label: 'Pain Scale Used', options: [
            { value: 'faces', label: 'Wong-Baker FACES' },
            { value: 'flacc', label: 'FLACC (Infants/Non-verbal)' },
            { value: 'numeric', label: 'Numeric Rating Scale' },
            { value: 'cries', label: 'CRIES (Neonates)' }
          ]},
        ]
      },
      // Section 7: Birth History
      {
        id: 'section-birth-history',
        title: 'Birth History',
        description: 'Prenatal, birth, and neonatal history',
        order: 7,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'gestational-age', type: 'number', label: 'Gestational Age at Birth (weeks)', placeholder: 'e.g., 39', validation: { min: 22, max: 44 } },
          { id: 'birth-weight', type: 'number', label: 'Birth Weight (kg)', placeholder: 'e.g., 3.2', validation: { min: 0.4, max: 6 } },
          { id: 'birth-length', type: 'number', label: 'Birth Length (cm)', placeholder: 'e.g., 50', validation: { min: 25, max: 65 } },
          { id: 'birth-head-circumference', type: 'number', label: 'Birth Head Circumference (cm)', placeholder: 'e.g., 35', validation: { min: 20, max: 45 } },
          { id: 'delivery-type', type: 'dropdown', label: 'Delivery Type', options: [
            { value: 'vaginal', label: 'Vaginal Delivery' },
            { value: 'vaginal-assisted', label: 'Vaginal Assisted (Forceps/Vacuum)' },
            { value: 'cesarean-planned', label: 'Cesarean - Planned' },
            { value: 'cesarean-emergency', label: 'Cesarean - Emergency' }
          ]},
          { id: 'cesarean-reason', type: 'text', label: 'Reason for Cesarean', placeholder: 'If applicable',
            conditionalVisibility: { dependsOn: 'delivery-type', condition: 'in', value: ['cesarean-planned', 'cesarean-emergency'] }
          },
          { id: 'apgar-1min', type: 'number', label: 'APGAR Score (1 min)', placeholder: '0-10', validation: { min: 0, max: 10 } },
          { id: 'apgar-5min', type: 'number', label: 'APGAR Score (5 min)', placeholder: '0-10', validation: { min: 0, max: 10 } },
          { id: 'birth-complications', type: 'multiselect', label: 'Birth Complications', options: [
            { value: 'none', label: 'None' },
            { value: 'preterm', label: 'Premature Birth' },
            { value: 'low-birth-weight', label: 'Low Birth Weight' },
            { value: 'respiratory-distress', label: 'Respiratory Distress' },
            { value: 'jaundice', label: 'Jaundice requiring treatment' },
            { value: 'hypoglycemia', label: 'Hypoglycemia' },
            { value: 'infection', label: 'Infection' },
            { value: 'birth-asphyxia', label: 'Birth Asphyxia' },
            { value: 'meconium', label: 'Meconium Aspiration' },
            { value: 'congenital-anomaly', label: 'Congenital Anomaly' },
            { value: 'nicu-admission', label: 'NICU Admission' }
          ]},
          { id: 'nicu-stay', type: 'checkbox', label: 'NICU Admission', checkboxLabel: 'Baby was admitted to NICU' },
          { id: 'nicu-duration', type: 'number', label: 'NICU Stay Duration (days)', placeholder: 'Number of days',
            conditionalVisibility: { dependsOn: 'nicu-stay', condition: 'equals', value: true }
          },
          { id: 'nicu-reason', type: 'textarea', label: 'Reason for NICU Admission', placeholder: 'Describe the reason...',
            conditionalVisibility: { dependsOn: 'nicu-stay', condition: 'equals', value: true }
          },
          { id: 'pregnancy-complications', type: 'multiselect', label: 'Pregnancy Complications', options: [
            { value: 'none', label: 'None' },
            { value: 'gestational-diabetes', label: 'Gestational Diabetes' },
            { value: 'preeclampsia', label: 'Preeclampsia/Eclampsia' },
            { value: 'placenta-previa', label: 'Placenta Previa' },
            { value: 'placental-abruption', label: 'Placental Abruption' },
            { value: 'oligohydramnios', label: 'Oligohydramnios' },
            { value: 'polyhydramnios', label: 'Polyhydramnios' },
            { value: 'iugr', label: 'IUGR (Intrauterine Growth Restriction)' },
            { value: 'multiple-gestation', label: 'Multiple Gestation (Twins, etc.)' },
            { value: 'infection', label: 'Maternal Infection' },
            { value: 'threatened-abortion', label: 'Threatened Abortion' }
          ]},
          { id: 'prenatal-care', type: 'dropdown', label: 'Prenatal Care', options: [
            { value: 'regular', label: 'Regular (All visits)' },
            { value: 'irregular', label: 'Irregular (Some visits missed)' },
            { value: 'late', label: 'Late (Started after first trimester)' },
            { value: 'none', label: 'None' },
            { value: 'unknown', label: 'Unknown' }
          ]},
          { id: 'maternal-medications', type: 'textarea', label: 'Maternal Medications During Pregnancy', placeholder: 'List medications taken during pregnancy' },
          { id: 'maternal-smoking', type: 'checkbox', label: 'Maternal Smoking', checkboxLabel: 'Mother smoked during pregnancy' },
          { id: 'maternal-alcohol', type: 'checkbox', label: 'Maternal Alcohol', checkboxLabel: 'Mother consumed alcohol during pregnancy' },
        ]
      },
      // Section 8: Feeding & Nutrition
      {
        id: 'section-feeding',
        title: 'Feeding & Nutrition',
        description: 'Current feeding practices and nutritional status',
        order: 8,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'feeding-type', type: 'dropdown', label: 'Current Feeding Type', required: true, options: [
            { value: 'breastfed', label: 'Exclusively Breastfed' },
            { value: 'formula', label: 'Formula Fed' },
            { value: 'mixed', label: 'Mixed (Breast + Formula)' },
            { value: 'solids', label: 'Solids + Milk/Formula' },
            { value: 'regular-diet', label: 'Regular Family Diet' }
          ]},
          { id: 'breastfeeding-duration', type: 'text', label: 'Breastfeeding Duration', placeholder: 'How long was child breastfed?',
            conditionalVisibility: { dependsOn: 'feeding-type', condition: 'in', value: ['breastfed', 'mixed', 'solids', 'regular-diet'] }
          },
          { id: 'formula-type', type: 'text', label: 'Formula Type/Brand', placeholder: 'Name of formula',
            conditionalVisibility: { dependsOn: 'feeding-type', condition: 'in', value: ['formula', 'mixed'] }
          },
          { id: 'solids-started', type: 'text', label: 'Age When Solids Started', placeholder: 'e.g., 6 months' },
          { id: 'feeding-frequency', type: 'text', label: 'Feeding Frequency', placeholder: 'How many times per day?' },
          { id: 'appetite', type: 'dropdown', label: 'Current Appetite', options: [
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
            { value: 'variable', label: 'Variable' }
          ]},
          { id: 'feeding-concerns', type: 'multiselect', label: 'Feeding Concerns', options: [
            { value: 'none', label: 'None' },
            { value: 'picky-eater', label: 'Picky Eater' },
            { value: 'food-refusal', label: 'Food Refusal' },
            { value: 'gagging', label: 'Gagging/Choking' },
            { value: 'vomiting', label: 'Frequent Vomiting' },
            { value: 'reflux', label: 'Reflux' },
            { value: 'swallowing-difficulty', label: 'Swallowing Difficulty' },
            { value: 'excessive-hunger', label: 'Excessive Hunger' },
            { value: 'weight-gain', label: 'Poor Weight Gain' }
          ]},
          { id: 'food-allergies-intolerances', type: 'textarea', label: 'Food Allergies/Intolerances', placeholder: 'List any food allergies or intolerances' },
          { id: 'dietary-restrictions', type: 'textarea', label: 'Dietary Restrictions', placeholder: 'Vegetarian, religious restrictions, etc.' },
          { id: 'vitamins-supplements', type: 'textarea', label: 'Vitamins/Supplements', placeholder: 'Vitamin D, iron, multivitamins, etc.' },
        ]
      },
      // Section 9: Immunization History
      {
        id: 'section-immunizations',
        title: 'Immunization History',
        description: 'Vaccination status and records',
        order: 9,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'immunization-status', type: 'dropdown', label: 'Overall Immunization Status', required: true, options: [
            { value: 'up-to-date', label: 'Up to Date' },
            { value: 'behind', label: 'Behind Schedule' },
            { value: 'partial', label: 'Partially Vaccinated' },
            { value: 'none', label: 'Not Vaccinated' },
            { value: 'unknown', label: 'Unknown' }
          ]},
          { id: 'immunization-card', type: 'checkbox', label: 'Immunization Card Available', checkboxLabel: 'Vaccination card/record available' },
          { id: 'vaccines-received', type: 'multiselect', label: 'Vaccines Received', options: [
            { value: 'bcg', label: 'BCG' },
            { value: 'hepb', label: 'Hepatitis B' },
            { value: 'dtap', label: 'DTaP/DTP' },
            { value: 'ipv', label: 'IPV (Polio)' },
            { value: 'opv', label: 'OPV (Oral Polio)' },
            { value: 'hib', label: 'Hib' },
            { value: 'pcv', label: 'PCV (Pneumococcal)' },
            { value: 'rotavirus', label: 'Rotavirus' },
            { value: 'mmr', label: 'MMR' },
            { value: 'varicella', label: 'Varicella (Chickenpox)' },
            { value: 'hepa', label: 'Hepatitis A' },
            { value: 'meningococcal', label: 'Meningococcal' },
            { value: 'hpv', label: 'HPV' },
            { value: 'influenza', label: 'Influenza (Flu)' },
            { value: 'typhoid', label: 'Typhoid' },
            { value: 'tdap', label: 'Tdap (Teen booster)' },
            { value: 'covid', label: 'COVID-19' }
          ]},
          { id: 'vaccines-due', type: 'multiselect', label: 'Vaccines Due Today', options: [
            { value: 'none', label: 'None due' },
            { value: 'bcg', label: 'BCG' },
            { value: 'hepb', label: 'Hepatitis B' },
            { value: 'dtap', label: 'DTaP' },
            { value: 'ipv', label: 'IPV (Polio)' },
            { value: 'hib', label: 'Hib' },
            { value: 'pcv', label: 'PCV (Pneumococcal)' },
            { value: 'rotavirus', label: 'Rotavirus' },
            { value: 'mmr', label: 'MMR' },
            { value: 'varicella', label: 'Varicella' },
            { value: 'hepa', label: 'Hepatitis A' },
            { value: 'influenza', label: 'Influenza' }
          ]},
          { id: 'vaccine-reactions', type: 'checkbox', label: 'Previous Vaccine Reactions', checkboxLabel: 'Child has had reaction to vaccines' },
          { id: 'vaccine-reaction-details', type: 'textarea', label: 'Describe Vaccine Reactions', placeholder: 'Which vaccine and what reaction occurred?',
            conditionalVisibility: { dependsOn: 'vaccine-reactions', condition: 'equals', value: true }
          },
          { id: 'vaccine-contraindications', type: 'checkbox', label: 'Vaccine Contraindications', checkboxLabel: 'Child has contraindications to certain vaccines' },
          { id: 'contraindication-details', type: 'textarea', label: 'Contraindication Details', placeholder: 'Explain contraindications...',
            conditionalVisibility: { dependsOn: 'vaccine-contraindications', condition: 'equals', value: true }
          },
          { id: 'last-vaccine-date', type: 'date', label: 'Last Vaccination Date' },
          { id: 'last-vaccines-given', type: 'text', label: 'Last Vaccines Given', placeholder: 'Which vaccines were given last?' },
        ]
      },
      // Section 10: Developmental History
      {
        id: 'section-development',
        title: 'Developmental History',
        description: 'Developmental milestones and assessments',
        order: 10,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'development-overall', type: 'dropdown', label: 'Overall Development', required: true, options: [
            { value: 'normal', label: 'Normal/Age-appropriate' },
            { value: 'advanced', label: 'Advanced for age' },
            { value: 'mild-delay', label: 'Mild delay' },
            { value: 'moderate-delay', label: 'Moderate delay' },
            { value: 'severe-delay', label: 'Severe delay' },
            { value: 'needs-assessment', label: 'Needs formal assessment' }
          ]},
          { id: 'gross-motor', type: 'dropdown', label: 'Gross Motor Development', options: [
            { value: 'normal', label: 'Age-appropriate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'delayed', label: 'Delayed' },
            { value: 'concerns', label: 'Concerns present' }
          ]},
          { id: 'gross-motor-milestones', type: 'textarea', label: 'Gross Motor Milestones', placeholder: 'When did child:\n- Hold head up?\n- Sit independently?\n- Crawl?\n- Walk?\n- Run?' },
          { id: 'fine-motor', type: 'dropdown', label: 'Fine Motor Development', options: [
            { value: 'normal', label: 'Age-appropriate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'delayed', label: 'Delayed' },
            { value: 'concerns', label: 'Concerns present' }
          ]},
          { id: 'fine-motor-milestones', type: 'textarea', label: 'Fine Motor Milestones', placeholder: 'When did child:\n- Grasp objects?\n- Pincer grasp?\n- Hold crayon?\n- Draw shapes?' },
          { id: 'language', type: 'dropdown', label: 'Language Development', options: [
            { value: 'normal', label: 'Age-appropriate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'delayed', label: 'Delayed' },
            { value: 'concerns', label: 'Concerns present' }
          ]},
          { id: 'language-milestones', type: 'textarea', label: 'Language Milestones', placeholder: 'When did child:\n- First words?\n- First sentences?\n- Current vocabulary?' },
          { id: 'social-emotional', type: 'dropdown', label: 'Social-Emotional Development', options: [
            { value: 'normal', label: 'Age-appropriate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'delayed', label: 'Delayed' },
            { value: 'concerns', label: 'Concerns present' }
          ]},
          { id: 'developmental-concerns', type: 'multiselect', label: 'Developmental Concerns', options: [
            { value: 'none', label: 'None' },
            { value: 'speech-delay', label: 'Speech/Language Delay' },
            { value: 'motor-delay', label: 'Motor Delay' },
            { value: 'social-concerns', label: 'Social Interaction Concerns' },
            { value: 'behavior', label: 'Behavioral Concerns' },
            { value: 'attention', label: 'Attention Problems' },
            { value: 'hyperactivity', label: 'Hyperactivity' },
            { value: 'autism-concerns', label: 'Autism Spectrum Concerns' },
            { value: 'learning', label: 'Learning Difficulties' },
            { value: 'regression', label: 'Developmental Regression' }
          ]},
          { id: 'early-intervention', type: 'checkbox', label: 'Early Intervention', checkboxLabel: 'Child receives/received early intervention services' },
          { id: 'intervention-details', type: 'textarea', label: 'Intervention Services', placeholder: 'Describe services received...',
            conditionalVisibility: { dependsOn: 'early-intervention', condition: 'equals', value: true }
          },
          { id: 'special-education', type: 'checkbox', label: 'Special Education', checkboxLabel: 'Child has IEP or special education services' },
          { id: 'therapies', type: 'multiselect', label: 'Current Therapies', options: [
            { value: 'none', label: 'None' },
            { value: 'speech', label: 'Speech Therapy' },
            { value: 'occupational', label: 'Occupational Therapy' },
            { value: 'physical', label: 'Physical Therapy' },
            { value: 'behavioral', label: 'Behavioral Therapy/ABA' },
            { value: 'developmental', label: 'Developmental Therapy' },
            { value: 'feeding', label: 'Feeding Therapy' }
          ]},
        ]
      },
      // Section 11: Medical History
      {
        id: 'section-medical-history',
        title: 'Medical History',
        description: 'Past illnesses, surgeries, and hospitalizations',
        order: 11,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'chronic-conditions', type: 'multiselect', label: 'Chronic Conditions', options: [
            { value: 'none', label: 'None' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'allergies', label: 'Allergies' },
            { value: 'eczema', label: 'Eczema' },
            { value: 'epilepsy', label: 'Epilepsy/Seizures' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'heart-condition', label: 'Heart Condition' },
            { value: 'kidney', label: 'Kidney Disease' },
            { value: 'adhd', label: 'ADHD' },
            { value: 'autism', label: 'Autism Spectrum Disorder' },
            { value: 'cerebral-palsy', label: 'Cerebral Palsy' },
            { value: 'down-syndrome', label: 'Down Syndrome' },
            { value: 'sickle-cell', label: 'Sickle Cell Disease' },
            { value: 'thyroid', label: 'Thyroid Disorder' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'chronic-conditions-details', type: 'textarea', label: 'Condition Details', placeholder: 'Provide details about chronic conditions...' },
          { id: 'frequent-illnesses', type: 'multiselect', label: 'Frequent Illnesses', options: [
            { value: 'none', label: 'None' },
            { value: 'ear-infections', label: 'Ear Infections' },
            { value: 'throat-infections', label: 'Throat Infections' },
            { value: 'respiratory', label: 'Respiratory Infections' },
            { value: 'uti', label: 'Urinary Tract Infections' },
            { value: 'skin-infections', label: 'Skin Infections' },
            { value: 'wheezing', label: 'Wheezing Episodes' }
          ]},
          { id: 'hospitalizations', type: 'checkbox', label: 'Previous Hospitalizations', checkboxLabel: 'Child has been hospitalized' },
          { id: 'hospitalization-details', type: 'textarea', label: 'Hospitalization Details', placeholder: 'List hospitalizations with dates and reasons...',
            conditionalVisibility: { dependsOn: 'hospitalizations', condition: 'equals', value: true }
          },
          { id: 'surgeries', type: 'checkbox', label: 'Previous Surgeries', checkboxLabel: 'Child has had surgeries' },
          { id: 'surgery-details', type: 'textarea', label: 'Surgery Details', placeholder: 'List surgeries with dates...',
            conditionalVisibility: { dependsOn: 'surgeries', condition: 'equals', value: true }
          },
          { id: 'injuries', type: 'textarea', label: 'Significant Injuries', placeholder: 'List any significant injuries, fractures, head trauma...' },
          { id: 'blood-transfusion', type: 'checkbox', label: 'Blood Transfusion', checkboxLabel: 'Child has received blood transfusion' },
        ]
      },
      // Section 12: Current Medications
      {
        id: 'section-medications',
        title: 'Current Medications',
        description: 'All medications child is currently taking',
        order: 12,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'on-medications', type: 'dropdown', label: 'Currently on Medications', required: true, options: [
            { value: 'none', label: 'No medications' },
            { value: 'prescription', label: 'Prescription medications' },
            { value: 'otc', label: 'Over-the-counter only' },
            { value: 'both', label: 'Both prescription and OTC' }
          ]},
          { id: 'medication-list', type: 'textarea', label: 'Current Medications', placeholder: 'List all medications with doses and frequency:\ne.g., Amoxicillin 250mg three times daily\n        Salbutamol inhaler as needed\n        Vitamin D drops daily',
            conditionalVisibility: { dependsOn: 'on-medications', condition: 'notEquals', value: 'none' }
          },
          { id: 'medication-allergies', type: 'textarea', label: 'Medication Allergies', placeholder: 'List drug allergies and reactions:\ne.g., Penicillin - hives\n        Ibuprofen - stomach upset' },
          { id: 'otc-home-remedies', type: 'textarea', label: 'OTC & Home Remedies', placeholder: 'Any over-the-counter medications, herbal remedies, or supplements?' },
        ]
      },
      // Section 13: Allergies
      {
        id: 'section-allergies',
        title: 'Allergies',
        description: 'Drug, food, and environmental allergies',
        order: 13,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'has-allergies', type: 'dropdown', label: 'Known Allergies', required: true, options: [
            { value: 'none', label: 'No Known Allergies' },
            { value: 'food', label: 'Food allergies only' },
            { value: 'drug', label: 'Drug allergies only' },
            { value: 'environmental', label: 'Environmental allergies only' },
            { value: 'multiple', label: 'Multiple allergies' }
          ]},
          { id: 'food-allergies', type: 'multiselect', label: 'Food Allergies', options: [
            { value: 'milk', label: 'Milk/Dairy' },
            { value: 'eggs', label: 'Eggs' },
            { value: 'peanuts', label: 'Peanuts' },
            { value: 'tree-nuts', label: 'Tree Nuts' },
            { value: 'wheat', label: 'Wheat' },
            { value: 'soy', label: 'Soy' },
            { value: 'fish', label: 'Fish' },
            { value: 'shellfish', label: 'Shellfish' },
            { value: 'sesame', label: 'Sesame' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'has-allergies', condition: 'in', value: ['food', 'multiple'] }},
          { id: 'food-allergy-reactions', type: 'textarea', label: 'Food Allergy Reactions', placeholder: 'Describe reactions to foods...',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'in', value: ['food', 'multiple'] }
          },
          { id: 'drug-allergies', type: 'textarea', label: 'Drug Allergies', placeholder: 'List drug allergies and reactions...',
            conditionalVisibility: { dependsOn: 'has-allergies', condition: 'in', value: ['drug', 'multiple'] }
          },
          { id: 'environmental-allergies', type: 'multiselect', label: 'Environmental Allergies', options: [
            { value: 'dust', label: 'Dust Mites' },
            { value: 'pollen', label: 'Pollen' },
            { value: 'pet-dander', label: 'Pet Dander' },
            { value: 'mold', label: 'Mold' },
            { value: 'insect', label: 'Insect Stings' },
            { value: 'latex', label: 'Latex' },
            { value: 'other', label: 'Other' }
          ], conditionalVisibility: { dependsOn: 'has-allergies', condition: 'in', value: ['environmental', 'multiple'] }},
          { id: 'has-epipen', type: 'checkbox', label: 'Epinephrine Auto-injector', checkboxLabel: 'Child carries EpiPen/Auvi-Q' },
          { id: 'allergy-action-plan', type: 'checkbox', label: 'Allergy Action Plan', checkboxLabel: 'Allergy action plan on file' },
          { id: 'anaphylaxis-history', type: 'checkbox', label: 'Anaphylaxis History', checkboxLabel: 'Child has had anaphylactic reaction' },
        ]
      },
      // Section 14: Family History
      {
        id: 'section-family-history',
        title: 'Family History',
        description: 'Medical conditions in family members',
        order: 14,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'family-conditions', type: 'multiselect', label: 'Family Medical Conditions', options: [
            { value: 'none', label: 'None significant' },
            { value: 'asthma', label: 'Asthma' },
            { value: 'allergies', label: 'Allergies' },
            { value: 'eczema', label: 'Eczema' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'heart-disease', label: 'Heart Disease' },
            { value: 'hypertension', label: 'Hypertension' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'epilepsy', label: 'Epilepsy' },
            { value: 'developmental-delay', label: 'Developmental Delay' },
            { value: 'autism', label: 'Autism' },
            { value: 'adhd', label: 'ADHD' },
            { value: 'learning-disability', label: 'Learning Disabilities' },
            { value: 'mental-health', label: 'Mental Health Conditions' },
            { value: 'genetic-disorder', label: 'Genetic Disorders' },
            { value: 'sids', label: 'SIDS' },
            { value: 'childhood-death', label: 'Early Childhood Death' }
          ]},
          { id: 'family-history-details', type: 'textarea', label: 'Family History Details', placeholder: 'Specify which family members have which conditions...' },
          { id: 'consanguinity', type: 'checkbox', label: 'Consanguinity', checkboxLabel: 'Parents are blood relatives' },
          { id: 'siblings-count', type: 'number', label: 'Number of Siblings', placeholder: 'Total number of siblings' },
          { id: 'sibling-health', type: 'textarea', label: 'Siblings Health', placeholder: 'Health status of siblings (especially if any health issues)' },
        ]
      },
      // Section 15: Social & School History
      {
        id: 'section-social',
        title: 'Social & School History',
        description: 'Childcare, school, and social environment',
        order: 15,
        collapsible: true,
        defaultExpanded: false,
        fields: [
          { id: 'childcare', type: 'dropdown', label: 'Childcare Arrangement', options: [
            { value: 'home-parent', label: 'Home with Parent' },
            { value: 'home-relative', label: 'Home with Relative' },
            { value: 'nanny', label: 'Nanny/Babysitter' },
            { value: 'daycare', label: 'Daycare Center' },
            { value: 'preschool', label: 'Preschool' },
            { value: 'school', label: 'School' },
            { value: 'other', label: 'Other' }
          ]},
          { id: 'school-name', type: 'text', label: 'School/Daycare Name', placeholder: 'Name of facility' },
          { id: 'grade-level', type: 'text', label: 'Grade/Class Level', placeholder: 'e.g., Kindergarten, 3rd Grade' },
          { id: 'school-performance', type: 'dropdown', label: 'School Performance', options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'average', label: 'Average' },
            { value: 'below-average', label: 'Below Average' },
            { value: 'struggling', label: 'Struggling' },
            { value: 'not-applicable', label: 'Not Applicable' }
          ]},
          { id: 'school-concerns', type: 'multiselect', label: 'School Concerns', options: [
            { value: 'none', label: 'None' },
            { value: 'academic', label: 'Academic difficulties' },
            { value: 'attention', label: 'Attention/Focus' },
            { value: 'behavior', label: 'Behavior issues' },
            { value: 'social', label: 'Social difficulties' },
            { value: 'bullying', label: 'Bullying' },
            { value: 'attendance', label: 'Frequent absences' },
            { value: 'anxiety', label: 'School anxiety' }
          ]},
          { id: 'smoke-exposure', type: 'dropdown', label: 'Smoke Exposure', options: [
            { value: 'none', label: 'No smoke exposure' },
            { value: 'household', label: 'Smoker in household' },
            { value: 'outside-home', label: 'Outside home only' }
          ]},
          { id: 'pets', type: 'checkbox', label: 'Pets in Home', checkboxLabel: 'Family has pets' },
          { id: 'pet-types', type: 'text', label: 'Types of Pets', placeholder: 'Dog, cat, etc.',
            conditionalVisibility: { dependsOn: 'pets', condition: 'equals', value: true }
          },
          { id: 'screen-time', type: 'dropdown', label: 'Daily Screen Time', options: [
            { value: 'none', label: 'No screen time' },
            { value: 'less-1', label: 'Less than 1 hour' },
            { value: '1-2', label: '1-2 hours' },
            { value: '2-4', label: '2-4 hours' },
            { value: 'more-4', label: 'More than 4 hours' }
          ]},
          { id: 'sleep-hours', type: 'number', label: 'Hours of Sleep per Night', placeholder: 'Average hours' },
          { id: 'sleep-problems', type: 'multiselect', label: 'Sleep Problems', options: [
            { value: 'none', label: 'None' },
            { value: 'difficulty-falling', label: 'Difficulty falling asleep' },
            { value: 'night-waking', label: 'Night waking' },
            { value: 'early-waking', label: 'Early morning waking' },
            { value: 'snoring', label: 'Snoring' },
            { value: 'apnea', label: 'Sleep apnea' },
            { value: 'nightmares', label: 'Nightmares' },
            { value: 'sleepwalking', label: 'Sleepwalking' },
            { value: 'bedwetting', label: 'Bedwetting' }
          ]},
        ]
      },
      // Section 16: Physical Examination
      {
        id: 'section-physical-exam',
        title: 'Physical Examination',
        description: 'Complete physical examination findings',
        order: 16,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'general-appearance', type: 'dropdown', label: 'General Appearance', required: true, options: [
            { value: 'well', label: 'Well-appearing, alert' },
            { value: 'mildly-ill', label: 'Mildly ill-appearing' },
            { value: 'moderately-ill', label: 'Moderately ill-appearing' },
            { value: 'severely-ill', label: 'Severely ill-appearing' },
            { value: 'toxic', label: 'Toxic-appearing' }
          ]},
          { id: 'activity-level', type: 'dropdown', label: 'Activity Level', options: [
            { value: 'active', label: 'Active and playful' },
            { value: 'quiet', label: 'Quiet but alert' },
            { value: 'irritable', label: 'Irritable' },
            { value: 'lethargic', label: 'Lethargic' },
            { value: 'unresponsive', label: 'Unresponsive' }
          ]},
          { id: 'hydration', type: 'dropdown', label: 'Hydration Status', options: [
            { value: 'well-hydrated', label: 'Well hydrated' },
            { value: 'mild-dehydration', label: 'Mild dehydration' },
            { value: 'moderate-dehydration', label: 'Moderate dehydration' },
            { value: 'severe-dehydration', label: 'Severe dehydration' }
          ]},
          { id: 'heent-findings', type: 'textarea', label: 'HEENT Examination', placeholder: 'Head, Eyes, Ears, Nose, Throat findings...' },
          { id: 'neck', type: 'text', label: 'Neck', placeholder: 'e.g., Supple, no lymphadenopathy' },
          { id: 'chest-lungs', type: 'textarea', label: 'Chest/Lungs', placeholder: 'Lung sounds, respiratory effort...' },
          { id: 'cardiovascular', type: 'textarea', label: 'Cardiovascular', placeholder: 'Heart sounds, pulses...' },
          { id: 'abdomen', type: 'textarea', label: 'Abdomen', placeholder: 'Soft, bowel sounds, tenderness...' },
          { id: 'genitourinary', type: 'text', label: 'Genitourinary', placeholder: 'Examination findings if indicated' },
          { id: 'musculoskeletal', type: 'textarea', label: 'Musculoskeletal', placeholder: 'Range of motion, strength...' },
          { id: 'skin', type: 'textarea', label: 'Skin', placeholder: 'Rashes, lesions, color...' },
          { id: 'neurological', type: 'textarea', label: 'Neurological', placeholder: 'Tone, reflexes, development appropriate...' },
          { id: 'exam-notes', type: 'textarea', label: 'Additional Examination Notes', placeholder: 'Any other findings...' },
        ]
      },
      // Section 17: Assessment & Plan
      {
        id: 'section-assessment',
        title: 'Assessment & Plan',
        description: 'Clinical assessment and treatment plan',
        order: 17,
        collapsible: true,
        defaultExpanded: true,
        fields: [
          { id: 'diagnosis', type: 'textarea', label: 'Diagnosis/Impression', required: true, placeholder: 'Primary and secondary diagnoses...' },
          { id: 'acuity', type: 'dropdown', label: 'Illness Acuity', options: [
            { value: 'well-child', label: 'Well Child' },
            { value: 'minor-illness', label: 'Minor/Self-limiting illness' },
            { value: 'moderate-illness', label: 'Moderate illness' },
            { value: 'serious-illness', label: 'Serious illness' },
            { value: 'critical', label: 'Critical' }
          ]},
          { id: 'medications-prescribed', type: 'textarea', label: 'Medications Prescribed', placeholder: 'List medications with doses, routes, frequencies, and durations...' },
          { id: 'vaccines-given', type: 'multiselect', label: 'Vaccines Given Today', options: [
            { value: 'none', label: 'None given' },
            { value: 'dtap', label: 'DTaP' },
            { value: 'ipv', label: 'IPV' },
            { value: 'hib', label: 'Hib' },
            { value: 'pcv', label: 'PCV' },
            { value: 'hepb', label: 'Hepatitis B' },
            { value: 'rotavirus', label: 'Rotavirus' },
            { value: 'mmr', label: 'MMR' },
            { value: 'varicella', label: 'Varicella' },
            { value: 'hepa', label: 'Hepatitis A' },
            { value: 'influenza', label: 'Influenza' }
          ]},
          { id: 'lab-tests', type: 'multiselect', label: 'Laboratory Tests Ordered', options: [
            { value: 'none', label: 'None' },
            { value: 'cbc', label: 'CBC' },
            { value: 'bmp', label: 'BMP/CMP' },
            { value: 'urinalysis', label: 'Urinalysis' },
            { value: 'strep-test', label: 'Rapid Strep Test' },
            { value: 'flu-test', label: 'Flu Test' },
            { value: 'rsv-test', label: 'RSV Test' },
            { value: 'covid-test', label: 'COVID-19 Test' },
            { value: 'blood-culture', label: 'Blood Culture' },
            { value: 'throat-culture', label: 'Throat Culture' },
            { value: 'stool-studies', label: 'Stool Studies' }
          ]},
          { id: 'imaging', type: 'multiselect', label: 'Imaging Ordered', options: [
            { value: 'none', label: 'None' },
            { value: 'chest-xray', label: 'Chest X-ray' },
            { value: 'abdominal-xray', label: 'Abdominal X-ray' },
            { value: 'ultrasound', label: 'Ultrasound' },
            { value: 'ct', label: 'CT Scan' }
          ]},
          { id: 'referrals', type: 'multiselect', label: 'Referrals', options: [
            { value: 'none', label: 'None' },
            { value: 'ent', label: 'ENT' },
            { value: 'cardiology', label: 'Cardiology' },
            { value: 'neurology', label: 'Neurology' },
            { value: 'gi', label: 'GI' },
            { value: 'allergy', label: 'Allergy/Immunology' },
            { value: 'pulmonology', label: 'Pulmonology' },
            { value: 'developmental', label: 'Developmental Pediatrics' },
            { value: 'psychiatry', label: 'Child Psychiatry' },
            { value: 'speech', label: 'Speech Therapy' },
            { value: 'ot', label: 'Occupational Therapy' },
            { value: 'pt', label: 'Physical Therapy' },
            { value: 'nutrition', label: 'Nutrition/Dietitian' }
          ]},
          { id: 'parent-education', type: 'textarea', label: 'Parent Education/Instructions', placeholder: 'Home care instructions, warning signs to watch for...' },
          { id: 'follow-up', type: 'dropdown', label: 'Follow-up', required: true, options: [
            { value: 'prn', label: 'As needed' },
            { value: '24-48h', label: '24-48 hours' },
            { value: '1-week', label: '1 week' },
            { value: '2-weeks', label: '2 weeks' },
            { value: '1-month', label: '1 month' },
            { value: '2-months', label: '2 months' },
            { value: '3-months', label: '3 months' },
            { value: '6-months', label: '6 months' },
            { value: '1-year', label: '1 year (next well-child)' }
          ]},
          { id: 'disposition', type: 'dropdown', label: 'Disposition', required: true, options: [
            { value: 'home', label: 'Discharge to Home' },
            { value: 'observation', label: 'Observation' },
            { value: 'admission', label: 'Hospital Admission' },
            { value: 'transfer', label: 'Transfer to Higher Care' },
            { value: 'er', label: 'Send to Emergency Room' }
          ]},
          { id: 'admission-reason', type: 'textarea', label: 'Reason for Admission/Transfer', placeholder: 'Explain if admission or transfer needed...',
            conditionalVisibility: { dependsOn: 'disposition', condition: 'in', value: ['admission', 'transfer', 'er'] }
          },
          { id: 'clinical-notes', type: 'textarea', label: 'Additional Clinical Notes', placeholder: 'Any other relevant notes...' },
        ]
      },
    ]
  },
];

// ============================================
// CATEGORIES
// ============================================
const CATEGORIES = [
  { id: 'general', name: 'General', color: '#1976d2', icon: 'local_hospital' },
  { id: 'cardiology', name: 'Cardiology', color: '#e53935', icon: 'favorite' },
  { id: 'pediatrics', name: 'Pediatrics', color: '#43a047', icon: 'child_care' },
  { id: 'neurology', name: 'Neurology', color: '#9c27b0', icon: 'psychology' },
  { id: 'orthopedics', name: 'Orthopedics', color: '#ff9800', icon: 'accessibility' },
  { id: 'emergency', name: 'Emergency', color: '#d32f2f', icon: 'emergency' },
];

// ============================================
// FORM CONTEXT PROVIDER
// ============================================
export function FormProvider({ children }) {
  const [templates, setTemplates] = useState(() => {
    const stored = localStorage.getItem('adapta_user_templates');
    if (stored) {
      try {
        const userTemplates = JSON.parse(stored);
        return [...BUILT_IN_TEMPLATES, ...userTemplates];
      } catch (e) {
        return BUILT_IN_TEMPLATES;
      }
    }
    return BUILT_IN_TEMPLATES;
  });

  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = CATEGORIES;

  // Get template by ID
  const getTemplateById = useCallback((id) => {
    return templates.find(t => t.id === id) || null;
  }, [templates]);

  // Save template
  const saveTemplate = useCallback((template) => {
    const now = new Date().toISOString();
    const newTemplate = {
      ...template,
      id: template.id || `template-${Date.now()}`,
      createdAt: template.createdAt || now,
      updatedAt: now,
    };

    setTemplates(prev => {
      // Check if it's a built-in template
      const isBuiltIn = BUILT_IN_TEMPLATES.some(t => t.id === newTemplate.id);
      if (isBuiltIn) {
        // Create a copy instead of modifying built-in
        newTemplate.id = `${newTemplate.id}-copy-${Date.now()}`;
        newTemplate.name = `${newTemplate.name} (Copy)`;
      }

      const existing = prev.findIndex(t => t.id === newTemplate.id);
      let updated;
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = newTemplate;
      } else {
        updated = [...prev, newTemplate];
      }

      // Save only user templates to localStorage
      const userTemplates = updated.filter(t => !BUILT_IN_TEMPLATES.some(b => b.id === t.id));
      localStorage.setItem('adapta_user_templates', JSON.stringify(userTemplates));
      
      return updated;
    });

    return newTemplate;
  }, []);

  // Delete template
  const deleteTemplate = useCallback((id) => {
    const isBuiltIn = BUILT_IN_TEMPLATES.some(t => t.id === id);
    if (isBuiltIn) return false;

    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      const userTemplates = updated.filter(t => !BUILT_IN_TEMPLATES.some(b => b.id === t.id));
      localStorage.setItem('adapta_user_templates', JSON.stringify(userTemplates));
      return updated;
    });
    return true;
  }, []);

  // Duplicate template
  const duplicateTemplate = useCallback((id) => {
    const original = templates.find(t => t.id === id);
    if (!original) return null;

    const duplicate = {
      ...JSON.parse(JSON.stringify(original)), // Deep clone
      id: `template-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    };

    return saveTemplate(duplicate);
  }, [templates, saveTemplate]);

  // Export template as JSON
  const exportTemplate = useCallback((id) => {
    const template = templates.find(t => t.id === id);
    if (!template) return;

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [templates]);

  // Import template from JSON file
  const importTemplate = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data.name || !data.sections) {
            throw new Error('Invalid template format');
          }
          data.id = `imported-${Date.now()}`;
          data.createdAt = new Date().toISOString();
          data.updatedAt = new Date().toISOString();
          const saved = saveTemplate(data);
          resolve(saved);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [saveTemplate]);

  // Create new blank template
  const createNewTemplate = useCallback(() => {
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: 'Untitled Template',
      description: '',
      category: 'General',
      version: '1.0.0',
      author: 'User',
      color: '#1976d2',
      icon: 'description',
      tags: [],
      usageCount: 0,
      sections: [
        {
          id: `section-${Date.now()}`,
          title: 'Section 1',
          description: '',
          order: 1,
          collapsible: true,
          defaultExpanded: true,
          fields: []
        }
      ]
    };
    setCurrentTemplate(newTemplate);
    return newTemplate;
  }, []);

  const value = {
    templates,
    categories,
    currentTemplate,
    formData,
    isLoading,
    setCurrentTemplate,
    setFormData,
    getTemplateById,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    exportTemplate,
    importTemplate,
    createNewTemplate,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}

export default FormContext;