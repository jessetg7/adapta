import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const EmergencyContext = createContext(null);

// Form modes configuration
const FORM_MODES = {
  NORMAL: {
    id: 'NORMAL',
    label: 'Normal',
    color: '#4caf50',
    icon: '🟢',
    visibleSections: 'all',
    requiredLevel: 'standard'
  },
  EMERGENCY: {
    id: 'EMERGENCY',
    label: 'Emergency',
    color: '#f44336',
    icon: '🔴',
    visibleSections: [
      'patient_basic', 'patient_demographics', 'child_information',
      'chief_complaint', 'visit_information',
      'vital_signs', 'vitals_core', 'growth_measurements',
      'allergies',
      'current_medications', 'medications',
      'emergency_assessment', 'triage_assessment',
      'clinical_assessment'
    ],
    hiddenSections: [
      'insurance', 'insurance_payment', 'insurance_information',
      'family_history',
      'social_history', 'social_school_history',
      'review_of_systems',
      'womens_health',
      'consents', 'consents_acknowledgments',
      'immunization_history'
    ],
    requiredLevel: 'critical'
  },
  FOLLOWUP: {
    id: 'FOLLOWUP',
    label: 'Follow-Up',
    color: '#ff9800',
    icon: '🟡',
    visibleSections: [
      'patient_basic', 'patient_demographics',
      'chief_complaint',
      'vital_signs',
      'current_medications',
      'clinical_assessment'
    ],
    requiredLevel: 'minimal'
  },
  DISCHARGE: {
    id: 'DISCHARGE',
    label: 'Discharge',
    color: '#2196f3',
    icon: '🔵',
    visibleSections: [
      'patient_basic',
      'clinical_assessment',
      'current_medications',
      'discharge_summary',
      'follow_up_instructions'
    ],
    requiredLevel: 'discharge'
  }
};

// Triage levels
const TRIAGE_LEVELS = {
  CRITICAL: { level: 1, label: 'Critical', color: '#d32f2f', action: 'Immediate Resuscitation' },
  EMERGENT: { level: 2, label: 'Emergent', color: '#f44336', action: 'Within 10 minutes' },
  URGENT: { level: 3, label: 'Urgent', color: '#ff9800', action: 'Within 30 minutes' },
  LESS_URGENT: { level: 4, label: 'Less Urgent', color: '#ffeb3b', action: 'Within 60 minutes' },
  NON_URGENT: { level: 5, label: 'Non-Urgent', color: '#4caf50', action: 'Within 120 minutes' }
};

// Emergency medications for quick-add
const EMERGENCY_MEDICATIONS = [
  { id: 'adrenaline', name: 'Adrenaline (Epinephrine)', route: 'IV/IM', dose: '0.5mg', frequency: 'STAT', category: 'cardiac' },
  { id: 'atropine', name: 'Atropine', route: 'IV', dose: '0.5mg', frequency: 'STAT', category: 'cardiac' },
  { id: 'saline', name: 'Normal Saline 0.9%', route: 'IV', dose: '500ml', frequency: 'Continuous', category: 'fluids' },
  { id: 'dextrose', name: 'Dextrose 25%', route: 'IV', dose: '50ml', frequency: 'STAT', category: 'metabolic' },
  { id: 'oxygen', name: 'Oxygen', route: 'Inhalation', dose: '2-4 L/min', frequency: 'Continuous', category: 'respiratory' },
  { id: 'paracetamol', name: 'Paracetamol', route: 'IV/Oral', dose: '1g', frequency: 'Q6H PRN', category: 'analgesic' },
  { id: 'morphine', name: 'Morphine', route: 'IV', dose: '2-4mg', frequency: 'Q4H PRN', category: 'analgesic' },
  { id: 'diazepam', name: 'Diazepam', route: 'IV', dose: '5mg', frequency: 'STAT', category: 'sedative' },
  { id: 'hydrocortisone', name: 'Hydrocortisone', route: 'IV', dose: '100mg', frequency: 'STAT', category: 'steroid' },
  { id: 'naloxone', name: 'Naloxone', route: 'IV', dose: '0.4mg', frequency: 'STAT', category: 'antidote' },
  { id: 'aspirin', name: 'Aspirin', route: 'Oral', dose: '300mg', frequency: 'STAT', category: 'cardiac' },
  { id: 'nitroglycerin', name: 'Nitroglycerin', route: 'SL', dose: '0.4mg', frequency: 'Q5min x3', category: 'cardiac' }
];

// Pediatric weight-based dosing
const PEDIATRIC_DOSING = {
  'adrenaline': { dosePerKg: 0.01, unit: 'mg/kg', maxDose: 0.5, route: 'IV/IM' },
  'atropine': { dosePerKg: 0.02, unit: 'mg/kg', minDose: 0.1, maxDose: 0.5, route: 'IV' },
  'paracetamol': { dosePerKg: 15, unit: 'mg/kg', maxDose: 1000, route: 'Oral/IV' },
  'ibuprofen': { dosePerKg: 10, unit: 'mg/kg', maxDose: 400, route: 'Oral' },
  'amoxicillin': { dosePerKg: 25, unit: 'mg/kg', maxDose: 500, route: 'Oral' },
  'salbutamol': { dosePerKg: 0.15, unit: 'mg/kg', maxDose: 5, route: 'Nebulized' }
};

export function EmergencyProvider({ children }) {
  const [currentMode, setCurrentMode] = useState(FORM_MODES.NORMAL);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [triageLevel, setTriageLevel] = useState(null);
  const [medications, setMedications] = useState([]);
  const [medicationTimeline, setMedicationTimeline] = useState([]);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [patientWeight, setPatientWeight] = useState(null);
  const [deferredFields, setDeferredFields] = useState([]);
  const [activeRules, setActiveRules] = useState([]);
  const [explainabilityLog, setExplainabilityLog] = useState([]);

  // Calculate triage level based on vitals
  const calculateTriageLevel = useCallback((vitals) => {
    const { systolicBP, heartRate, oxygenSaturation, temperature, consciousness } = vitals;
    
    let score = 0;
    const reasons = [];

    // Blood Pressure Assessment
    if (systolicBP < 90) {
      score += 40;
      reasons.push('Hypotension (SBP < 90)');
    } else if (systolicBP > 180) {
      score += 30;
      reasons.push('Severe Hypertension (SBP > 180)');
    }

    // Heart Rate Assessment
    if (heartRate > 120 || heartRate < 50) {
      score += 30;
      reasons.push(heartRate > 120 ? 'Tachycardia (HR > 120)' : 'Bradycardia (HR < 50)');
    }

    // Oxygen Saturation
    if (oxygenSaturation < 90) {
      score += 40;
      reasons.push('Hypoxia (SpO2 < 90%)');
    } else if (oxygenSaturation < 94) {
      score += 20;
      reasons.push('Low Oxygen (SpO2 < 94%)');
    }

    // Temperature
    if (temperature > 39.5 || temperature < 35) {
      score += 20;
      reasons.push(temperature > 39.5 ? 'High Fever (>39.5°C)' : 'Hypothermia (<35°C)');
    }

    // Consciousness
    if (consciousness === 'unresponsive') {
      score += 50;
      reasons.push('Unresponsive');
    } else if (consciousness === 'confused' || consciousness === 'drowsy') {
      score += 25;
      reasons.push('Altered Consciousness');
    }

    // Determine triage level
    let level;
    if (score >= 70) level = TRIAGE_LEVELS.CRITICAL;
    else if (score >= 50) level = TRIAGE_LEVELS.EMERGENT;
    else if (score >= 30) level = TRIAGE_LEVELS.URGENT;
    else if (score >= 15) level = TRIAGE_LEVELS.LESS_URGENT;
    else level = TRIAGE_LEVELS.NON_URGENT;

    return { ...level, score, reasons };
  }, []);

  // Activate emergency mode
  const activateEmergencyMode = useCallback((reason = 'Manual activation') => {
    setCurrentMode(FORM_MODES.EMERGENCY);
    setIsEmergencyActive(true);
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'EMERGENCY_MODE_ACTIVATED',
      reason,
      affectedSections: FORM_MODES.EMERGENCY.hiddenSections?.length || 0,
      rules: ['emergency-mode-rule']
    };
    
    setActiveRules(prev => [...prev, 'emergency-mode-rule']);
    setExplainabilityLog(prev => [...prev, logEntry]);
  }, []);

  // Deactivate emergency mode
  const deactivateEmergencyMode = useCallback(() => {
    setCurrentMode(FORM_MODES.NORMAL);
    setIsEmergencyActive(false);
    setActiveRules([]);
    
    setExplainabilityLog(prev => [...prev, {
      timestamp: new Date().toISOString(),
      action: 'EMERGENCY_MODE_DEACTIVATED',
      reason: 'Manual deactivation'
    }]);
  }, []);

  // Change form mode
  const changeMode = useCallback((modeId) => {
    const mode = FORM_MODES[modeId];
    if (mode) {
      setCurrentMode(mode);
      setIsEmergencyActive(modeId === 'EMERGENCY');
      
      setExplainabilityLog(prev => [...prev, {
        timestamp: new Date().toISOString(),
        action: 'MODE_CHANGED',
        from: currentMode.id,
        to: modeId,
        reason: 'User selection'
      }]);
    }
  }, [currentMode]);

  // Check if section should be visible in current mode
  const isSectionVisible = useCallback((sectionId) => {
    if (currentMode.visibleSections === 'all') return true;
    
    const normalizedId = sectionId.toLowerCase().replace(/[\s-]+/g, '_');
    
    // Check if explicitly hidden
    if (currentMode.hiddenSections?.some(s => 
      normalizedId.includes(s.toLowerCase().replace(/[\s-]+/g, '_'))
    )) {
      return false;
    }
    
    // Check if explicitly visible
    return currentMode.visibleSections.some(s => 
      normalizedId.includes(s.toLowerCase().replace(/[\s-]+/g, '_'))
    );
  }, [currentMode]);

  // Add medication
  const addMedication = useCallback((medication) => {
    const now = new Date();
    const newMed = {
      ...medication,
      id: `med_${Date.now()}`,
      administeredAt: now.toISOString(),
      administeredBy: 'Current User'
    };
    
    setMedications(prev => [...prev, newMed]);
    setMedicationTimeline(prev => [...prev, {
      time: now.toLocaleTimeString(),
      medication: medication.name,
      dose: medication.dose,
      route: medication.route
    }]);

    // Check for allergies
    if (patientAllergies.some(allergy => 
      medication.name.toLowerCase().includes(allergy.toLowerCase())
    )) {
      return { 
        success: false, 
        warning: `⚠️ ALLERGY ALERT: Patient may be allergic to ${medication.name}` 
      };
    }

    return { success: true };
  }, [patientAllergies]);

  // Calculate pediatric dose
  const calculatePediatricDose = useCallback((medicationId, weightKg) => {
    const dosing = PEDIATRIC_DOSING[medicationId];
    if (!dosing || !weightKg) return null;

    let calculatedDose = dosing.dosePerKg * weightKg;
    
    if (dosing.minDose && calculatedDose < dosing.minDose) {
      calculatedDose = dosing.minDose;
    }
    if (dosing.maxDose && calculatedDose > dosing.maxDose) {
      calculatedDose = dosing.maxDose;
    }

    return {
      dose: calculatedDose.toFixed(2),
      unit: dosing.unit.split('/')[0],
      formula: `${dosing.dosePerKg} ${dosing.unit} × ${weightKg} kg`,
      route: dosing.route,
      maxDoseNote: dosing.maxDose ? `Max: ${dosing.maxDose}mg` : null
    };
  }, []);

  // Add deferred field
  const addDeferredField = useCallback((fieldId, fieldLabel, sectionId) => {
    setDeferredFields(prev => {
      if (prev.some(f => f.fieldId === fieldId)) return prev;
      return [...prev, { fieldId, fieldLabel, sectionId, deferredAt: new Date().toISOString() }];
    });
  }, []);

  // Remove deferred field
  const removeDeferredField = useCallback((fieldId) => {
    setDeferredFields(prev => prev.filter(f => f.fieldId !== fieldId));
  }, []);

  // Auto-detect emergency from form values
  const detectEmergencyFromFormData = useCallback((formData) => {
    const triggers = [];
    
    // Visit type
    if (formData.visitType === 'Emergency' || formData.visit_type === 'Emergency') {
      triggers.push('Visit Type is Emergency');
    }
    
    // Triage level
    if (formData.triageLevel === 'critical' || formData.triageLevel === 'emergent') {
      triggers.push(`Triage Level: ${formData.triageLevel}`);
    }
    
    // Critical vitals
    if (formData.oxygenSaturation && parseFloat(formData.oxygenSaturation) < 90) {
      triggers.push('Critical: Oxygen Saturation < 90%');
    }
    
    if (formData.systolicBP && parseFloat(formData.systolicBP) < 90) {
      triggers.push('Critical: Systolic BP < 90');
    }
    
    if (triggers.length > 0 && !isEmergencyActive) {
      activateEmergencyMode(triggers.join(', '));
      return { triggered: true, reasons: triggers };
    }
    
    return { triggered: false };
  }, [isEmergencyActive, activateEmergencyMode]);

  const value = {
    // Mode state
    currentMode,
    isEmergencyActive,
    formModes: FORM_MODES,
    triageLevel,
    
    // Medications
    medications,
    medicationTimeline,
    emergencyMedications: EMERGENCY_MEDICATIONS,
    patientAllergies,
    patientWeight,
    
    // Deferred fields
    deferredFields,
    
    // Explainability
    activeRules,
    explainabilityLog,
    
    // Actions
    activateEmergencyMode,
    deactivateEmergencyMode,
    changeMode,
    isSectionVisible,
    calculateTriageLevel,
    setTriageLevel,
    addMedication,
    setPatientAllergies,
    setPatientWeight,
    calculatePediatricDose,
    addDeferredField,
    removeDeferredField,
    detectEmergencyFromFormData,
    
    // Constants
    TRIAGE_LEVELS
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within EmergencyProvider');
  }
  return context;
}

export default EmergencyContext;