
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchHubspotContacts, 
  fetchHubspotCompanies, 
  fetchHubspotDeals, 
  convertHubspotDataToLocalFormat 
} from "@/lib/hubspot-api";
import { calculateAnalytics } from "@/utils/hubspotDataProcessing";
import { fetchApiKeyFromSupabase } from "@/utils/hubspotApiKeyUtils";
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

export const useHubspotData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [hasShownSyncToast, setHasShownSyncToast] = useState(false);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  const refreshData = async (): Promise<OperationResult | null> => {
    // ALWAYS check pause status FIRST before making any API calls
    const apiCallsPaused = localStorage.getItem('hubspot_pause_api_calls') === 'true';
    if (apiCallsPaused) {
      console.log("Skipping data refresh - API calls are paused");
      toast({
        title: "API Calls Paused",
        description: "API calls are currently paused. Please unpause to refresh data.",
      });
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Get API key from Supabase with localStorage as fallback
      const apiKey = await fetchApiKeyFromSupabase();
      if (!apiKey) {
        setError("No API key found. Please add your HubSpot API key in the settings.");
        setIsLoading(false);
        return null;
      }
      
      // Handle CORS error gracefully with a more informative message
      const results = await Promise.allSettled([
        fetchHubspotContacts(apiKey),
        fetchHubspotCompanies(apiKey),
        fetchHubspotDeals(apiKey)
      ]);
      
      // Check if any promises were rejected due to network errors
      const networkErrors = results.filter(r => 
        r.status === 'rejected' && 
        r.reason instanceof TypeError && 
        r.reason.message.includes('Failed to fetch')
      );
      
      if (networkErrors.length > 0) {
        console.warn("Network errors detected when fetching HubSpot data. This may be due to CORS restrictions.");
        setConsecutiveErrors(prev => prev + 1);
        
        // If we've had multiple consecutive errors, suggest pausing API calls
        if (consecutiveErrors >= 2) {
          toast({
            title: "Persistent Connection Issues",
            description: "Consider pausing API calls in Settings to prevent repeated errors.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Connection Limited",
            description: "Due to browser security restrictions, direct API access is limited. Your API key may still be valid.",
            variant: "default"
          });
        }
        
        // Return empty data structure but don't consider it a failure
        return {
          contacts: [],
          accounts: [],
          analytics: {
            contactOwnerStats: {},
            contactLifecycleStats: {},
            jobTitleStats: {},
            engagementByOwner: {}
          }
        };
      }
      
      // Reset consecutive errors count on success
      setConsecutiveErrors(0);
      
      // If we get here, extract successful results
      const [contactsResult, companiesResult, dealsResult] = results;
      const contactsData = contactsResult.status === 'fulfilled' ? contactsResult.value : [];
      const companiesData = companiesResult.status === 'fulfilled' ? companiesResult.value : [];
      const dealsData = dealsResult.status === 'fulfilled' ? dealsResult.value : [];
      
      console.log(`Retrieved ${contactsData.length} contacts, ${companiesData.length} companies, and ${dealsData.length} deals from HubSpot`);
      
      // Convert the data to our local format
      const { contacts: localContacts, accounts: localAccounts } = convertHubspotDataToLocalFormat(contactsData, companiesData, dealsData);
      
      // Calculate analytics based on the new data
      const analytics = localContacts.length > 0 ? calculateAnalytics(localContacts) : {
        contactOwnerStats: {},
        contactLifecycleStats: {},
        jobTitleStats: {},
        engagementByOwner: {}
      };
      
      // Only show the sync notification if we haven't shown it already
      if (!hasShownSyncToast && (localContacts.length > 0 || localAccounts.length > 0)) {
        toast({
          title: "Data Synced",
          description: `Successfully loaded ${localContacts.length} contacts and ${localAccounts.length} accounts from HubSpot`
        });
        setHasShownSyncToast(true);
      }
      
      return {
        contacts: localContacts,
        accounts: localAccounts,
        analytics
      };
    } catch (error) {
      console.error("Error refreshing HubSpot data:", error);
      setConsecutiveErrors(prev => prev + 1);
      
      // More descriptive error message
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError("Network error when connecting to HubSpot API. This may be due to browser security restrictions.");
        
        const toastMessage = consecutiveErrors >= 2 
          ? "Consider pausing API calls in Settings to prevent repeated errors."
          : "Browser security may be preventing direct API access. Your API key may still be valid.";
        
        toast({
          title: "Connection Error",
          description: toastMessage,
          variant: "default"
        });
      } else {
        setError("Failed to fetch data from HubSpot API. Please check your API key.");
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    refreshData,
    hasShownSyncToast,
    setHasShownSyncToast,
    consecutiveErrors
  };
};
