// src/context/AdaptaContext.jsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import RuleEngine from '../core/engines/RuleEngine';
import WorkflowEngine from '../core/engines/WorkflowEngine';
import TemplateEngine from '../core/engines/TemplateEngine';
import PDFEngine from '../core/engines/PDFEngine';
import useTemplateStore from '../core/store/useTemplateStore';
import usePatientStore from '../core/store/usePatientStore';
import useRuleStore from '../core/store/useRuleStore';
import useWorkflowStore from '../core/store/useWorkflowStore';

// Create context
const AdaptaContext = createContext(null);

/**
 * ADAPTA Context Provider
 * Provides access to all engines and stores throughout the app
 */
export const AdaptaProvider = ({ children }) => {
  // Stores
  const templateStore = useTemplateStore();
  const patientStore = usePatientStore();
  const ruleStore = useRuleStore();
  const workflowStore = useWorkflowStore();

  // User/Auth state (simplified for demo)
  const [currentUser, setCurrentUser] = useState({
    id: 'doctor-1',
    name: 'Dr. John Smith',
    role: 'doctor',
    qualification: 'MBBS, MD',
    specialization: 'General Medicine',
    registrationNo: 'MCI-12345',
  });

  // Clinic info
  const [clinicInfo, setClinicInfo] = useState({
    name: 'ADAPTA Medical Center',
    address: '123 Healthcare Avenue, Medical District',
    phone: '+1 (555) 123-4567',
    email: 'info@adapta-medical.com',
    website: 'www.adapta-medical.com',
    primaryColor: '#1976d2',
    registrationNumber: 'HC-2024-001',
  });

  // Initialize engines
  const engines = useMemo(() => {
    const rules = Object.values(ruleStore.rules);
    const ruleEngine = new RuleEngine(rules);
    const workflowEngine = new WorkflowEngine(ruleEngine);
    const templateEngine = new TemplateEngine(ruleEngine);
    const pdfEngine = new PDFEngine();

    // Register workflows
    Object.values(workflowStore.workflows).forEach(w => {
      workflowEngine.registerWorkflow(w);
    });

    // Register templates
    Object.values(templateStore.templates).forEach(t => {
      templateEngine.registerTemplate(t);
    });

    return {
      ruleEngine,
      workflowEngine,
      templateEngine,
      pdfEngine,
    };
  }, [ruleStore.rules, workflowStore.workflows, templateStore.templates]);

  // Context value
  const value = useMemo(() => ({
    // Engines
    ...engines,

    // Stores
    templateStore,
    patientStore,
    ruleStore,
    workflowStore,

    // User & Clinic
    currentUser,
    setCurrentUser,
    clinicInfo,
    setClinicInfo,

    // Helper functions
    getPatientContext: (patientId) => {
      const patient = patientStore.patients[patientId];
      if (!patient) return null;

      return {
        patient,
        visits: patientStore.getVisitsByPatient(patientId),
        prescriptions: patientStore.getPrescriptionsByPatient(patientId),
      };
    },
  }), [engines, templateStore, patientStore, ruleStore, workflowStore, currentUser, clinicInfo]);

  return (
    <AdaptaContext.Provider value={value}>
      {children}
    </AdaptaContext.Provider>
  );
};

// Custom hook to use context
export const useAdapta = () => {
  const context = useContext(AdaptaContext);
  if (!context) {
    throw new Error('useAdapta must be used within an AdaptaProvider');
  }
  return context;
};

export default AdaptaContext;