
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { testHubspotConnection } from "@/lib/hubspot-api";
import { fetchApiKeyFromSupabase } from "@/utils/hubspotApiKeyUtils";
import { useHubspotOperations } from "@/hooks/useHubspotOperations";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useHubspotDemoData } from "@/hooks/useHubspotDemoData";
import { 
  Contact, 
  Account, 
  Notification, 
  FileUploadItem, 
  HubspotContextType 
} from "@/types/hubspot";

const HubspotContext = createContext<HubspotContextType | undefined>(undefined);

export const HubspotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [contactOwnerStats, setContactOwnerStats] = useState<Record<string, number>>({});
  const [contactLifecycleStats, setContactLifecycleStats] = useState<Record<string, Record<string, number>>>({});
  const [jobTitleStats, setJobTitleStats] = useState<Record<string, number>>({});
  const [engagementByOwner, setEngagementByOwner] = useState<Record<string, {high: number, medium: number, low: number}>>({});

  const { toast } = useToast();
  const { 
    isConnecting,
    isLoading,
    error,
    refreshData: refreshHubspotData,
    connectToHubspot: connectToHubspotAPI,
    disconnectFromHubspot: disconnectFromHubspotAPI
  } = useHubspotOperations();
  
  const { isProcessing, processFileUpload: processFiles } = useFileUpload();
  
  // Import demo data hook
  const { useDemoData, getDemoData } = useHubspotDemoData();

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
            await refreshData();
          }
        }
      } catch (error) {
        console.error("Error checking connection status on mount:", error);
      }
    };
    
    checkConnectionStatus();
  }, []);

  // Apply demo data if needed
  useEffect(() => {
    if (useDemoData) {
      const demoData = getDemoData();
      setContacts(demoData.contacts);
      setAccounts(demoData.accounts);
      setNotifications(demoData.notifications);
      setContactOwnerStats(demoData.contactOwnerStats);
      setContactLifecycleStats(demoData.contactLifecycleStats);
      setJobTitleStats(demoData.jobTitleStats);
      setEngagementByOwner(demoData.engagementByOwner);
      setIsAuthenticated(true);
      
      toast({
        title: "Using sample data",
        description: "Displaying sample data for demonstration purposes."
      });
    }
  }, [useDemoData]);

  const connectToHubspot = async () => {
    try {
      const result = await connectToHubspotAPI();
      if (result) {
        setIsAuthenticated(true);
        setContacts(result.contacts);
        setAccounts(result.accounts);
        
        // Set analytics data
        setContactOwnerStats(result.analytics.contactOwnerStats);
        setContactLifecycleStats(result.analytics.contactLifecycleStats);
        setJobTitleStats(result.analytics.jobTitleStats);
        setEngagementByOwner(result.analytics.engagementByOwner);
      }
    } catch (error) {
      console.error("Error in connectToHubspot:", error);
    }
  };

  const disconnectFromHubspot = async () => {
    try {
      await disconnectFromHubspotAPI();
      // Reset state
      setContacts([]);
      setAccounts([]);
      setNotifications([]);
      setContactOwnerStats({});
      setContactLifecycleStats({});
      setJobTitleStats({});
      setEngagementByOwner({});
      setIsAuthenticated(false);
      
      // Also disable demo data
      localStorage.removeItem('hubspot_use_demo_data');
    } catch (error) {
      console.error("Error in disconnectFromHubspot:", error);
    }
  };

  const refreshData = async (): Promise<void> => {
    try {
      const result = await refreshHubspotData();
      if (result) {
        setContacts(result.contacts);
        setAccounts(result.accounts);
        
        // Set analytics data
        setContactOwnerStats(result.analytics.contactOwnerStats);
        setContactLifecycleStats(result.analytics.contactLifecycleStats);
        setJobTitleStats(result.analytics.jobTitleStats);
        setEngagementByOwner(result.analytics.engagementByOwner);
      }
    } catch (error) {
      console.error("Error in refreshData:", error);
      throw error; // Rethrow to allow consumers to catch the error
    }
  };

  const processFileUpload = async (files: FileUploadItem[]): Promise<void> => {
    try {
      const result = await processFiles(files);
      
      setIsAuthenticated(true);
      setContacts(result.contacts);
      setAccounts(result.accounts);
      setNotifications(result.notifications);
      
      // Set analytics
      setContactOwnerStats(result.analytics.contactOwnerStats);
      setContactLifecycleStats(result.analytics.contactLifecycleStats);
      setJobTitleStats(result.analytics.jobTitleStats);
      setEngagementByOwner(result.analytics.engagementByOwner);
    } catch (error) {
      console.error("Error in processFileUpload:", error);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const priorityContacts = contacts
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const value = {
    isAuthenticated,
    isConnecting,
    isProcessing,
    contacts,
    accounts,
    notifications,
    priorityContacts,
    connectToHubspot,
    disconnectFromHubspot,
    markNotificationAsRead,
    refreshData,
    processFileUpload,
    contactOwnerStats,
    contactLifecycleStats,
    jobTitleStats,
    engagementByOwner,
  };

  return <HubspotContext.Provider value={value}>{children}</HubspotContext.Provider>;
};

export const useHubspot = () => {
  const context = useContext(HubspotContext);
  if (context === undefined) {
    throw new Error("useHubspot must be used within a HubspotProvider");
  }
  return context;
};

// Re-export types
export * from "@/types/hubspot";
