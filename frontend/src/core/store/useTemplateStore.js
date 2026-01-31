import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { templateService } from '../../services/templateService';
import { configService } from '../../services/configService';

const useTemplateStore = create(
  persist(
    immer((set, get) => ({
      templates: {},
      prescriptionTemplates: {},
      remoteTemplates: [],
      specialties: [],
      vitals: [],
      medicationRoutes: [],
      frequencies: [],
      loading: false,
      error: null,
      activeTemplateId: null,

      fetchVitals: async () => {
        set({ loading: true, error: null });
        try {
          const response = await configService.getVitals();
          set((state) => {
            state.vitals = response.data;
            state.loading = false;
          });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          return [];
        }
      },

      fetchMetadata: async () => {
        set({ loading: true, error: null });
        try {
          const response = await configService.getMetadata();
          set((state) => {
            state.medicationRoutes = response.data.routes;
            state.frequencies = response.data.frequencies;
            state.loading = false;
          });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      fetchSpecialties: async () => {
        set({ loading: true, error: null });
        try {
          const response = await templateService.getSpecialties();
          set((state) => {
            state.specialties = response.data;
            state.loading = false;
          });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          return [];
        }
      },

      fetchDepartmentTemplates: async (specialty) => {
        set({ loading: true, error: null });
        try {
          const response = await templateService.getTemplates({ category: 'department', specialty });
          set((state) => {
            state.remoteTemplates = response.data;
            state.loading = false;
          });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          return [];
        }
      },

      // Template CRUD
      addTemplate: (template) => {
        const id = uuidv4();
        set((state) => {
          state.templates[id] = {
            ...template,
            id,
            version: 1,
            metadata: {
              ...template.metadata,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        });
        return id;
      },

      updateTemplate: (id, updates) => {
        set((state) => {
          if (state.templates[id]) {
            state.templates[id] = {
              ...state.templates[id],
              ...updates,
              version: state.templates[id].version + 1,
              metadata: {
                ...state.templates[id].metadata,
                ...updates.metadata,
                updatedAt: new Date().toISOString(),
              },
            };
          }
        });
      },

      deleteTemplate: (id) => {
        set((state) => {
          delete state.templates[id];
          if (state.activeTemplateId === id) {
            state.activeTemplateId = null;
          }
        });
      },

      cloneTemplate: (id) => {
        const original = get().templates[id];
        if (!original) return null;

        const newId = uuidv4();
        set((state) => {
          const cloned = JSON.parse(JSON.stringify(original));
          cloned.id = newId;
          cloned.name = `${original.name} (Copy)`;
          cloned.version = 1;
          cloned.metadata = {
            ...cloned.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSystem: false,
          };
          // Regenerate section and field IDs
          cloned.sections = cloned.sections.map((section) => ({
            ...section,
            id: uuidv4(),
            fields: section.fields.map((field) => ({
              ...field,
              id: uuidv4(),
            })),
          }));
          state.templates[newId] = cloned;
        });
        return newId;
      },

      setActiveTemplate: (id) => {
        set((state) => {
          state.activeTemplateId = id;
        });
      },

      // Section operations
      addSection: (templateId, section) => {
        const template = get().templates[templateId];
        if (!template) return null;

        const sectionId = uuidv4();
        set((state) => {
          const t = state.templates[templateId];
          t.sections.push({
            ...section,
            id: sectionId,
            order: t.sections.length,
            fields: section.fields || [],
          });
          t.version++;
          t.metadata.updatedAt = new Date().toISOString();
        });
        return sectionId;
      },

      updateSection: (templateId, sectionId, updates) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const sectionIndex = template.sections.findIndex(s => s.id === sectionId);
          if (sectionIndex !== -1) {
            template.sections[sectionIndex] = {
              ...template.sections[sectionIndex],
              ...updates,
            };
            template.version++;
            template.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      deleteSection: (templateId, sectionId) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          template.sections = template.sections.filter(s => s.id !== sectionId);
          template.sections.forEach((s, i) => (s.order = i));
          template.version++;
          template.metadata.updatedAt = new Date().toISOString();
        });
      },

      reorderSections: (templateId, orderedIds) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const sectionMap = new Map(template.sections.map(s => [s.id, s]));
          template.sections = orderedIds
            .map((id, index) => {
              const section = sectionMap.get(id);
              if (section) {
                return { ...section, order: index };
              }
              return null;
            })
            .filter(Boolean);

          template.version++;
          template.metadata.updatedAt = new Date().toISOString();
        });
      },

      // Field operations
      addField: (templateId, sectionId, field) => {
        const template = get().templates[templateId];
        if (!template) return null;

        const section = template.sections.find(s => s.id === sectionId);
        if (!section) return null;

        const fieldId = uuidv4();
        set((state) => {
          const t = state.templates[templateId];
          const s = t.sections.find(sec => sec.id === sectionId);
          if (s) {
            s.fields.push({
              ...field,
              id: fieldId,
              order: s.fields.length,
            });
            t.version++;
            t.metadata.updatedAt = new Date().toISOString();
          }
        });
        return fieldId;
      },

      updateField: (templateId, sectionId, fieldId, updates) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const section = template.sections.find(s => s.id === sectionId);
          if (!section) return;

          const fieldIndex = section.fields.findIndex(f => f.id === fieldId);
          if (fieldIndex !== -1) {
            section.fields[fieldIndex] = {
              ...section.fields[fieldIndex],
              ...updates,
            };
            template.version++;
            template.metadata.updatedAt = new Date().toISOString();
          }
        });
      },

      deleteField: (templateId, sectionId, fieldId) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const section = template.sections.find(s => s.id === sectionId);
          if (!section) return;

          section.fields = section.fields.filter(f => f.id !== fieldId);
          section.fields.forEach((f, i) => (f.order = i));
          template.version++;
          template.metadata.updatedAt = new Date().toISOString();
        });
      },

      moveField: (templateId, fromSectionId, toSectionId, fieldId, newIndex) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const fromSection = template.sections.find(s => s.id === fromSectionId);
          const toSection = template.sections.find(s => s.id === toSectionId);
          if (!fromSection || !toSection) return;

          const fieldIndex = fromSection.fields.findIndex(f => f.id === fieldId);
          if (fieldIndex === -1) return;

          const [field] = fromSection.fields.splice(fieldIndex, 1);
          toSection.fields.splice(newIndex, 0, { ...field, order: newIndex });

          fromSection.fields.forEach((f, i) => (f.order = i));
          toSection.fields.forEach((f, i) => (f.order = i));

          template.version++;
          template.metadata.updatedAt = new Date().toISOString();
        });
      },

      reorderFields: (templateId, sectionId, orderedIds) => {
        set((state) => {
          const template = state.templates[templateId];
          if (!template) return;

          const section = template.sections.find(s => s.id === sectionId);
          if (!section) return;

          const fieldMap = new Map(section.fields.map(f => [f.id, f]));
          section.fields = orderedIds
            .map((id, index) => {
              const field = fieldMap.get(id);
              if (field) {
                return { ...field, order: index };
              }
              return null;
            })
            .filter(Boolean);

          template.version++;
          template.metadata.updatedAt = new Date().toISOString();
        });
      },

      // Prescription templates
      addPrescriptionTemplate: (template) => {
        const id = uuidv4();
        set((state) => {
          state.prescriptionTemplates[id] = {
            ...template,
            id,
            metadata: {
              ...template.metadata,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          };
        });
        return id;
      },

      updatePrescriptionTemplate: (id, updates) => {
        set((state) => {
          if (state.prescriptionTemplates[id]) {
            state.prescriptionTemplates[id] = {
              ...state.prescriptionTemplates[id],
              ...updates,
              metadata: {
                ...state.prescriptionTemplates[id].metadata,
                ...updates.metadata,
                updatedAt: new Date().toISOString(),
              },
            };
          }
        });
      },

      deletePrescriptionTemplate: (id) => {
        set((state) => {
          delete state.prescriptionTemplates[id];
        });
      },

      // Getters
      getTemplate: (id) => get().templates[id],

      getTemplatesByType: (type) =>
        Object.values(get().templates).filter(t => t.type === type),

      getTemplatesByCategory: (category) =>
        Object.values(get().templates).filter(t => t.category === category),

      getAllTemplates: () => Object.values(get().templates),

      // Import/Export
      exportTemplates: () => JSON.stringify(get().templates, null, 2),

      importTemplates: (json) => {
        try {
          const templates = JSON.parse(json);
          set((state) => {
            Object.values(templates).forEach(t => {
              const newId = uuidv4();
              state.templates[newId] = {
                ...t,
                id: newId,
                metadata: { ...t.metadata, isSystem: false },
              };
            });
          });
          return true;
        } catch {
          return false;
        }
      },
    })),
    {
      name: 'adapta-templates',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTemplateStore;