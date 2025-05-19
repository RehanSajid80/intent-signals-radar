
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useHubspotOperations } from "@/hooks/useHubspotOperations";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileUploadItem, Notification } from "@/types/hubspot";
import { HubspotActions } from "./types";

export const useHubspotActions = (state: any, setters: any) => {
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

  const connectToHubspot = async () => {
    try {
      const result = await connectToHubspotAPI();
      if (result) {
        setters.setIsAuthenticated(true);
        setters.setContacts(result.contacts);
        setters.setAccounts(result.accounts);
        
        // Set analytics data
        setters.setContactOwnerStats(result.analytics.contactOwnerStats);
        setters.setContactLifecycleStats(result.analytics.contactLifecycleStats);
        setters.setJobTitleStats(result.analytics.jobTitleStats);
        setters.setEngagementByOwner(result.analytics.engagementByOwner);
      }
    } catch (error) {
      console.error("Error in connectToHubspot:", error);
    }
  };

  const disconnectFromHubspot = async () => {
    try {
      await disconnectFromHubspotAPI();
      // Reset state
      setters.setContacts([]);
      setters.setAccounts([]);
      setters.setNotifications([]);
      setters.setContactOwnerStats({});
      setters.setContactLifecycleStats({});
      setters.setJobTitleStats({});
      setters.setEngagementByOwner({});
      setters.setIsAuthenticated(false);
      
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
        setters.setContacts(result.contacts);
        setters.setAccounts(result.accounts);
        
        // Set analytics data
        setters.setContactOwnerStats(result.analytics.contactOwnerStats);
        setters.setContactLifecycleStats(result.analytics.contactLifecycleStats);
        setters.setJobTitleStats(result.analytics.jobTitleStats);
        setters.setEngagementByOwner(result.analytics.engagementByOwner);
      }
    } catch (error) {
      console.error("Error in refreshData:", error);
      throw error; // Rethrow to allow consumers to catch the error
    }
  };

  const processFileUpload = async (files: FileUploadItem[]): Promise<void> => {
    try {
      const result = await processFiles(files);
      
      setters.setIsAuthenticated(true);
      setters.setContacts(result.contacts);
      setters.setAccounts(result.accounts);
      setters.setNotifications(result.notifications);
      
      // Set analytics
      setters.setContactOwnerStats(result.analytics.contactOwnerStats);
      setters.setContactLifecycleStats(result.analytics.contactLifecycleStats);
      setters.setJobTitleStats(result.analytics.jobTitleStats);
      setters.setEngagementByOwner(result.analytics.engagementByOwner);
    } catch (error) {
      console.error("Error in processFileUpload:", error);
    }
  };

  const markNotificationAsRead = useCallback((id: string) => {
    setters.setNotifications((prev: Notification[]) => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, [setters]);

  const actions: HubspotActions = {
    connectToHubspot,
    disconnectFromHubspot,
    markNotificationAsRead,
    refreshData,
    processFileUpload
  };

  return { 
    actions,
    isConnecting,
    isProcessing
  };
};
