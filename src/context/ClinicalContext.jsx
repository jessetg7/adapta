import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import medicationsData from '../data/medications.json';
import clinicalRulesData from '../data/clinicalRules.json';
import clinicalBlocksData from '../data/clinicalBlocks.json';

const ClinicalContext = createContext(null);

export function ClinicalProvider({ children }) {
  // ==================== STATE ====================
  const [patientData, setPatientData] = useState({
    age: null,
    weight: null,
    allergies: [],
    currentMedications: [],
    vitals: {},
    riskFactors: []
  });

  const [administeredMeds, setAdministeredMeds] = useState([]);
  const [medicationTimeline, setMedicationTimeline] = useState([]);
  const [blockedMedications, setBlockedMedications] = useState([]);
  const [suggestedMedications, setSuggestedMedications] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [clinicalMode, setClinicalMode] = useState('normal'); // normal, pediatric, geriatric
  const [firedRules, setFiredRules] = useState([]);
  
  // ==================== MEDICATION DATABASE ====================
  const medications = useMemo(() => medicationsData.medications, []);
  const medicationCategories = useMemo(() => medicationsData.categories, []);
  const medicationStatuses = useMemo(() => medicationsData.statuses, []);
  
  // ==================== CLINICAL RULES ====================
  const rules = useMemo(() => clinicalRulesData.rules, []);
  
  // ==================== CLINICAL BLOCKS ====================
  const blocks = useMemo(() => clinicalBlocksData.blocks, []);

  // ==================== GET MEDICATION BY ID ====================
  const getMedicationById = useCallback((id) => {
    return medications.find(m => m.id === id);
  }, [medications]);

  // ==================== GET EMERGENCY MEDICATIONS ====================
  const getEmergencyMedications = useCallback(() => {
    return medications.filter(m => m.emergency === true);
  }, [medications]);

  // ==================== GET MEDICATIONS BY CATEGORY ====================
  const getMedicationsByCategory = useCallback((category) => {
    return medications.filter(m => m.category === category);
  }, [medications]);

  // ==================== CHECK ALLERGY ====================
  const checkAllergyConflict = useCallback((medicationId) => {
    const medication = getMedicationById(medicationId);
    if (!medication || !patientData.allergies.length) return null;

    const conflicts = [];
    
    medication.allergyGroups?.forEach(allergyGroup => {
      if (patientData.allergies.some(a => 
        a.toLowerCase().includes(allergyGroup.toLowerCase()) ||
        allergyGroup.toLowerCase().includes(a.toLowerCase())
      )) {
        conflicts.push({
          type: 'allergy',
          severity: 'critical',
          allergyGroup,
          message: `Patient allergic to ${allergyGroup}`
        });
      }
    });

    // Direct medication name match
    if (patientData.allergies.some(a => 
      medication.name.toLowerCase().includes(a.toLowerCase()) ||
      medication.genericName?.toLowerCase().includes(a.toLowerCase())
    )) {
      conflicts.push({
        type: 'allergy',
        severity: 'critical',
        message: `Patient allergic to ${medication.name}`
      });
    }

    return conflicts.length > 0 ? conflicts : null;
  }, [getMedicationById, patientData.allergies]);

  // ==================== CHECK DRUG INTERACTIONS ====================
  const checkDrugInteractions = useCallback((medicationId) => {
    const medication = getMedicationById(medicationId);
    if (!medication) return null;

    const interactions = [];
    
    // Check against administered medications
    administeredMeds.forEach(adminMed => {
      const adminMedData = getMedicationById(adminMed.medicationId);
      if (!adminMedData) return;

      // Check if this med interacts with any administered med
      if (medication.interactions?.some(i => 
        adminMedData.name.toLowerCase().includes(i.toLowerCase()) ||
        adminMedData.category === i.toLowerCase()
      )) {
        interactions.push({
          type: 'interaction',
          severity: 'warning',
          interactsWith: adminMedData.name,
          message: `May interact with ${adminMedData.name}`
        });
      }
    });

    // Check contraindications
    medication.contraindications?.forEach(contra => {
      if (patientData.riskFactors?.some(rf => 
        rf.toLowerCase().includes(contra.toLowerCase())
      )) {
        interactions.push({
          type: 'contraindication',
          severity: 'warning',
          condition: contra,
          message: `Contraindicated: ${contra}`
        });
      }
    });

    return interactions.length > 0 ? interactions : null;
  }, [getMedicationById, administeredMeds, patientData.riskFactors]);

  // ==================== CALCULATE PEDIATRIC DOSE ====================
  const calculatePediatricDose = useCallback((medicationId) => {
    const medication = getMedicationById(medicationId);
    if (!medication || !patientData.weight) return null;

    const weight = parseFloat(patientData.weight);
    if (isNaN(weight) || weight <= 0) return null;

    const dosePerKg = medication.pediatricDosePerKg || medication.dosePerKg;
    if (!dosePerKg) return null;

    let calculatedDose = dosePerKg * weight;
    const maxDose = medication.pediatricMaxDose || medication.maxDose;
    const minDose = medication.minDose || 0;

    let warning = null;
    if (maxDose && calculatedDose > maxDose) {
      warning = `Calculated dose exceeds max (${maxDose}${medication.standardUnit}). Using max dose.`;
      calculatedDose = maxDose;
    }
    if (minDose && calculatedDose < minDose) {
      warning = `Calculated dose below minimum (${minDose}${medication.standardUnit}). Using min dose.`;
      calculatedDose = minDose;
    }

    return {
      calculatedDose: calculatedDose.toFixed(2),
      unit: medication.standardUnit,
      formula: `${dosePerKg} ${medication.standardUnit}/kg × ${weight} kg`,
      maxDose,
      warning,
      route: medication.routes?.[0] || 'IV'
    };
  }, [getMedicationById, patientData.weight]);

  // ==================== ADD MEDICATION ====================
  const addMedication = useCallback((medicationId, dose, route, frequency, notes = '') => {
    const medication = getMedicationById(medicationId);
    if (!medication) return { success: false, error: 'Medication not found' };

    // Check allergy
    const allergyConflict = checkAllergyConflict(medicationId);
    if (allergyConflict) {
      return { 
        success: false, 
        error: 'Allergy conflict detected',
        conflicts: allergyConflict
      };
    }

    // Check if medication is blocked by rules
    if (blockedMedications.includes(medicationId)) {
      return {
        success: false,
        error: 'Medication blocked by clinical rules',
        blocked: true
      };
    }

    // Check interactions
    const interactions = checkDrugInteractions(medicationId);
    
    const now = new Date();
    const newEntry = {
      id: `admin_${Date.now()}`,
      medicationId,
      medicationName: medication.name,
      category: medication.category,
      dose,
      route,
      frequency,
      notes,
      status: 'ordered',
      orderedAt: now.toISOString(),
      orderedBy: 'Current User', // Would come from auth context
      administeredAt: null,
      administeredBy: null,
      interactions
    };

    setAdministeredMeds(prev => [...prev, newEntry]);
    
    // Add to timeline
    setMedicationTimeline(prev => [...prev, {
      time: now.toLocaleTimeString(),
      action: 'Ordered',
      medication: medication.name,
      dose,
      route,
      by: 'Current User'
    }]);

    return { 
      success: true, 
      entry: newEntry,
      warnings: interactions 
    };
  }, [getMedicationById, checkAllergyConflict, checkDrugInteractions, blockedMedications]);

  // ==================== ADMINISTER MEDICATION ====================
  const administerMedication = useCallback((entryId) => {
    const now = new Date();
    
    setAdministeredMeds(prev => prev.map(med => {
      if (med.id === entryId) {
        return {
          ...med,
          status: 'given',
          administeredAt: now.toISOString(),
          administeredBy: 'Current User'
        };
      }
      return med;
    }));

    // Update timeline
    const entry = administeredMeds.find(m => m.id === entryId);
    if (entry) {
      setMedicationTimeline(prev => [...prev, {
        time: now.toLocaleTimeString(),
        action: 'Administered',
        medication: entry.medicationName,
        dose: entry.dose,
        route: entry.route,
        by: 'Current User'
      }]);
    }
  }, [administeredMeds]);

  // ==================== QUICK ADD EMERGENCY MED ====================
  const quickAddEmergencyMed = useCallback((medicationId) => {
    const medication = getMedicationById(medicationId);
    if (!medication) return { success: false, error: 'Medication not found' };

    // Use default dose for emergency
    let dose = medication.standardDose;
    
    // If pediatric mode and weight available, calculate dose
    if (clinicalMode === 'pediatric' && patientData.weight) {
      const calcDose = calculatePediatricDose(medicationId);
      if (calcDose) {
        dose = `${calcDose.calculatedDose} ${calcDose.unit}`;
      }
    }

    return addMedication(
      medicationId,
      dose,
      medication.routes?.[0] || 'IV',
      'STAT',
      'Emergency administration'
    );
  }, [getMedicationById, addMedication, clinicalMode, patientData.weight, calculatePediatricDose]);

  // ==================== UPDATE PATIENT DATA ====================
  const updatePatientData = useCallback((updates) => {
    setPatientData(prev => ({ ...prev, ...updates }));
    
    // Trigger rule evaluation
    evaluateRules({ ...patientData, ...updates });
  }, [patientData]);

  // ==================== SET PATIENT ALLERGIES ====================
  const setPatientAllergies = useCallback((allergies) => {
    const allergyList = Array.isArray(allergies) ? allergies : [allergies];
    setPatientData(prev => ({ ...prev, allergies: allergyList }));
    
    // Update blocked medications based on allergies
    const blocked = [];
    medications.forEach(med => {
      const conflict = med.allergyGroups?.some(ag => 
        allergyList.some(a => 
          a.toLowerCase().includes(ag.toLowerCase()) ||
          ag.toLowerCase().includes(a.toLowerCase())
        )
      );
      if (conflict) {
        blocked.push(med.id);
      }
    });
    setBlockedMedications(blocked);
  }, [medications]);

  // ==================== EVALUATE RULES ====================
  const evaluateRules = useCallback((data) => {
    const fired = [];
    const alerts = [];
    const suggestions = [];
    const blocked = [...blockedMedications];

    rules.forEach(rule => {
      if (!rule.enabled) return;

      // Evaluate conditions
      let conditionsMet = true;
      const conditionLogic = rule.conditionLogic || 'AND';
      
      if (conditionLogic === 'AND') {
        conditionsMet = rule.conditions.every(condition => 
          evaluateCondition(condition, data)
        );
      } else {
        conditionsMet = rule.conditions.some(condition => 
          evaluateCondition(condition, data)
        );
      }

      if (conditionsMet) {
        fired.push(rule);
        
        // Execute actions
        rule.actions.forEach(action => {
          switch (action.type) {
            case 'showAlert':
              alerts.push({
                id: `alert_${Date.now()}_${Math.random()}`,
                ruleId: rule.id,
                ruleName: rule.name,
                severity: action.params.severity,
                message: action.params.message,
                timestamp: new Date().toISOString()
              });
              break;
            case 'suggestMedication':
              suggestions.push(action.params.medicationId);
              break;
            case 'blockMedicationGroup':
              medications.forEach(med => {
                if (med.allergyGroups?.includes(action.params.allergyGroup)) {
                  if (!blocked.includes(med.id)) blocked.push(med.id);
                }
              });
              break;
            case 'enablePediatricDosing':
              setClinicalMode('pediatric');
              break;
            case 'enableGeriatricMode':
              setClinicalMode('geriatric');
              break;
          }
        });
      }
    });

    setFiredRules(fired);
    setActiveAlerts(alerts);
    setSuggestedMedications(suggestions);
    setBlockedMedications(blocked);
  }, [rules, blockedMedications, medications]);

  // ==================== EVALUATE SINGLE CONDITION ====================
  const evaluateCondition = useCallback((condition, data) => {
    const { field, operator, value } = condition;
    const fieldValue = data[field];

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'greaterThan':
        return parseFloat(fieldValue) > parseFloat(value);
      case 'lessThan':
        return parseFloat(fieldValue) < parseFloat(value);
      case 'greaterThanOrEqual':
        return parseFloat(fieldValue) >= parseFloat(value);
      case 'lessThanOrEqual':
        return parseFloat(fieldValue) <= parseFloat(value);
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(v => v.toLowerCase().includes(value.toLowerCase()));
        }
        return String(fieldValue).toLowerCase().includes(value.toLowerCase());
      case 'in':
        return Array.isArray(value) ? value.includes(fieldValue) : fieldValue === value;
      case 'isEmpty':
        return !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'isNotEmpty':
        return fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return false;
    }
  }, []);

  // ==================== GET BLOCK BY ID ====================
  const getBlockById = useCallback((blockId) => {
    return blocks.find(b => b.id === blockId);
  }, [blocks]);

  // ==================== CLEAR ALERTS ====================
  const clearAlert = useCallback((alertId) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  // ==================== GET CLINICAL SUMMARY ====================
  const getClinicalSummary = useCallback(() => {
    return {
      patientAge: patientData.age,
      patientWeight: patientData.weight,
      allergiesCount: patientData.allergies.length,
      allergies: patientData.allergies,
      medicationsGiven: administeredMeds.filter(m => m.status === 'given').length,
      medicationsOrdered: administeredMeds.filter(m => m.status === 'ordered').length,
      activeAlerts: activeAlerts.length,
      criticalAlerts: activeAlerts.filter(a => a.severity === 'critical').length,
      clinicalMode,
      firedRules: firedRules.length,
      blockedMedications: blockedMedications.length,
      suggestedMedications: suggestedMedications.length
    };
  }, [patientData, administeredMeds, activeAlerts, clinicalMode, firedRules, blockedMedications, suggestedMedications]);

  // ==================== CONTEXT VALUE ====================
  const value = {
    // Patient data
    patientData,
    updatePatientData,
    setPatientAllergies,
    
    // Medications
    medications,
    medicationCategories,
    medicationStatuses,
    getMedicationById,
    getEmergencyMedications,
    getMedicationsByCategory,
    
    // Administered medications
    administeredMeds,
    medicationTimeline,
    addMedication,
    administerMedication,
    quickAddEmergencyMed,
    
    // Safety checks
    checkAllergyConflict,
    checkDrugInteractions,
    blockedMedications,
    suggestedMedications,
    
    // Dosing
    calculatePediatricDose,
    clinicalMode,
    setClinicalMode,
    
    // Rules & Alerts
    rules,
    firedRules,
    activeAlerts,
    clearAlert,
    evaluateRules,
    
    // Blocks
    blocks,
    getBlockById,
    
    // Summary
    getClinicalSummary
  };

  return (
    <ClinicalContext.Provider value={value}>
      {children}
    </ClinicalContext.Provider>
  );
}

export function useClinical() {
  const context = useContext(ClinicalContext);
  if (!context) {
    throw new Error('useClinical must be used within ClinicalProvider');
  }
  return context;
}

export default ClinicalContext;