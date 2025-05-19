
import React, { createContext, useContext, useMemo } from "react";
import { useHubspotState } from "./useHubspotState";
import { useHubspotActions } from "./useHubspotActions";
import { useHubspotInitialization } from "./useHubspotInitialization";
import { HubspotContextType } from "./types";

// Export all the types from the hubspot context
export * from "./types";
// Export types from the hubspot types file
export type { 
  Contact, 
  Account, 
  Notification, 
  FileUploadItem,
  IntentSignal 
} from "@/types/hubspot";

const HubspotContext = createContext<HubspotContextType | undefined>(undefined);

export const HubspotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const value: HubspotContextType = {
    ...state,
    ...actions,
    isConnecting,
    isProcessing,
    priorityContacts
  };

  return (
    <HubspotContext.Provider value={value}>
      {children}
    </HubspotContext.Provider>
  );
};

export const useHubspot = () => {
  const context = useContext(HubspotContext);
  if (context === undefined) {
    throw new Error("useHubspot must be used within a HubspotProvider");
  }
  return context;
};
