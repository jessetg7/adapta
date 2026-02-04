// src/core/store/useRuleStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

const useRuleStore = create(
  persist(
    immer((set, get) => ({
      rules: {},
      
      addRule: (rule) => {
        const id = uuidv4();
        set((state) => {
          state.rules[id] = {
            ...rule,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        return id;
      },

      updateRule: (id, updates) => {
        set((state) => {
          if (state.rules[id]) {
            state.rules[id] = {
              ...state.rules[id],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        });
      },

      deleteRule: (id) => {
        set((state) => {
          delete state.rules[id];
        });
      },

      toggleRule: (id) => {
        set((state) => {
          if (state.rules[id]) {
            state.rules[id].enabled = !state.rules[id].enabled;
            state.rules[id].updatedAt = new Date().toISOString();
          }
        });
      },

      getRule: (id) => get().rules[id],
      
      getAllRules: () => Object.values(get().rules),
      
      getRulesByCategory: (category) => 
        Object.values(get().rules).filter(r => r.category === category),

      exportRules: () => JSON.stringify(get().rules, null, 2),
      
      importRules: (json) => {
        try {
          const rules = JSON.parse(json);
          set((state) => {
            Object.values(rules).forEach(r => {
              const newId = uuidv4();
              state.rules[newId] = { ...r, id: newId };
            });
          });
          return true;
        } catch {
          return false;
        }
      },
    })),
    {
      name: 'adapta-rules',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRuleStore;