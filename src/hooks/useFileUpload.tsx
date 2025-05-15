
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseCSV } from "@/utils/csvParser";
import { processContactsData, processAccountsData, calculateAnalytics } from "@/utils/hubspotDataProcessing";
import { FileUploadItem, Contact, Account, Notification } from "@/types/hubspot";

export const useFileUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFileUpload = async (files: FileUploadItem[]): Promise<{
    contacts: Contact[],
    accounts: Account[],
    notifications: Notification[],
    analytics: {
      contactOwnerStats: Record<string, number>,
      contactLifecycleStats: Record<string, Record<string, number>>,
      jobTitleStats: Record<string, number>,
      engagementByOwner: Record<string, {high: number, medium: number, low: number}> 
    }
  }> => {
    setIsProcessing(true);
    
    toast({
      title: "Processing files",
      description: "Your HubSpot data files are being processed",
    });
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          let contactData: any[] = [];
          let accountData: any[] = [];
          let dealData: any[] = [];
          
          for (const item of files) {
            console.log(`Processing file: ${item.file.name}, type: ${item.type}`);
            const data = await parseCSV(item.file);
            console.log(`Parsed ${item.type} data, rows:`, data.length);
            
            if (data.length > 0) {
              console.log(`Sample row for ${item.type}:`, data[0]);
            }
            
            if (item.type === 'contacts') {
              contactData = data;
            } else if (item.type === 'accounts') {
              accountData = data;
            } else if (item.type === 'deals') {
              dealData = data;
            }
          }
          
          // Process the data
          const processedContacts = processContactsData(contactData);
          console.log("Processed contacts:", processedContacts.length);
          
          const processedAccounts = processAccountsData(accountData, processedContacts);
          console.log("Processed accounts:", processedAccounts.length);
          
          const processedNotifications: Notification[] = [];
          
          // Only calculate analytics if we have data
          let analytics = {
            contactOwnerStats: {},
            contactLifecycleStats: {},
            jobTitleStats: {},
            engagementByOwner: {}
          };
          
          if (processedContacts.length > 0) {
            analytics = calculateAnalytics(processedContacts);
          }
          
          toast({
            title: "Upload successful",
            description: `Processed ${processedContacts.length} contacts and ${processedAccounts.length} accounts`,
          });
          
          resolve({
            contacts: processedContacts,
            accounts: processedAccounts,
            notifications: processedNotifications,
            analytics
          });
        } catch (error) {
          console.error("Error processing files:", error);
          toast({
            title: "Error processing files",
            description: "There was a problem processing your HubSpot data files. Check the console for details.",
            variant: "destructive",
          });
          resolve({
            contacts: [],
            accounts: [],
            notifications: [],
            analytics: {
              contactOwnerStats: {},
              contactLifecycleStats: {},
              jobTitleStats: {},
              engagementByOwner: {}
            }
          });
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
    });
  };

  return {
    isProcessing,
    processFileUpload
  };
};
