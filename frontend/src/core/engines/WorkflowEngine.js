// src/core/engines/WorkflowEngine.js
import { v4 as uuidv4 } from 'uuid';
import RuleEngine from './RuleEngine';

/**
 * ADAPTA Workflow Engine
 * Manages patient flow through hospital processes
 * All workflows are JSON-configurable
 */
class WorkflowEngine {
  constructor(ruleEngine = null) {
    this.workflows = new Map();
    this.instances = new Map();
    this.ruleEngine = ruleEngine || new RuleEngine();
    this.eventListeners = new Set();
  }

  // ============================================
  // WORKFLOW MANAGEMENT
  // ============================================
  
  registerWorkflow(workflow) {
    this.workflows.set(workflow.id, workflow);
  }

  unregisterWorkflow(workflowId) {
    this.workflows.delete(workflowId);
  }

  getWorkflow(workflowId) {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows() {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows() {
    return this.getAllWorkflows().filter(w => w.isActive);
  }

  updateWorkflow(workflowId, updates) {
    const existing = this.workflows.get(workflowId);
    if (existing) {
      this.workflows.set(workflowId, { 
        ...existing, 
        ...updates, 
        version: existing.version + 1 
      });
    }
  }

  // ============================================
  // INSTANCE MANAGEMENT
  // ============================================
  
  startWorkflow(workflowId, patientId, initialData = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.isActive) {
      console.error(`Workflow ${workflowId} not found or inactive`);
      return null;
    }

    const instance = {
      id: uuidv4(),
      workflowId,
      patientId,
      currentStepId: workflow.startStepId,
      status: 'active',
      data: initialData,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Enter the first step
    this.enterStep(instance, workflow.startStepId);
    this.instances.set(instance.id, instance);

    return instance;
  }

  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }

  getInstancesByPatient(patientId) {
    return Array.from(this.instances.values()).filter(
      i => i.patientId === patientId
    );
  }

  getActiveInstancesByPatient(patientId) {
    return this.getInstancesByPatient(patientId).filter(
      i => i.status === 'active'
    );
  }

  // ============================================
  // STEP NAVIGATION
  // ============================================
  
  enterStep(instance, stepId) {
    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return;

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) {
      console.error(`Step ${stepId} not found in workflow ${instance.workflowId}`);
      return;
    }

    // Check entry conditions
    if (step.entryConditions) {
      const context = this.buildContext(instance);
      const canEnter = this.ruleEngine.evaluateConditionGroup(step.entryConditions, context);
      if (!canEnter) {
        this.emitEvent({
          type: 'error',
          instanceId: instance.id,
          stepId,
          data: { error: 'Entry conditions not met' },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    // Add to history
    const historyEntry = {
      stepId,
      stepName: step.name,
      enteredAt: new Date().toISOString(),
    };
    instance.history.push(historyEntry);
    instance.currentStepId = stepId;
    instance.updatedAt = new Date().toISOString();

    this.emitEvent({
      type: 'step-entered',
      instanceId: instance.id,
      stepId,
      timestamp: new Date().toISOString(),
    });
  }

  completeStep(instanceId, stepData = {}, performedBy = null) {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'active') {
      return { success: false, error: 'Instance not found or not active' };
    }

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) {
      return { success: false, error: 'Workflow not found' };
    }

    const currentStep = workflow.steps.find(s => s.id === instance.currentStepId);
    if (!currentStep) {
      return { success: false, error: 'Current step not found' };
    }

    // Check exit conditions
    const context = this.buildContext(instance, stepData);
    if (currentStep.exitConditions) {
      const canExit = this.ruleEngine.evaluateConditionGroup(currentStep.exitConditions, context);
      if (!canExit) {
        return { success: false, error: 'Exit conditions not met' };
      }
    }

    // Merge step data
    instance.data = { ...instance.data, [currentStep.id]: stepData };

    // Update history
    const historyEntry = instance.history[instance.history.length - 1];
    if (historyEntry && historyEntry.stepId === currentStep.id) {
      historyEntry.exitedAt = new Date().toISOString();
      historyEntry.data = stepData;
      historyEntry.performedBy = performedBy;
    }

    this.emitEvent({
      type: 'step-completed',
      instanceId: instance.id,
      stepId: currentStep.id,
      data: stepData,
      timestamp: new Date().toISOString(),
    });

    // Find next step
    const nextTransition = this.findNextTransition(workflow, instance, context);
    
    if (!nextTransition) {
      // Check if this is an end step
      if (workflow.endStepIds.includes(currentStep.id)) {
        instance.status = 'completed';
        instance.updatedAt = new Date().toISOString();
        this.emitEvent({
          type: 'workflow-completed',
          instanceId: instance.id,
          timestamp: new Date().toISOString(),
        });
        return { success: true };
      }
      return { success: false, error: 'No valid transition found' };
    }

    // Move to next step
    this.emitEvent({
      type: 'transition',
      instanceId: instance.id,
      stepId: currentStep.id,
      data: { toStepId: nextTransition.toStepId },
      timestamp: new Date().toISOString(),
    });

    this.enterStep(instance, nextTransition.toStepId);
    this.instances.set(instanceId, instance);

    return { success: true, nextStepId: nextTransition.toStepId };
  }

  findNextTransition(workflow, instance, context) {
    const currentStepId = instance.currentStepId;
    
    // Get all transitions from current step, sorted by priority
    const possibleTransitions = workflow.transitions
      .filter(t => t.fromStepId === currentStepId)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    for (const transition of possibleTransitions) {
      if (!transition.conditions) {
        // No conditions, this transition is valid
        return transition;
      }

      const conditionsMet = this.ruleEngine.evaluateConditionGroup(
        transition.conditions,
        context
      );
      if (conditionsMet) {
        return transition;
      }
    }

    return null;
  }

  goToStep(instanceId, stepId) {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'active') {
      return { success: false, error: 'Instance not found or not active' };
    }

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) {
      return { success: false, error: 'Workflow not found' };
    }

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) {
      return { success: false, error: 'Step not found' };
    }

    // Direct navigation (for admin/override scenarios)
    this.enterStep(instance, stepId);
    this.instances.set(instanceId, instance);

    return { success: true };
  }

  cancelWorkflow(instanceId, reason = null) {
    const instance = this.instances.get(instanceId);
    if (!instance) return false;

    instance.status = 'cancelled';
    instance.updatedAt = new Date().toISOString();
    
    const historyEntry = instance.history[instance.history.length - 1];
    if (historyEntry) {
      historyEntry.exitedAt = new Date().toISOString();
      historyEntry.action = `Cancelled: ${reason || 'No reason provided'}`;
    }

    this.instances.set(instanceId, instance);

    this.emitEvent({
      type: 'workflow-cancelled',
      instanceId: instance.id,
      data: { reason },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  pauseWorkflow(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'active') return false;

    instance.status = 'paused';
    instance.updatedAt = new Date().toISOString();
    this.instances.set(instanceId, instance);

    return true;
  }

  resumeWorkflow(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance || instance.status !== 'paused') return false;

    instance.status = 'active';
    instance.updatedAt = new Date().toISOString();
    this.instances.set(instanceId, instance);

    return true;
  }

  // ============================================
  // CONTEXT BUILDING
  // ============================================
  
  buildContext(instance, additionalData = {}) {
    return {
      formData: { ...instance.data, ...additionalData },
      timestamp: new Date().toISOString(),
      custom: {
        workflowId: instance.workflowId,
        instanceId: instance.id,
        currentStepId: instance.currentStepId,
        status: instance.status,
      },
    };
  }

  // ============================================
  // STEP INFORMATION
  // ============================================
  
  getCurrentStep(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return null;

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return null;

    return workflow.steps.find(s => s.id === instance.currentStepId) || null;
  }

  getAvailableTransitions(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return [];

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return [];

    return workflow.transitions.filter(t => t.fromStepId === instance.currentStepId);
  }

  getStepProgress(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return { current: 0, total: 0, percentage: 0 };

    const workflow = this.workflows.get(instance.workflowId);
    if (!workflow) return { current: 0, total: 0, percentage: 0 };

    const completedSteps = instance.history.filter(h => h.exitedAt).length;
    const totalSteps = workflow.steps.length;

    return {
      current: completedSteps,
      total: totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100),
    };
  }

  // ============================================
  // EVENT HANDLING
  // ============================================
  
  subscribe(callback) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  emitEvent(event) {
    this.eventListeners.forEach(listener => listener(event));
  }

  // ============================================
  // STATIC BUILDER HELPERS
  // ============================================
  
  static createStep(name, type, options = {}) {
    return {
      id: uuidv4(),
      name,
      type,
      templateId: options.templateId,
      assignedRole: options.assignedRole,
      assignedUser: options.assignedUser,
      entryConditions: options.entryConditions,
      exitConditions: options.exitConditions,
      actions: options.actions,
      timeoutMinutes: options.timeoutMinutes,
      timeoutAction: options.timeoutAction,
      position: options.position || { x: 0, y: 0 },
      config: options.config,
    };
  }

  static createTransition(fromStepId, toStepId, options = {}) {
    return {
      id: uuidv4(),
      fromStepId,
      toStepId,
      conditions: options.conditions,
      label: options.label,
      priority: options.priority ?? 0,
    };
  }

  static createWorkflow(name, steps, transitions, options = {}) {
    return {
      id: uuidv4(),
      name,
      description: options.description,
      department: options.department,
      category: options.category,
      steps,
      transitions,
      startStepId: steps[0]?.id || '',
      endStepIds: options.endStepIds || [steps[steps.length - 1]?.id || ''],
      version: 1,
      isActive: options.isActive ?? true,
      metadata: options.metadata || {
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // ============================================
  // SERIALIZATION
  // ============================================
  
  exportWorkflows() {
    return JSON.stringify(Array.from(this.workflows.values()), null, 2);
  }

  importWorkflows(json) {
    const workflows = JSON.parse(json);
    workflows.forEach(workflow => this.registerWorkflow(workflow));
  }

  exportInstances() {
    return JSON.stringify(Array.from(this.instances.values()), null, 2);
  }

  importInstances(json) {
    const instances = JSON.parse(json);
    instances.forEach(instance => this.instances.set(instance.id, instance));
  }
}

// Factory function
export const createWorkflowEngine = (ruleEngine) => new WorkflowEngine(ruleEngine);

export default WorkflowEngine;