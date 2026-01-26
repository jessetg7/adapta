import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const [workflows, setWorkflows] = useState([
    {
      id: 'workflow-1',
      name: 'OPD Registration',
      description: 'Standard outpatient registration workflow',
      status: 'active',
      steps: [
        { id: 'step-1', name: 'Registration', assignedRole: 'Staff' },
        { id: 'step-2', name: 'Vitals Check', assignedRole: 'Nurse' },
        { id: 'step-3', name: 'Consultation', assignedRole: 'Doctor' }
      ]
    }
  ]);

  return (
    <WorkflowContext.Provider value={{ workflows, setWorkflows, isLoading: false }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
}

export default WorkflowContext;