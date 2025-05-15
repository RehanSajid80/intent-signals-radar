
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
      
      // Fetch data from HubSpot API
      const [contactsData, companiesData, dealsData] = await Promise.all([
        fetchHubspotContacts(apiKey),
        fetchHubspotCompanies(apiKey),
        fetchHubspotDeals(apiKey)
      ]);
      
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
      setError("Failed to fetch data from HubSpot API. Please check your API key.");
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
        
        // Automatically fetch data after successful connection
        const result = await refreshData();
        setIsConnecting(false);
        return result;
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
      toast({
        title: "Connection Error",
        description: "Failed to connect to HubSpot API. Please check your API key and try again.",
        variant: "destructive",
      });
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
