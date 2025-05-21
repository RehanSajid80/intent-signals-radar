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
      // Check if API calls are paused - ALWAYS check this first before ANY API calls
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
        
        // If this is a network error (likely CORS), don't keep trying
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.log("Network error detected during initialization. Consider pausing API calls.");
          // We don't automatically enable the pause here, let the user decide
        }
      }
    };
    
    checkConnectionStatus();
  }, [setIsAuthenticated, refreshData]);
};
