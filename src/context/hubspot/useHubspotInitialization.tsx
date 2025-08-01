
import { useEffect } from "react";
import { fetchApiKeyFromSupabase } from "@/utils/hubspotApiKeyUtils";
import { testHubspotConnection } from "@/lib/hubspot-api";

export const useHubspotInitialization = (
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  refreshData: () => Promise<boolean>
) => {
  // Check for API key and connection status on mount and reconnect if needed
  useEffect(() => {
    const checkConnectionStatus = async () => {
      // Try to get a valid API key and verify connection
      try {
        const apiKey = await fetchApiKeyFromSupabase();
        if (apiKey) {
          const isValid = await testHubspotConnection(apiKey);
          if (isValid) {
            setIsAuthenticated(true);
            // Pre-load data if connection is valid
            try {
              await refreshData();
            } catch (error) {
              console.error("Error refreshing data during initialization:", error);
              // Don't throw error to prevent initialization failure
            }
          }
        }
      } catch (error) {
        console.error("Error checking connection status on mount:", error);
        // Don't set authenticated to false here to avoid loops
      }
    };
    
    checkConnectionStatus();
  }, [setIsAuthenticated, refreshData]);
};
