
import { useState } from "react";
import { FileUploadItem, Notification } from "@/types/hubspot";

export const useFileUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // This is a mock implementation that returns data in the correct format
  const processFileUpload = async (files: FileUploadItem[]) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data with correctly typed notifications
    const result = {
      contacts: [],
      accounts: [],
      notifications: [
        {
          id: "upload-notif-1",
          type: "intent_signal" as const, // Using const assertion to ensure TypeScript knows this is a specific string
          entityId: "contact-1",
          entityType: "contact" as const, // Explicitly type this as "contact" to match the Notification interface
          message: "New contact data uploaded",
          timestamp: new Date().toISOString(),
          read: false
        }
      ],
      analytics: {
        contactOwnerStats: {},
        contactLifecycleStats: {},
        jobTitleStats: {},
        engagementByOwner: {}
      }
    };
    
    setIsProcessing(false);
    return result;
  };
  
  return { isProcessing, processFileUpload };
};
