import { supabase, isSupabaseConfigured, getCurrentUserId } from './supabase';
import { Scenario, Settings } from './types';

// Load scenarios from Supabase or localStorage
export const loadScenarios = async () => {
  // Try to load from Supabase if configured and user is logged in
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId();
      
      if (userId) {
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error loading scenarios from Supabase:', error);
        } else if (data) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            settings: item.settings,
            results: undefined // We'll calculate this when needed
          }));
        }
      }
    } catch (error) {
      console.error('Error in loadScenarios:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const savedScenariosString = localStorage.getItem('sports-finance-scenarios');
    if (savedScenariosString) {
      return JSON.parse(savedScenariosString);
    }
  } catch (error) {
    console.error('Error loading scenarios from localStorage:', error);
  }
  
  return [];
};

// Save scenario to Supabase or localStorage
export const saveScenario = async (name: string, settings: Settings): Promise<string> => {
  const id = crypto.randomUUID();
  
  // Try to save to Supabase if configured and user is logged in
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId();
      
      if (userId) {
        const { error } = await supabase
          .from('scenarios')
          .insert([{
            id,
            user_id: userId,
            name,
            settings
          }]);
          
        if (error) {
          console.error('Error saving scenario to Supabase:', error);
        } else {
          return id;
        }
      }
    } catch (error) {
      console.error('Error in saveScenario:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const savedScenariosString = localStorage.getItem('sports-finance-scenarios');
    const savedScenarios = savedScenariosString ? JSON.parse(savedScenariosString) : [];
    
    const newScenario = {
      id,
      name,
      settings
    };
    
    savedScenarios.push(newScenario);
    localStorage.setItem('sports-finance-scenarios', JSON.stringify(savedScenarios));
    
    return id;
  } catch (error) {
    console.error('Error saving scenario to localStorage:', error);
    return id;
  }
};

// Update existing scenario
export const updateScenario = async (id: string, name: string, settings: Settings): Promise<void> => {
  // Try to update in Supabase if configured and user is logged in
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId();
      
      if (userId) {
        const { error } = await supabase
          .from('scenarios')
          .update({
            name,
            settings
          })
          .eq('id', id)
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error updating scenario in Supabase:', error);
        } else {
          return;
        }
      }
    } catch (error) {
      console.error('Error in updateScenario:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const savedScenariosString = localStorage.getItem('sports-finance-scenarios');
    if (savedScenariosString) {
      const savedScenarios = JSON.parse(savedScenariosString);
      const index = savedScenarios.findIndex((s: Scenario) => s.id === id);
      
      if (index >= 0) {
        savedScenarios[index] = {
          ...savedScenarios[index],
          name,
          settings
        };
        
        localStorage.setItem('sports-finance-scenarios', JSON.stringify(savedScenarios));
      }
    }
  } catch (error) {
    console.error('Error updating scenario in localStorage:', error);
  }
};

// Delete scenario
export const deleteScenario = async (id: string): Promise<void> => {
  // Try to delete from Supabase if configured and user is logged in
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId();
      
      if (userId) {
        const { error } = await supabase
          .from('scenarios')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error deleting scenario from Supabase:', error);
        } else {
          return;
        }
      }
    } catch (error) {
      console.error('Error in deleteScenario:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const savedScenariosString = localStorage.getItem('sports-finance-scenarios');
    if (savedScenariosString) {
      const savedScenarios = JSON.parse(savedScenariosString);
      const filteredScenarios = savedScenarios.filter((s: Scenario) => s.id !== id);
      
      localStorage.setItem('sports-finance-scenarios', JSON.stringify(filteredScenarios));
    }
  } catch (error) {
    console.error('Error deleting scenario from localStorage:', error);
  }
};
