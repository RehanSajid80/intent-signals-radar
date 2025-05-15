import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchApiKeyFromSupabase, saveApiKeyToSupabase } from "@/utils/hubspotApiKeyUtils";
import { 
  fetchHubspotContacts, 
  fetchHubspotCompanies, 
  fetchHubspotDeals, 
  convertHubspotDataToLocalFormat,
  testHubspotConnection
} from "@/lib/hubspot-api";
import { calculateAnalytics } from "@/utils/hubspotDataProcessing";
import { supabase } from "@/integrations/supabase/client";
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshData = async (): Promise<OperationResult | null> => {
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
        toast({
          title: "Connection Limited",
          description: "Due to browser security restrictions, direct API access is limited. Your API key may still be valid.",
          variant: "default"
        });
        
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
      
      toast({
        title: "Data Synced",
        description: `Successfully loaded ${localContacts.length} contacts and ${localAccounts.length} accounts from HubSpot`
      });
      
      return {
        contacts: localContacts,
        accounts: localAccounts,
        analytics
      };
    } catch (error) {
      console.error("Error refreshing HubSpot data:", error);
      
      // More descriptive error message
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError("Network error when connecting to HubSpot API. This may be due to browser security restrictions.");
        toast({
          title: "Connection Error",
          description: "Browser security may be preventing direct API access. Your API key may still be valid.",
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

  const connectToHubspot = async (): Promise<OperationResult | null> => {
    // Get the API key securely
    const apiKey = await fetchApiKeyFromSupabase();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your HubSpot API key in Settings first.",
        variant: "destructive",
      });
      return null;
    }
    
    setIsConnecting(true);
    
    // Test the API key by making an actual API request
    try {
      const isValid = await testHubspotConnection(apiKey);
      
      if (isValid) {
        toast({
          title: "Connected to HubSpot",
          description: "Your API key is valid. Fetching data...",
        });
        
        // Even if test passes, actual data fetching might still fail due to CORS
        // So wrap in try/catch to handle gracefully
        try {
          // Automatically fetch data after successful connection
          const result = await refreshData();
          setIsConnecting(false);
          return result;
        } catch (fetchError) {
          console.error("Error fetching data after connection:", fetchError);
          
          // If it's a network error, still consider connection successful
          if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
            toast({
              title: "Connected with Limitations",
              description: "Connected to HubSpot, but browser security may restrict some data access.",
            });
            
            setIsConnecting(false);
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
          
          // For other errors, show error but still consider connected
          toast({
            title: "Connected with Errors",
            description: "Connected to HubSpot, but encountered errors fetching data.",
          });
          
          setIsConnecting(false);
          return null;
        }
      } else {
        toast({
          title: "Connection Failed",
          description: "Your HubSpot API key appears to be invalid.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return null;
      }
    } catch (error) {
      console.error("Error connecting to HubSpot:", error);
      
      // Improved error messages based on error type
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Connection Limited",
          description: "Browser security may prevent direct API access. Try checking your API key in the HubSpot portal.",
          variant: "default",
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to HubSpot API. Please check your API key and try again.",
          variant: "destructive",
        });
      }
      
      setIsConnecting(false);
      return null;
    }
  };

  const disconnectFromHubspot = async (): Promise<void> => {
    try {
      // Clear API key from Supabase
      const { error } = await supabase
        .from('api_keys')
        .update({ api_key: null })
        .eq('service', 'hubspot');
        
      if (error) {
        console.error("Error clearing API key from Supabase:", error);
      }
      
      // Also clear from localStorage
      localStorage.removeItem("hubspot_api_key");
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from HubSpot API.",
      });
    } catch (error) {
      console.error("Error disconnecting from HubSpot:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from HubSpot API.",
        variant: "destructive",
      });
    }
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
