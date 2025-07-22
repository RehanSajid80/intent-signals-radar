
import { useState, useRef } from "react";
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
  const lastToastTimeRef = useRef<number>(0);
  const corsErrorShownRef = useRef<boolean>(false);

  // Debounced toast to prevent spam
  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    const now = Date.now();
    if (now - lastToastTimeRef.current > 5000) { // 5 second debounce
      lastToastTimeRef.current = now;
      toast({ title, description, variant });
    }
  };

  // Check if error is CORS related
  const isCorsError = (error: any): boolean => {
    return error instanceof TypeError && error.message.includes('Failed to fetch');
  };

  const refreshData = async (): Promise<OperationResult | null> => {
    if (isLoading) {
      return null; // Prevent multiple simultaneous calls
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
        isCorsError(r.reason)
      );
      
      if (networkErrors.length > 0) {
        console.warn("CORS restrictions detected when fetching HubSpot data.");
        
        // Only show CORS error once per session
        if (!corsErrorShownRef.current) {
          corsErrorShownRef.current = true;
          showToast(
            "Connection Limited",
            "Browser security prevents direct HubSpot API access. Using demo data for preview.",
            "default"
          );
        }
        
        // Return demo data when CORS errors occur so users can still see the UI
        const demoContacts = [
          {
            id: "demo-1",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@techcorp.com",
            company: "TechCorp Solutions",
            title: "VP of Engineering",
            phone: "+1-555-0123",
            score: 85,
            priorityLevel: "high" as const,
            lastActivity: "2024-01-15",
            engagementLevel: 8,
            intentSignals: [],
            owner: "Sarah Johnson",
            lifecycleStage: "opportunity",
            lastEngagementDate: "2024-01-15",
            timesContacted: 12,
            city: "San Francisco",
            country: "USA",
            marketingStatus: "qualified",
            leadStatus: "qualified"
          },
          {
            id: "demo-2",
            firstName: "Maria",
            lastName: "Rodriguez",
            email: "maria.rodriguez@healthplus.com",
            company: "HealthPlus Inc",
            title: "Director of IT",
            phone: "+1-555-0456",
            score: 72,
            priorityLevel: "medium" as const,
            lastActivity: "2024-01-12",
            engagementLevel: 6,
            intentSignals: [],
            owner: "Mike Chen",
            lifecycleStage: "salesqualifiedlead",
            lastEngagementDate: "2024-01-12",
            timesContacted: 8,
            city: "Austin",
            country: "USA",
            marketingStatus: "qualified",
            leadStatus: "open"
          }
        ];

        const demoAccounts = [
          {
            id: "demo-account-1",
            name: "TechCorp Solutions",
            industry: "Technology",
            website: "https://techcorp.com",
            size: "500-1000",
            contacts: [demoContacts[0]],
            stage: "qualification" as const,
            penetrationScore: 75,
            totalDeals: 2,
            totalRevenue: 250000,
            activeDeals: 1,
            city: "San Francisco",
            country: "USA",
            lastActivity: "2024-01-15",
            timesContacted: 12,
            buyingRoles: 3,
            pageviews: 45,
            sessions: 12,
            leadStatus: "qualified",
            lifecycleStage: "opportunity"
          },
          {
            id: "demo-account-2",
            name: "HealthPlus Inc",
            industry: "Healthcare",
            website: "https://healthplus.com",
            size: "100-500",
            contacts: [demoContacts[1]],
            stage: "qualification" as const,
            penetrationScore: 60,
            totalDeals: 1,
            totalRevenue: 120000,
            activeDeals: 1,
            city: "Austin",
            country: "USA",
            lastActivity: "2024-01-12",
            timesContacted: 8,
            buyingRoles: 2,
            pageviews: 28,
            sessions: 8,
            leadStatus: "open",
            lifecycleStage: "salesqualifiedlead"
          }
        ];
        
        return {
          contacts: demoContacts,
          accounts: demoAccounts,
          analytics: {
            contactOwnerStats: {
              "Sarah Johnson": 1,
              "Mike Chen": 1
            },
            contactLifecycleStats: {
              "Sarah Johnson": { opportunity: 1 },
              "Mike Chen": { salesqualifiedlead: 1 }
            },
            jobTitleStats: {
              "VP of Engineering": 1,
              "Director of IT": 1
            },
            engagementByOwner: {
              "Sarah Johnson": { high: 1, medium: 0, low: 0 },
              "Mike Chen": { high: 0, medium: 1, low: 0 }
            }
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
      
      // Only show success toast if we actually got data
      if (localContacts.length > 0 || localAccounts.length > 0) {
        showToast(
          "Data Synced",
          `Successfully loaded ${localContacts.length} contacts and ${localAccounts.length} accounts from HubSpot`
        );
      }
      
      return {
        contacts: localContacts,
        accounts: localAccounts,
        analytics
      };
    } catch (error) {
      console.error("Error refreshing HubSpot data:", error);
      
      // More descriptive error message for CORS
      if (isCorsError(error)) {
        if (!corsErrorShownRef.current) {
          corsErrorShownRef.current = true;
          setError("Browser security prevents direct HubSpot API access. This is normal for web applications.");
          showToast(
            "Connection Limited",
            "Browser security prevents direct HubSpot API access. Consider using a backend integration.",
            "default"
          );
        }
      } else {
        setError("Failed to fetch data from HubSpot API. Please check your API key.");
        showToast(
          "Error",
          "Failed to fetch data from HubSpot API. Please check your API key.",
          "destructive"
        );
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
      showToast(
        "API Key Required",
        "Please set your HubSpot API key in Settings first.",
        "destructive"
      );
      return null;
    }
    
    setIsConnecting(true);
    
    // Test the API key by making an actual API request
    try {
      const isValid = await testHubspotConnection(apiKey);
      
      if (isValid) {
        showToast(
          "Connected to HubSpot",
          "Your API key is valid. Note: Direct data fetching may be limited by browser security."
        );
        
        // Try to fetch data but handle CORS gracefully
        try {
          const result = await refreshData();
          setIsConnecting(false);
          return result;
        } catch (fetchError) {
          console.error("Error fetching data after connection:", fetchError);
          
          // If it's a CORS error, still consider connection successful
          if (isCorsError(fetchError)) {
            if (!corsErrorShownRef.current) {
              corsErrorShownRef.current = true;
              showToast(
                "Connected with Limitations",
                "Connected to HubSpot, but browser security restricts direct data access."
              );
            }
            
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
          showToast(
            "Connected with Errors",
            "Connected to HubSpot, but encountered errors fetching data."
          );
          
          setIsConnecting(false);
          return null;
        }
      } else {
        showToast(
          "Connection Failed",
          "Your HubSpot API key appears to be invalid.",
          "destructive"
        );
        setIsConnecting(false);
        return null;
      }
    } catch (error) {
      console.error("Error connecting to HubSpot:", error);
      
      // Improved error messages based on error type
      if (isCorsError(error)) {
        if (!corsErrorShownRef.current) {
          corsErrorShownRef.current = true;
          showToast(
            "Connection Limited",
            "Browser security prevents direct HubSpot API access. This is expected behavior.",
            "default"
          );
        }
      } else {
        showToast(
          "Connection Error",
          "Failed to connect to HubSpot API. Please check your API key and try again.",
          "destructive"
        );
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
      
      // Reset CORS error flag
      corsErrorShownRef.current = false;
      
      showToast(
        "Disconnected",
        "Successfully disconnected from HubSpot API."
      );
    } catch (error) {
      console.error("Error disconnecting from HubSpot:", error);
      showToast(
        "Error",
        "Failed to disconnect from HubSpot API.",
        "destructive"
      );
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
