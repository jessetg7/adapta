// src/core/store/usePatientStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

const usePatientStore = create(
  persist(
    immer((set, get) => ({
      patients: {},
      visits: {},
      prescriptions: {},
      activePatientId: null,
      activeVisitId: null,

      // Patient CRUD
      addPatient: (patient) => {
        const id = uuidv4();
        set((state) => {
          state.patients[id] = {
            ...patient,
            id,
            registrationDate: new Date().toISOString(),
          };
        });
        return id;
      },

      updatePatient: (id, updates) => {
        set((state) => {
          if (state.patients[id]) {
            state.patients[id] = { ...state.patients[id], ...updates };
          }
        });
      },

      deletePatient: (id) => {
        set((state) => {
          delete state.patients[id];
          if (state.activePatientId === id) {
            state.activePatientId = null;
          }
          // Also delete related visits and prescriptions
          Object.values(state.visits)
            .filter(v => v.patientId === id)
            .forEach(v => delete state.visits[v.id]);
          Object.values(state.prescriptions)
            .filter(p => p.patientId === id)
            .forEach(p => delete state.prescriptions[p.id]);
        });
      },

      setActivePatient: (id) => {
        set((state) => {
          state.activePatientId = id;
        });
      },

      // Visit CRUD
      addVisit: (visit) => {
        const id = uuidv4();
        set((state) => {
          state.visits[id] = { ...visit, id };
          // Update patient's last visit date
          if (state.patients[visit.patientId]) {
            state.patients[visit.patientId].lastVisitDate = visit.date;
          }
        });
        return id;
      },

      updateVisit: (id, updates) => {
        set((state) => {
          if (state.visits[id]) {
            state.visits[id] = { ...state.visits[id], ...updates };
          }
        });
      },

      deleteVisit: (id) => {
        set((state) => {
          delete state.visits[id];
          if (state.activeVisitId === id) {
            state.activeVisitId = null;
          }
        });
      },

      setActiveVisit: (id) => {
        set((state) => {
          state.activeVisitId = id;
        });
      },

      getVisitsByPatient: (patientId) => {
        return Object.values(get().visits)
          .filter(v => v.patientId === patientId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      // Prescription CRUD
      addPrescription: (prescription) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        set((state) => {
          state.prescriptions[id] = {
            ...prescription,
            id,
            createdAt: now,
            updatedAt: now,
          };
          // Link to visit
          if (state.visits[prescription.visitId]) {
            state.visits[prescription.visitId].prescriptionId = id;
          }
        });
        return id;
      },

      updatePrescription: (id, updates) => {
        set((state) => {
          if (state.prescriptions[id]) {
            state.prescriptions[id] = {
              ...state.prescriptions[id],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        });
      },

      deletePrescription: (id) => {
        set((state) => {
          delete state.prescriptions[id];
        });
      },

      getPrescriptionsByPatient: (patientId) => {
        return Object.values(get().prescriptions)
          .filter(p => p.patientId === patientId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getPrescriptionsByVisit: (visitId) => {
        return Object.values(get().prescriptions).filter(p => p.visitId === visitId);
      },

      // Getters
      getPatient: (id) => get().patients[id],
      getVisit: (id) => get().visits[id],
      getPrescription: (id) => get().prescriptions[id],
      getAllPatients: () => Object.values(get().patients),

      searchPatients: (query) => {
        const lowerQuery = query.toLowerCase();
        return Object.values(get().patients).filter(
          p =>
            p.firstName?.toLowerCase().includes(lowerQuery) ||
            p.lastName?.toLowerCase().includes(lowerQuery) ||
            p.phone?.includes(query) ||
            p.email?.toLowerCase().includes(lowerQuery)
        );
      },
    })),
    {
      name: 'adapta-patients',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePatientStore;