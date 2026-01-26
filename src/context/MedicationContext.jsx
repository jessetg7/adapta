import React, { createContext, useContext, useState, useCallback } from 'react';

const MedicationContext = createContext(null);

// Medication Database (JSON-driven, LCNC principle)
const MEDICATION_DATABASE = [
  // Emergency Medications
  {
    id: 'med-adrenaline',
    name: 'Adrenaline (Epinephrine)',
    category: 'Emergency',
    routes: ['IV', 'IM', 'SC'],
    standardDose: '0.5 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.01,
    maxDose: 1,
    minDose: 0.1,
    contraindications: ['Hypertension', 'Tachyarrhythmia'],
    allergyGroup: 'Catecholamine',
    frequency: 'STAT',
    emergency: true,
    color: '#d32f2f'
  },
  {
    id: 'med-atropine',
    name: 'Atropine',
    category: 'Emergency',
    routes: ['IV', 'IM'],
    standardDose: '0.5 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.02,
    maxDose: 0.5,
    minDose: 0.1,
    contraindications: ['Glaucoma', 'Tachycardia'],
    allergyGroup: 'Anticholinergic',
    frequency: 'STAT',
    emergency: true,
    color: '#d32f2f'
  },
  {
    id: 'med-saline',
    name: 'Normal Saline 0.9%',
    category: 'Fluids',
    routes: ['IV'],
    standardDose: '500 ml',
    unit: 'ml',
    weightBased: false,
    maxDose: 2000,
    contraindications: ['Fluid Overload', 'Severe Hypertension'],
    allergyGroup: null,
    frequency: 'Continuous',
    emergency: true,
    color: '#2196f3'
  },
  {
    id: 'med-oxygen',
    name: 'Oxygen',
    category: 'Respiratory',
    routes: ['Inhalation', 'Nasal Cannula', 'Mask'],
    standardDose: '2-4 L/min',
    unit: 'L/min',
    weightBased: false,
    maxDose: 15,
    contraindications: [],
    allergyGroup: null,
    frequency: 'Continuous',
    emergency: true,
    color: '#4caf50'
  },
  {
    id: 'med-dextrose',
    name: 'Dextrose 25%',
    category: 'Emergency',
    routes: ['IV'],
    standardDose: '50 ml',
    unit: 'ml',
    weightBased: true,
    dosePerKg: 2,
    maxDose: 50,
    contraindications: ['Hyperglycemia'],
    allergyGroup: null,
    frequency: 'STAT',
    emergency: true,
    color: '#d32f2f'
  },
  // Analgesics
  {
    id: 'med-paracetamol',
    name: 'Paracetamol',
    category: 'Analgesic',
    routes: ['Oral', 'IV', 'Rectal'],
    standardDose: '1 g',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 15,
    maxDose: 1000,
    contraindications: ['Liver Disease', 'Hepatic Impairment'],
    allergyGroup: 'Paracetamol',
    frequency: 'Q6H PRN',
    emergency: false,
    color: '#ff9800'
  },
  {
    id: 'med-morphine',
    name: 'Morphine',
    category: 'Analgesic',
    routes: ['IV', 'IM', 'SC'],
    standardDose: '2-4 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.1,
    maxDose: 10,
    contraindications: ['Respiratory Depression', 'Head Injury'],
    allergyGroup: 'Opioid',
    frequency: 'Q4H PRN',
    emergency: true,
    color: '#ff9800'
  },
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen',
    category: 'Analgesic',
    routes: ['Oral'],
    standardDose: '400 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 10,
    maxDose: 400,
    contraindications: ['Peptic Ulcer', 'Renal Impairment', 'Aspirin Allergy'],
    allergyGroup: 'NSAID',
    frequency: 'Q8H PRN',
    emergency: false,
    color: '#ff9800'
  },
  // Cardiac
  {
    id: 'med-aspirin',
    name: 'Aspirin',
    category: 'Cardiac',
    routes: ['Oral', 'Chewable'],
    standardDose: '300 mg',
    unit: 'mg',
    weightBased: false,
    maxDose: 300,
    contraindications: ['Active Bleeding', 'Peptic Ulcer', 'Aspirin Allergy'],
    allergyGroup: 'NSAID',
    frequency: 'STAT',
    emergency: true,
    color: '#e91e63'
  },
  {
    id: 'med-nitroglycerin',
    name: 'Nitroglycerin',
    category: 'Cardiac',
    routes: ['SL', 'IV'],
    standardDose: '0.4 mg',
    unit: 'mg',
    weightBased: false,
    maxDose: 1.2,
    contraindications: ['Hypotension', 'Sildenafil Use'],
    allergyGroup: 'Nitrate',
    frequency: 'Q5min x3',
    emergency: true,
    color: '#e91e63'
  },
  // Antibiotics
  {
    id: 'med-amoxicillin',
    name: 'Amoxicillin',
    category: 'Antibiotic',
    routes: ['Oral', 'IV'],
    standardDose: '500 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 25,
    maxDose: 500,
    contraindications: ['Penicillin Allergy'],
    allergyGroup: 'Penicillin',
    frequency: 'Q8H',
    emergency: false,
    color: '#9c27b0'
  },
  {
    id: 'med-ceftriaxone',
    name: 'Ceftriaxone',
    category: 'Antibiotic',
    routes: ['IV', 'IM'],
    standardDose: '1 g',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 50,
    maxDose: 2000,
    contraindications: ['Cephalosporin Allergy'],
    allergyGroup: 'Cephalosporin',
    frequency: 'Q24H',
    emergency: false,
    color: '#9c27b0'
  },
  // Sedatives
  {
    id: 'med-diazepam',
    name: 'Diazepam',
    category: 'Sedative',
    routes: ['IV', 'Oral', 'Rectal'],
    standardDose: '5 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.2,
    maxDose: 10,
    contraindications: ['Respiratory Depression', 'Myasthenia Gravis'],
    allergyGroup: 'Benzodiazepine',
    frequency: 'STAT',
    emergency: true,
    color: '#673ab7'
  },
  {
    id: 'med-midazolam',
    name: 'Midazolam',
    category: 'Sedative',
    routes: ['IV', 'IM', 'Intranasal'],
    standardDose: '2 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.1,
    maxDose: 5,
    contraindications: ['Respiratory Depression'],
    allergyGroup: 'Benzodiazepine',
    frequency: 'STAT',
    emergency: true,
    color: '#673ab7'
  },
  // Steroids
  {
    id: 'med-hydrocortisone',
    name: 'Hydrocortisone',
    category: 'Steroid',
    routes: ['IV', 'Oral'],
    standardDose: '100 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 2,
    maxDose: 100,
    contraindications: ['Systemic Fungal Infection'],
    allergyGroup: 'Corticosteroid',
    frequency: 'STAT',
    emergency: true,
    color: '#00bcd4'
  },
  {
    id: 'med-dexamethasone',
    name: 'Dexamethasone',
    category: 'Steroid',
    routes: ['IV', 'Oral'],
    standardDose: '8 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.15,
    maxDose: 10,
    contraindications: ['Systemic Fungal Infection'],
    allergyGroup: 'Corticosteroid',
    frequency: 'Q12H',
    emergency: false,
    color: '#00bcd4'
  },
  // Antidotes
  {
    id: 'med-naloxone',
    name: 'Naloxone',
    category: 'Antidote',
    routes: ['IV', 'IM', 'SC', 'Intranasal'],
    standardDose: '0.4 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.01,
    maxDose: 2,
    contraindications: [],
    allergyGroup: null,
    frequency: 'STAT',
    emergency: true,
    color: '#f44336'
  },
  {
    id: 'med-flumazenil',
    name: 'Flumazenil',
    category: 'Antidote',
    routes: ['IV'],
    standardDose: '0.2 mg',
    unit: 'mg',
    weightBased: false,
    maxDose: 1,
    contraindications: ['Seizure Disorder', 'Chronic Benzodiazepine Use'],
    allergyGroup: null,
    frequency: 'STAT',
    emergency: true,
    color: '#f44336'
  },
  // Respiratory
  {
    id: 'med-salbutamol',
    name: 'Salbutamol (Albuterol)',
    category: 'Respiratory',
    routes: ['Nebulized', 'Inhaled', 'IV'],
    standardDose: '2.5 mg',
    unit: 'mg',
    weightBased: true,
    dosePerKg: 0.15,
    maxDose: 5,
    contraindications: ['Tachyarrhythmia'],
    allergyGroup: 'Beta-agonist',
    frequency: 'Q4-6H PRN',
    emergency: true,
    color: '#4caf50'
  },
  {
    id: 'med-ipratropium',
    name: 'Ipratropium',
    category: 'Respiratory',
    routes: ['Nebulized', 'Inhaled'],
    standardDose: '0.5 mg',
    unit: 'mg',
    weightBased: false,
    maxDose: 0.5,
    contraindications: ['Glaucoma'],
    allergyGroup: 'Anticholinergic',
    frequency: 'Q6H',
    emergency: false,
    color: '#4caf50'
  }
];

// Medication statuses
const MEDICATION_STATUSES = {
  ORDERED: { label: 'Ordered', color: 'warning' },
  GIVEN: { label: 'Given', color: 'success' },
  STOPPED: { label: 'Stopped', color: 'error' },
  HELD: { label: 'Held', color: 'default' },
  DUE: { label: 'Due', color: 'info' }
};

// Allergy groups that cross-react
const ALLERGY_CROSS_REACTIONS = {
  'Penicillin': ['Penicillin', 'Cephalosporin'],
  'NSAID': ['NSAID'],
  'Sulfa': ['Sulfa'],
  'Opioid': ['Opioid'],
  'Benzodiazepine': ['Benzodiazepine']
};

export function MedicationProvider({ children }) {
  const [medications, setMedications] = useState([]);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [patientWeight, setPatientWeight] = useState(null);
  const [patientAge, setPatientAge] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // Get all medications from database
  const getMedicationDatabase = useCallback(() => {
    return MEDICATION_DATABASE;
  }, []);

  // Get emergency medications only
  const getEmergencyMedications = useCallback(() => {
    return MEDICATION_DATABASE.filter(med => med.emergency);
  }, []);

  // Get medications by category
  const getMedicationsByCategory = useCallback((category) => {
    return MEDICATION_DATABASE.filter(med => med.category === category);
  }, []);

  // Check for allergy conflict
  const checkAllergyConflict = useCallback((medication) => {
    if (!patientAllergies.length) return { hasConflict: false, warnings: [] };

    const warnings = [];
    
    // Direct allergy group match
    if (medication.allergyGroup) {
      for (const allergy of patientAllergies) {
        // Check cross-reactions
        const crossReactions = ALLERGY_CROSS_REACTIONS[allergy] || [allergy];
        if (crossReactions.includes(medication.allergyGroup)) {
          warnings.push({
            type: 'ALLERGY',
            severity: 'high',
            message: `Patient allergic to ${allergy}. ${medication.name} contains ${medication.allergyGroup}.`
          });
        }
      }
    }

    // Check contraindications
    for (const contraindication of medication.contraindications || []) {
      if (patientAllergies.some(a => a.toLowerCase().includes(contraindication.toLowerCase()))) {
        warnings.push({
          type: 'CONTRAINDICATION',
          severity: 'medium',
          message: `Contraindicated: ${contraindication}`
        });
      }
    }

    return {
      hasConflict: warnings.length > 0,
      warnings
    };
  }, [patientAllergies]);

  // Calculate dose based on weight
  const calculateDose = useCallback((medication, weight) => {
    const w = weight || patientWeight;
    if (!medication.weightBased || !w) {
      return {
        dose: medication.standardDose,
        calculated: false,
        formula: null
      };
    }

    let calculatedDose = medication.dosePerKg * w;
    let cappedAtMax = false;
    let belowMin = false;

    if (medication.maxDose && calculatedDose > medication.maxDose) {
      calculatedDose = medication.maxDose;
      cappedAtMax = true;
    }

    if (medication.minDose && calculatedDose < medication.minDose) {
      calculatedDose = medication.minDose;
      belowMin = true;
    }

    return {
      dose: `${calculatedDose.toFixed(2)} ${medication.unit}`,
      calculated: true,
      rawDose: calculatedDose,
      formula: `${medication.dosePerKg} ${medication.unit}/kg × ${w} kg`,
      cappedAtMax,
      belowMin,
      maxDose: medication.maxDose ? `${medication.maxDose} ${medication.unit}` : null
    };
  }, [patientWeight]);

  // Add medication to current list
  const addMedication = useCallback((medicationId, customDose, route, frequency, notes) => {
    const medTemplate = MEDICATION_DATABASE.find(m => m.id === medicationId);
    if (!medTemplate) return { success: false, error: 'Medication not found' };

    // Check allergies
    const allergyCheck = checkAllergyConflict(medTemplate);
    
    const now = new Date();
    const newMed = {
      id: `admin_${Date.now()}`,
      medicationId: medTemplate.id,
      name: medTemplate.name,
      category: medTemplate.category,
      dose: customDose || medTemplate.standardDose,
      route: route || medTemplate.routes[0],
      frequency: frequency || medTemplate.frequency,
      notes: notes || '',
      status: 'ORDERED',
      orderedAt: now.toISOString(),
      orderedBy: 'Current User',
      administeredAt: null,
      administeredBy: null,
      color: medTemplate.color,
      allergyWarnings: allergyCheck.warnings
    };

    setMedications(prev => [...prev, newMed]);
    
    // Add to timeline
    setTimeline(prev => [...prev, {
      time: now.toLocaleTimeString(),
      action: 'ORDERED',
      medication: medTemplate.name,
      dose: newMed.dose,
      route: newMed.route,
      user: 'Current User'
    }]);

    return { 
      success: true, 
      medication: newMed,
      allergyWarnings: allergyCheck.warnings
    };
  }, [checkAllergyConflict]);

  // Quick add emergency medication
  const quickAddEmergencyMed = useCallback((medicationId) => {
    const medTemplate = MEDICATION_DATABASE.find(m => m.id === medicationId);
    if (!medTemplate) return { success: false, error: 'Medication not found' };

    // For emergency, calculate dose if weight is available
    const doseInfo = calculateDose(medTemplate, patientWeight);
    
    return addMedication(
      medicationId,
      doseInfo.dose,
      medTemplate.routes[0],
      'STAT',
      'Emergency administration'
    );
  }, [addMedication, calculateDose, patientWeight]);

  // Administer medication (change status to GIVEN)
  const administerMedication = useCallback((medicationAdminId) => {
    const now = new Date();
    
    setMedications(prev => prev.map(med => {
      if (med.id === medicationAdminId) {
        const updatedMed = {
          ...med,
          status: 'GIVEN',
          administeredAt: now.toISOString(),
          administeredBy: 'Current User'
        };
        
        // Add to timeline
        setTimeline(prev => [...prev, {
          time: now.toLocaleTimeString(),
          action: 'GIVEN',
          medication: med.name,
          dose: med.dose,
          route: med.route,
          user: 'Current User'
        }]);
        
        return updatedMed;
      }
      return med;
    }));
  }, []);

  // Stop medication
  const stopMedication = useCallback((medicationAdminId, reason) => {
    const now = new Date();
    
    setMedications(prev => prev.map(med => {
      if (med.id === medicationAdminId) {
        setTimeline(prev => [...prev, {
          time: now.toLocaleTimeString(),
          action: 'STOPPED',
          medication: med.name,
          reason: reason || 'No reason provided',
          user: 'Current User'
        }]);
        
        return {
          ...med,
          status: 'STOPPED',
          stoppedAt: now.toISOString(),
          stopReason: reason
        };
      }
      return med;
    }));
  }, []);

  // Remove medication from list
  const removeMedication = useCallback((medicationAdminId) => {
    setMedications(prev => prev.filter(med => med.id !== medicationAdminId));
  }, []);

  // Update medication
  const updateMedication = useCallback((medicationAdminId, updates) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationAdminId) {
        return { ...med, ...updates };
      }
      return med;
    }));
  }, []);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(MEDICATION_DATABASE.map(m => m.category))];
    return categories;
  }, []);

  // Clear all medications
  const clearMedications = useCallback(() => {
    setMedications([]);
    setTimeline([]);
  }, []);

  const value = {
    // State
    medications,
    patientAllergies,
    patientWeight,
    patientAge,
    timeline,
    
    // Setters
    setPatientAllergies,
    setPatientWeight,
    setPatientAge,
    
    // Database access
    getMedicationDatabase,
    getEmergencyMedications,
    getMedicationsByCategory,
    getCategories,
    
    // Medication actions
    addMedication,
    quickAddEmergencyMed,
    administerMedication,
    stopMedication,
    removeMedication,
    updateMedication,
    clearMedications,
    
    // Calculations & checks
    checkAllergyConflict,
    calculateDose,
    
    // Constants
    MEDICATION_STATUSES
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedication() {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within MedicationProvider');
  }
  return context;
}

export default MedicationContext;