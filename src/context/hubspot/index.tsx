
import React, { createContext, useContext, ReactNode, useMemo, useState, useCallback } from "react";
import { useHubspotState } from "./useHubspotState";
import { useHubspotActions } from "./useHubspotActions";
import { useHubspotInitialization } from "./useHubspotInitialization";
import type { HubspotContextType } from "./types";

// Re-export types for easier importing
export type { 
  Contact, 
  Account, 
  HubspotContextType, 
  Deal, 
  DealStage, 
  OwnerStats, 
  LifecycleStage,
  IntentSignal
} from "./types";

const HubspotContext = createContext<HubspotContextType | undefined>(undefined);

export const useHubspot = () => {
  const context = useContext(HubspotContext);
  if (!context) {
    throw new Error("useHubspot must be used within a HubspotProvider");
  }
  return context;
};

interface HubspotProviderProps {
  children: ReactNode;
}

export const HubspotProvider: React.FC<HubspotProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>("");
  
  // Get state and setters
  const { state, setters } = useHubspotState();
  
  // Get actions and operation states
  const { 
    actions,
    isConnecting,
    isProcessing
  } = useHubspotActions(state, setters);

  // Initialize connection status
  useHubspotInitialization(setters.setIsAuthenticated, actions.refreshData);

  // Calculate derived state with proper error handling
  const priorityContacts = useMemo(() => {
    try {
      if (!Array.isArray(state.contacts)) {
        return [];
      }
      return state.contacts
        .filter(contact => contact && typeof contact.score === 'number')
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);
    } catch (error) {
      console.error('Error calculating priority contacts:', error);
      return [];
    }
  }, [state.contacts]);

  // Enhanced test connection function with proper error handling
  const testHubspotConnection = useCallback(async (key?: string): Promise<boolean> => {
    try {
      if (key && key.trim()) {
        setApiKey(key);
      }
      return await actions.testHubspotConnection(key);
    } catch (error) {
      console.error('Error testing HubSpot connection:', error);
      return false;
    }
  }, [actions]);

  // Combine all the context values
  const contextValue: HubspotContextType = useMemo(() => ({
    ...state,
    ...actions,
    isConnecting,
    isProcessing,
    priorityContacts,
    apiKey,
    setApiKey,
    testHubspotConnection
  }), [
    state,
    actions,
    isConnecting,
    isProcessing,
    priorityContacts,
    apiKey,
    testHubspotConnection
  ]);

  return (
    <HubspotContext.Provider value={contextValue}>
      {children}
    </HubspotContext.Provider>
  );
};
