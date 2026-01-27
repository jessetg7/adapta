// src/hooks/useWorkflow.js
import { useCallback, useMemo } from 'react';
import useWorkflowStore from '../core/store/useWorkflowStore';

/**
 * Hook for workflow operations
 */
export const useWorkflow = (workflowId = null) => {
  const store = useWorkflowStore();

  // Get current workflow
  const workflow = useMemo(() => {
    if (!workflowId) return null;
    return store.workflows[workflowId];
  }, [workflowId, store.workflows]);

  // Start a new workflow instance
  const startWorkflow = useCallback((patientId, initialData = {}) => {
    if (!workflowId) return null;
    return store.createInstance(workflowId, patientId, initialData);
  }, [workflowId, store]);

  // Get instance for patient
  const getPatientInstances = useCallback((patientId) => {
    return store.getInstancesByPatient(patientId);
  }, [store]);

  // Get active instance for patient
  const getActiveInstance = useCallback((patientId) => {
    const instances = store.getActiveInstancesByPatient(patientId);
    return instances[0] || null;
  }, [store]);

  // Get current step
  const getCurrentStep = useCallback((instanceId) => {
    const instance = store.instances[instanceId];
    if (!instance || !workflow) return null;
    
    return workflow.steps.find(s => s.id === instance.currentStepId);
  }, [store.instances, workflow]);

  // Get available transitions
  const getAvailableTransitions = useCallback((instanceId) => {
    const instance = store.instances[instanceId];
    if (!instance || !workflow) return [];
    
    return (workflow.transitions || []).filter(
      t => t.fromStepId === instance.currentStepId
    );
  }, [store.instances, workflow]);

  // Move to next step
  const moveToNextStep = useCallback((instanceId, transitionId = null) => {
    const instance = store.instances[instanceId];
    if (!instance || !workflow) return false;

    const transitions = getAvailableTransitions(instanceId);
    
    let nextTransition;
    if (transitionId) {
      nextTransition = transitions.find(t => t.id === transitionId);
    } else {
      nextTransition = transitions[0]; // Default to first available
    }

    if (!nextTransition) return false;

    store.moveToStep(instanceId, nextTransition.toStepId);
    return true;
  }, [store, workflow, getAvailableTransitions]);

  // Complete current step
  const completeStep = useCallback((instanceId, stepData = {}) => {
    store.completeStep(instanceId, stepData);
  }, [store]);

  // Get progress
  const getProgress = useCallback((instanceId) => {
    const instance = store.instances[instanceId];
    if (!instance || !workflow) return { current: 0, total: 0, percentage: 0 };

    const completedSteps = instance.history.filter(h => h.exitedAt).length;
    const totalSteps = workflow.steps.length;

    return {
      current: completedSteps,
      total: totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100),
    };
  }, [store.instances, workflow]);

  return {
    workflow,
    startWorkflow,
    getPatientInstances,
    getActiveInstance,
    getCurrentStep,
    getAvailableTransitions,
    moveToNextStep,
    completeStep,
    completeWorkflow: store.completeWorkflow,
    cancelWorkflow: store.cancelWorkflow,
    getProgress,
    allWorkflows: store.getAllWorkflows(),
    activeWorkflows: store.getActiveWorkflows(),
  };
};

export default useWorkflow;