
import { useEffect } from "react";
import { fetchApiKeyFromSupabase } from "@/utils/hubspotApiKeyUtils";
import { testHubspotConnection } from "@/lib/hubspot-api";

export const useHubspotInitialization = (
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  refreshData: () => Promise<void>
) => {
  // Check for API key and connection status on mount and reconnect if needed
  useEffect(() => {
    const checkConnectionStatus = async () => {
      // Check if API calls are paused
      const apiCallsPaused = localStorage.getItem('hubspot_pause_api_calls') === 'true';
      if (apiCallsPaused) {
        console.log("Skipping initialization API calls - API calls are paused");
        return;
      }
      
      // Try to get a valid API key and verify connection
      try {
        const apiKey = await fetchApiKeyFromSupabase();
        if (apiKey) {
          const isValid = await testHubspotConnection(apiKey);
          if (isValid) {
            setIsAuthenticated(true);
            // Pre-load data if connection is valid
            await refreshData();
          }
        }
      } catch (error) {
        console.error("Error checking connection status on mount:", error);
      }
    };
    
    checkConnectionStatus();
  }, [setIsAuthenticated, refreshData]);
};
