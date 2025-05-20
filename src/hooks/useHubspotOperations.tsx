
import { useState } from "react";
import { useHubspotConnection } from "./hubspot/useHubspotConnection";
import { useHubspotData } from "./hubspot/useHubspotData";
import { Contact, Account } from "@/types/hubspot";

// Define proper return types for our functions
type OperationResult = {
  contacts: Contact[];
  accounts: Account[];
  analytics: {
    contactOwnerStats: Record<string, number>;
    contactLifecycleStats: Record<string, Record<string, number>>;
    jobTitleStats: Record<string, number>;
    engagementByOwner: Record<string, {high: number, medium: number, low: number}>;
  };
};

export const useHubspotOperations = () => {
  const [error, setError] = useState<string | null>(null);
  
  const { 
    isConnecting,
    error: connectionError,
    connectToHubspot: connectToHubspotBase,
    disconnectFromHubspot,
    hasShownSyncToast: connectionToastShown,
    setHasShownSyncToast: setConnectionToastShown
  } = useHubspotConnection();
  
  const {
    isLoading,
    error: dataError,
    refreshData: refreshHubspotData,
    hasShownSyncToast: dataToastShown,
    setHasShownSyncToast: setDataToastShown
  } = useHubspotData();
  
  // Combine errors from both hooks
  if (connectionError && !error) {
    setError(connectionError);
  }
  
  if (dataError && !error) {
    setError(dataError);
  }
  
  // Connect to Hubspot and then fetch data
  const connectToHubspot = async (): Promise<OperationResult | null> => {
    const isConnected = await connectToHubspotBase();
    
    if (isConnected) {
      return await refreshHubspotData();
    }
    
    return null;
  };
  
  // Re-export the refreshData function
  const refreshData = async (): Promise<OperationResult | null> => {
    return await refreshHubspotData();
  };

  return {
    isConnecting,
    isLoading,
    error,
    refreshData,
    connectToHubspot,
    disconnectFromHubspot
  };
};
