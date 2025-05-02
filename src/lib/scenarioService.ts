
import { supabase, isSupabaseConfigured, getCurrentUserId } from './supabase';
import { Scenario, Settings } from './types';

// Load scenarios from Supabase or localStorage
export const loadScenarios = async (): Promise<Scenario[]> => {
  // Try to load from Supabase if configured and user is logged in
  if (isSupabaseConfigured()) {
    try {
      const userId = await getCurrentUserId();
      
      if (userId) {
        // First get the query builder
        const query = supabase.from('scenarios').select('*');
        
        // Then apply the filter if the method exists
        if (query && typeof query.eq === 'function') {
          const { data, error } = await query.eq('user_id', userId);
          
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
        } else {
          console.warn('Supabase query methods not available');
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
        // Get the update query builder
        const updateQuery = supabase
          .from('scenarios')
          .update({
            name,
            settings
          });
        
        // Apply the filters if the method exists
        if (updateQuery && typeof updateQuery.eq === 'function') {
          const idFilter = updateQuery.eq('id', id);
          
          if (idFilter && typeof idFilter.eq === 'function') {
            const { error } = await idFilter.eq('user_id', userId);
            
            if (error) {
              console.error('Error updating scenario in Supabase:', error);
            } else {
              return;
            }
          }
        } else {
          console.warn('Supabase update query methods not available');
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
        // Get the delete query builder
        const deleteQuery = supabase
          .from('scenarios')
          .delete();
        
        // Apply the filters if the method exists
        if (deleteQuery && typeof deleteQuery.eq === 'function') {
          const idFilter = deleteQuery.eq('id', id);
          
          if (idFilter && typeof idFilter.eq === 'function') {
            const { error } = await idFilter.eq('user_id', userId);
            
            if (error) {
              console.error('Error deleting scenario from Supabase:', error);
            } else {
              return;
            }
          }
        } else {
          console.warn('Supabase delete query methods not available');
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
