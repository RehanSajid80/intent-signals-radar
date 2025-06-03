
import React, { createContext, useContext, ReactNode, useMemo } from "react";
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
  LifecycleStage 
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

  // Combine all the context values
  const contextValue: HubspotContextType = {
    ...state,
    ...actions,
    isConnecting,
    isProcessing,
    priorityContacts
  };

  return (
    <HubspotContext.Provider value={contextValue}>
      {children}
    </HubspotContext.Provider>
  );
};
