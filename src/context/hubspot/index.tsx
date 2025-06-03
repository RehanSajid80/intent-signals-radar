
import React, { createContext, useContext, ReactNode, useMemo, useState } from "react";
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

  // Calculate derived state
  const priorityContacts = useMemo(() => 
    state.contacts
      .sort((a, b) => b.score - a.score)
      .slice(0, 10), 
    [state.contacts]
  );

  // Mock test connection function
  const testHubspotConnection = async (key?: string): Promise<boolean> => {
    // Mock implementation - always returns true
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  // Combine all the context values
  const contextValue: HubspotContextType = {
    ...state,
    ...actions,
    isConnecting,
    isProcessing,
    priorityContacts,
    apiKey,
    setApiKey,
    testHubspotConnection
  };

  return (
    <HubspotContext.Provider value={contextValue}>
      {children}
    </HubspotContext.Provider>
  );
};
