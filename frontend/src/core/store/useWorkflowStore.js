// src/core/store/useWorkflowStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

const useWorkflowStore = create(
  persist(
    immer((set, get) => ({
      workflows: {},
      instances: {},
      activeWorkflowId: null,
      activeInstanceId: null,

      // Workflow CRUD
      addWorkflow: (workflow) => {
        const id = uuidv4();
        set((state) => {
          state.workflows[id] = {
            ...workflow,
            id,
            version: 1,
            isActive: true,
            metadata: {
              ...workflow.metadata,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        });
        return id;
      },

      updateWorkflow: (id, updates) => {
        set((state) => {
          if (state.workflows[id]) {
            state.workflows[id] = {
              ...state.workflows[id],
              ...updates,
              version: state.workflows[id].version + 1,
              metadata: {
                ...state.workflows[id].metadata,
                ...updates.metadata,
                updatedAt: new Date().toISOString(),
              },
            };
          }
        });
      },

      deleteWorkflow: (id) => {
        set((state) => {
          delete state.workflows[id];
          if (state.activeWorkflowId === id) {
            state.activeWorkflowId = null;
          }
        });
      },

      setActiveWorkflow: (id) => {
        set((state) => {
          state.activeWorkflowId = id;
        });
      },

      toggleWorkflowActive: (id) => {
        set((state) => {
          if (state.workflows[id]) {
            state.workflows[id].isActive = !state.workflows[id].isActive;
          }
        });
      },

      // Step operations
      addStep: (workflowId, step) => {
        const stepId = uuidv4();
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            if (!workflow.steps) workflow.steps = [];
            workflow.steps.push({
              ...step,
              id: stepId,
            });
            workflow.version++;
            workflow.metadata.updatedAt = new Date().toISOString();
          }
        });
        return stepId;
      },

      updateStep: (workflowId, stepId, updates) => {
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
            if (stepIndex !== -1) {
              workflow.steps[stepIndex] = {
                ...workflow.steps[stepIndex],
                ...updates,
              };
              workflow.version++;
              workflow.metadata.updatedAt = new Date().toISOString();
            }
          }
        });
      },

      deleteStep: (workflowId, stepId) => {
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            workflow.steps = workflow.steps.filter(s => s.id !== stepId);
            // Also remove transitions involving this step
            workflow.transitions = (workflow.transitions || []).filter(
              t => t.fromStepId !== stepId && t.toStepId !== stepId
            );
            workflow.version++;
            workflow.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      // Transition operations
      addTransition: (workflowId, transition) => {
        const transitionId = uuidv4();
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            if (!workflow.transitions) workflow.transitions = [];
            workflow.transitions.push({
              ...transition,
              id: transitionId,
            });
            workflow.version++;
            workflow.metadata.updatedAt = new Date().toISOString();
          }
        });
        return transitionId;
      },

      updateTransition: (workflowId, transitionId, updates) => {
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            const transitionIndex = workflow.transitions.findIndex(t => t.id === transitionId);
            if (transitionIndex !== -1) {
              workflow.transitions[transitionIndex] = {
                ...workflow.transitions[transitionIndex],
                ...updates,
              };
              workflow.version++;
              workflow.metadata.updatedAt = new Date().toISOString();
            }
          }
        });
      },

      deleteTransition: (workflowId, transitionId) => {
        set((state) => {
          const workflow = state.workflows[workflowId];
          if (workflow) {
            workflow.transitions = workflow.transitions.filter(t => t.id !== transitionId);
            workflow.version++;
            workflow.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      // Instance operations
      createInstance: (workflowId, patientId, initialData = {}) => {
        const workflow = get().workflows[workflowId];
        if (!workflow || !workflow.isActive) return null;

        const instanceId = uuidv4();
        set((state) => {
          state.instances[instanceId] = {
            id: instanceId,
            workflowId,
            patientId,
            currentStepId: workflow.startStepId || workflow.steps[0]?.id,
            status: 'active',
            data: initialData,
            history: [{
              stepId: workflow.startStepId || workflow.steps[0]?.id,
              stepName: workflow.steps.find(s => s.id === (workflow.startStepId || workflow.steps[0]?.id))?.name,
              enteredAt: new Date().toISOString(),
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        return instanceId;
      },

      updateInstance: (instanceId, updates) => {
        set((state) => {
          if (state.instances[instanceId]) {
            state.instances[instanceId] = {
              ...state.instances[instanceId],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        });
      },

      completeStep: (instanceId, stepData = {}) => {
        set((state) => {
          const instance = state.instances[instanceId];
          if (!instance) return;

          const workflow = state.workflows[instance.workflowId];
          if (!workflow) return;

          // Update current history entry
          const currentHistory = instance.history[instance.history.length - 1];
          if (currentHistory) {
            currentHistory.exitedAt = new Date().toISOString();
            currentHistory.data = stepData;
          }

          // Store step data
          instance.data[instance.currentStepId] = stepData;
          instance.updatedAt = new Date().toISOString();
        });
      },

      moveToStep: (instanceId, stepId) => {
        set((state) => {
          const instance = state.instances[instanceId];
          if (!instance) return;

          const workflow = state.workflows[instance.workflowId];
          if (!workflow) return;

          const step = workflow.steps.find(s => s.id === stepId);
          if (!step) return;

          instance.currentStepId = stepId;
          instance.history.push({
            stepId,
            stepName: step.name,
            enteredAt: new Date().toISOString(),
          });
          instance.updatedAt = new Date().toISOString();
        });
      },

      completeWorkflow: (instanceId) => {
        set((state) => {
          if (state.instances[instanceId]) {
            state.instances[instanceId].status = 'completed';
            state.instances[instanceId].updatedAt = new Date().toISOString();
          }
        });
      },

      cancelWorkflow: (instanceId, reason = '') => {
        set((state) => {
          if (state.instances[instanceId]) {
            state.instances[instanceId].status = 'cancelled';
            state.instances[instanceId].cancelReason = reason;
            state.instances[instanceId].updatedAt = new Date().toISOString();
          }
        });
      },

      // Getters
      getWorkflow: (id) => get().workflows[id],
      getInstance: (id) => get().instances[id],
      
      getAllWorkflows: () => Object.values(get().workflows),
      getActiveWorkflows: () => Object.values(get().workflows).filter(w => w.isActive),
      
      getInstancesByPatient: (patientId) => 
        Object.values(get().instances).filter(i => i.patientId === patientId),
      
      getActiveInstancesByPatient: (patientId) =>
        Object.values(get().instances).filter(i => i.patientId === patientId && i.status === 'active'),

      // Export/Import
      exportWorkflows: () => JSON.stringify(get().workflows, null, 2),
      
      importWorkflows: (json) => {
        try {
          const workflows = JSON.parse(json);
          set((state) => {
            Object.values(workflows).forEach(w => {
              const newId = uuidv4();
              state.workflows[newId] = { ...w, id: newId };
            });
          });
          return true;
        } catch {
          return false;
        }
      },
    })),
    {
      name: 'adapta-workflows',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWorkflowStore;