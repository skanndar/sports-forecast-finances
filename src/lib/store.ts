import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ProjectResult, Scenario } from './types';
import { calculateProjectResults, getDefaultSettings } from './finance';

interface AppState {
  activeScenario: Scenario;
  savedScenarios: Scenario[];
  compareScenarios: string[];
  theme: 'light' | 'dark';
  
  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  updateProductField: (index: number, field: string, value: any) => void;
  updatePrescriberField: (index: number, field: string, value: any) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
  addPrescriber: () => void;
  removePrescriber: (index: number) => void;
  saveScenario: (name: string) => void;
  loadScenario: (id: string) => void;
  duplicateScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  recalculate: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSavedScenarios: (list: Scenario[]) => void;
  setActiveScenario: (scenario: Scenario) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeScenario: {
        id: crypto.randomUUID(),
        name: 'Base Scenario',
        settings: getDefaultSettings(),
        results: calculateProjectResults(getDefaultSettings())
      },
      savedScenarios: [] as Scenario[],
      compareScenarios: [],
      theme: 'light',
      setSavedScenarios: (list: Scenario[]) => set({ savedScenarios: list }),
      setActiveScenario: (scenario: Scenario) => set({ activeScenario: { ...scenario, results: calculateProjectResults(scenario.settings) } }),

      updateSettings: (settingsUpdate) => {
        set((state) => {
          const newSettings = {
            ...state.activeScenario.settings,
            ...settingsUpdate
          };

          const results = calculateProjectResults(newSettings);

          return {
            activeScenario: {
              ...state.activeScenario,
              settings: newSettings,
              results
            }
          };
        });
      },

      updateProductField: (index, field, value) => {
        set((state) => {
          const newProducts = [...state.activeScenario.settings.products];

          if (index >= 0 && index < newProducts.length) {
            // @ts-ignore
            newProducts[index] = { ...newProducts[index], [field]: value };

            const newSettings = {
              ...state.activeScenario.settings,
              products: newProducts
            };

            const results = calculateProjectResults(newSettings);

            return {
              activeScenario: {
                ...state.activeScenario,
                settings: newSettings,
                results
              }
            };
          }

          return state;
        });
      },

      updatePrescriberField: (index, field, value) => {
        set((state) => {
          const newPrescribers = [...state.activeScenario.settings.prescribers];

          if (index >= 0 && index < newPrescribers.length) {
            // @ts-ignore
            newPrescribers[index] = { ...newPrescribers[index], [field]: value };

            const newSettings = {
              ...state.activeScenario.settings,
              prescribers: newPrescribers
            };

            const results = calculateProjectResults(newSettings);

            return {
              activeScenario: {
                ...state.activeScenario,
                settings: newSettings,
                results
              }
            };
          }

          return state;
        });
      },

      addProduct: () => {
        set((state) => {
          if (state.activeScenario.settings.products.length >= 10) {
            return state;
          }

          const newProduct = {
            id: crypto.randomUUID(),
            name: `Product ${state.activeScenario.settings.products.length + 1}`,
            units: 1,
            pricingMode: 'daily' as const,
            pricePerDay: 50,
            minDays: 15,
            variableCost: 10,
            occupancy: 0.7
          };

          const newSettings = {
            ...state.activeScenario.settings,
            products: [...state.activeScenario.settings.products, newProduct]
          };

          const results = calculateProjectResults(newSettings);

          return {
            activeScenario: {
              ...state.activeScenario,
              settings: newSettings,
              results
            }
          };
        });
      },

      removeProduct: (index) => {
        set((state) => {
          if (state.activeScenario.settings.products.length <= 1) {
            return state;
          }

          const newProducts = [...state.activeScenario.settings.products];
          newProducts.splice(index, 1);

          const newSettings = {
            ...state.activeScenario.settings,
            products: newProducts
          };

          const results = calculateProjectResults(newSettings);

          return {
            activeScenario: {
              ...state.activeScenario,
              settings: newSettings,
              results
            }
          };
        });
      },

      addPrescriber: () => {
        set((state) => {
          if (state.activeScenario.settings.prescribers.length >= 10) {
            return state;
          }

          const newPrescriber = {
            id: crypto.randomUUID(),
            name: `Prescriber ${state.activeScenario.settings.prescribers.length + 1}`,
            share: 0.1,
            commission: 0.1
          };

          const newSettings = {
            ...state.activeScenario.settings,
            prescribers: [...state.activeScenario.settings.prescribers, newPrescriber]
          };

          const results = calculateProjectResults(newSettings);

          return {
            activeScenario: {
              ...state.activeScenario,
              settings: newSettings,
              results
            }
          };
        });
      },

      removePrescriber: (index) => {
        set((state) => {
          const newPrescribers = [...state.activeScenario.settings.prescribers];
          newPrescribers.splice(index, 1);

          const newSettings = {
            ...state.activeScenario.settings,
            prescribers: newPrescribers
          };

          const results = calculateProjectResults(newSettings);

          return {
            activeScenario: {
              ...state.activeScenario,
              settings: newSettings,
              results
            }
          };
        });
      },

      saveScenario: (name) => {
        set((state) => {
          const newScenario = { ...state.activeScenario, name };
          const existingIndex = state.savedScenarios.findIndex(s => s.id === newScenario.id);
          let newSavedScenarios;
          if (existingIndex >= 0) {
            newSavedScenarios = [...state.savedScenarios];
            newSavedScenarios[existingIndex] = newScenario;
          } else {
            newSavedScenarios = [...state.savedScenarios, newScenario];
          }
          return { savedScenarios: newSavedScenarios };
        });
      },

      loadScenario: (id) => {
        set((state) => {
          const scenario = state.savedScenarios.find(s => s.id === id);
          if (scenario) {
            const results = calculateProjectResults(scenario.settings);
            return { activeScenario: { ...scenario, results } };
          }
          return state;
        });
      },

      duplicateScenario: (id) => {
        set((state) => {
          const scenario = state.savedScenarios.find(s => s.id === id);
          if (scenario) {
            const newScenario = { ...scenario, id: crypto.randomUUID(), name: `${scenario.name} (Copy)` };
            return { activeScenario: newScenario, savedScenarios: [...state.savedScenarios, newScenario] };
          }
          return state;
        });
      },

      deleteScenario: (id) => {
        set((state) => ({
          savedScenarios: state.savedScenarios.filter(s => s.id !== id),
          compareScenarios: state.compareScenarios.filter(sid => sid !== id)
        }));
      },

      addToCompare: (id) => {
        set((state) => {
          if (state.compareScenarios.length >= 3 || state.compareScenarios.includes(id)) return state;
          return { compareScenarios: [...state.compareScenarios, id] };
        });
      },

      removeFromCompare: (id) => {
        set((state) => ({ compareScenarios: state.compareScenarios.filter(sid => sid !== id) }));
      },

      clearCompare: () => set({ compareScenarios: [] }),

      recalculate: () => set((state) => ({
        activeScenario: { ...state.activeScenario, results: calculateProjectResults(state.activeScenario.settings) }
      })),

      setTheme: (theme) => set({ theme })
    }),
    { name: 'sports-finance-app' }
  )
);
