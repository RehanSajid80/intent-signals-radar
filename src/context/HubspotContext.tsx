import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  score: number;
  priorityLevel: "high" | "medium" | "low";
  lastActivity: string;
  engagementLevel: number;
  intentSignals: IntentSignal[];
  owner: string;
  lifecycleStage: string;
  lastEngagementDate: string;
  timesContacted: number;
  city?: string;
  country?: string;
  marketingStatus?: string;
  leadStatus?: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  contacts: Contact[];
  stage: FunnelStage;
  penetrationScore: number;
  totalDeals: number;
  totalRevenue: number;
  activeDeals: number;
}

export interface IntentSignal {
  id: string;
  type: "email_open" | "website_visit" | "form_submission" | "content_download" | "pricing_visit" | "demo_request";
  timestamp: string;
  description: string;
  strength: number;
}

export interface Notification {
  id: string;
  type: "stage_change" | "intent_signal" | "priority_change";
  entityId: string;
  entityType: "contact" | "account";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FileUploadItem {
  type: string;
  file: File;
}

export type FunnelStage = 
  | "awareness" 
  | "prospecting" 
  | "qualification" 
  | "demo" 
  | "proposal" 
  | "negotiation" 
  | "closed_won" 
  | "closed_lost";

interface HubspotContextType {
  isAuthenticated: boolean;
  isConnecting: boolean;
  isProcessing: boolean;
  contacts: Contact[];
  accounts: Account[];
  notifications: Notification[];
  priorityContacts: Contact[];
  connectToHubspot: () => void;
  disconnectFromHubspot: () => void;
  markNotificationAsRead: (id: string) => void;
  refreshData: () => Promise<void>;
  processFileUpload: (files: FileUploadItem[]) => Promise<void>;
  contactOwnerStats: Record<string, number>;
  contactLifecycleStats: Record<string, Record<string, number>>;
  jobTitleStats: Record<string, number>;
  engagementByOwner: Record<string, {high: number, medium: number, low: number}>;
}

const HubspotContext = createContext<HubspotContextType | undefined>(undefined);

export const HubspotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const [contactOwnerStats, setContactOwnerStats] = useState<Record<string, number>>({});
  const [contactLifecycleStats, setContactLifecycleStats] = useState<Record<string, Record<string, number>>>({});
  const [jobTitleStats, setJobTitleStats] = useState<Record<string, number>>({});
  const [engagementByOwner, setEngagementByOwner] = useState<Record<string, {high: number, medium: number, low: number}>>({});

  const connectToHubspot = () => {
    setIsConnecting(true);
    
    // Simulate connection process without mock data
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsConnecting(false);
      toast({
        title: "Ready for Data Import",
        description: "You can now import your HubSpot data",
      });
    }, 2000);
  };

  const disconnectFromHubspot = () => {
    setIsAuthenticated(false);
    // Clear all data when disconnecting
    setContacts([]);
    setAccounts([]);
    setNotifications([]);
    
    toast({
      title: "Disconnected from HubSpot",
      description: "All data has been cleared",
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const refreshData = async () => {
    // Simulate API refresh
    toast({
      title: "Refreshing data",
      description: "Syncing latest data from HubSpot",
    });
    
    return new Promise<void>(resolve => {
      setTimeout(() => {
        toast({
          title: "Data refreshed",
          description: "Latest data has been synced from HubSpot",
        });
        resolve();
      }, 2000);
    });
  };

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          resolve([]);
          return;
        }
        
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const data = lines[i].split(',');
          const obj: Record<string, string> = {};
          
          if (data.length === headers.length) {
            headers.forEach((header, index) => {
              obj[header] = data[index].trim();
            });
            result.push(obj);
          }
        }
        
        resolve(result);
      };
      
      reader.readAsText(file);
    });
  };

  const processContactsData = (data: any[]): Contact[] => {
    return data.map((item, index) => {
      const contactScore = parseInt(item['HubSpot Score'] || '0', 10);
      const timesContacted = parseInt(item['Number of times contacted'] || '0', 10);
      
      let priorityLevel: "high" | "medium" | "low" = "medium";
      if (item['Lead Status']?.toLowerCase().includes('qualified') || contactScore > 75) {
        priorityLevel = "high";
      } else if (item['Lead Status']?.toLowerCase().includes('nurturing') || contactScore > 40) {
        priorityLevel = "medium";
      } else {
        priorityLevel = "low";
      }
      
      const emailsClicked = parseInt(item['Marketing emails clicked'] || '0', 10);
      const engagementLevel = Math.min(10, Math.ceil((emailsClicked + timesContacted) / 3));
      
      const intentSignals: IntentSignal[] = [];
      
      if (item['Recent Sales Email Clicked Date'] && item['Recent Sales Email Clicked Date'].trim() !== '') {
        intentSignals.push({
          id: `intent-email-${index}`,
          type: "email_open",
          timestamp: new Date(item['Recent Sales Email Clicked Date']).toISOString(),
          description: "Opened sales email",
          strength: 75
        });
      }
      
      if (emailsClicked > 0) {
        intentSignals.push({
          id: `intent-marketing-${index}`,
          type: "email_open",
          timestamp: new Date(item['Last Activity Date'] || new Date()).toISOString(),
          description: "Clicked marketing email",
          strength: 60
        });
      }
      
      return {
        id: item['Record ID - Contact'] || item['Record ID'] || `contact-${index}`,
        firstName: item['First Name'] || '',
        lastName: item['Last Name'] || '',
        email: item['Email'] || '',
        company: item['Company name'] || '',
        title: item['Job Title'] || '',
        phone: item['Phone Number'] || '',
        score: contactScore,
        priorityLevel: priorityLevel,
        lastActivity: item['Last Activity Date'] || new Date().toISOString(),
        engagementLevel: engagementLevel,
        intentSignals: intentSignals,
        owner: item['Contact owner'] || '',
        lifecycleStage: item['Lifecycle Stage'] || '',
        lastEngagementDate: item['Last Engagement Date'] || '',
        timesContacted: timesContacted,
        city: item['City'] || '',
        country: item['Country/Region'] || '',
        marketingStatus: item['Marketing contact status'] || '',
        leadStatus: item['Lead Status'] || ''
      };
    });
  };

  const processAccountsData = (data: any[], processedContacts: Contact[]): Account[] => {
    return data.map((item, index) => {
      const accountContacts = processedContacts.filter(
        contact => contact.company.toLowerCase() === (item.name || '').toLowerCase()
      );
      
      return {
        id: item.id || `account-${index}`,
        name: item.name || '',
        industry: item.industry || '',
        website: item.website || '',
        size: item.size || item.companySize || '',
        contacts: accountContacts,
        stage: (item.stage || 'awareness') as FunnelStage,
        penetrationScore: parseInt(item.penetrationScore || '0', 10),
        totalDeals: parseInt(item.totalDeals || '0', 10),
        totalRevenue: parseInt(item.totalRevenue || '0', 10),
        activeDeals: parseInt(item.activeDeals || '0', 10)
      };
    });
  };

  const calculateAnalytics = (contactsData: Contact[]) => {
    const ownerStats: Record<string, number> = {};
    const lifecycleStats: Record<string, Record<string, number>> = {};
    const jobStats: Record<string, number> = {};
    const engagementStats: Record<string, {high: number, medium: number, low: number}> = {};

    contactsData.forEach(contact => {
      const owner = contact.owner || 'Unassigned';
      ownerStats[owner] = (ownerStats[owner] || 0) + 1;
      
      if (!lifecycleStats[owner]) {
        lifecycleStats[owner] = {};
      }
      const lifecycle = contact.lifecycleStage || 'Unknown';
      lifecycleStats[owner][lifecycle] = (lifecycleStats[owner][lifecycle] || 0) + 1;
      
      const title = contact.title || 'Unknown';
      jobStats[title] = (jobStats[title] || 0) + 1;
      
      if (!engagementStats[owner]) {
        engagementStats[owner] = {high: 0, medium: 0, low: 0};
      }
      
      const lastEngagement = contact.lastEngagementDate ? new Date(contact.lastEngagementDate) : null;
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let engagementCategory: 'high' | 'medium' | 'low' = 'low';
      
      if (lastEngagement && lastEngagement > thirtyDaysAgo && contact.timesContacted > 5) {
        engagementCategory = 'high';
      } else if (lastEngagement && lastEngagement > thirtyDaysAgo) {
        engagementCategory = 'medium';
      }
      
      engagementStats[owner][engagementCategory]++;
    });
    
    setContactOwnerStats(ownerStats);
    setContactLifecycleStats(lifecycleStats);
    setJobTitleStats(jobStats);
    setEngagementByOwner(engagementStats);
  };

  const processFileUpload = async (files: FileUploadItem[]): Promise<void> => {
    setIsProcessing(true);
    
    toast({
      title: "Processing files",
      description: "Your HubSpot data files are being processed",
    });
    
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        try {
          let contactData: any[] = [];
          let accountData: any[] = [];
          let dealData: any[] = [];
          
          for (const item of files) {
            const data = await parseCSV(item.file);
            console.log(`Parsed ${item.type} data:`, data[0]);
            
            if (item.type === 'contacts') {
              contactData = data;
            } else if (item.type === 'accounts') {
              accountData = data;
            } else if (item.type === 'deals') {
              dealData = data;
            }
          }
          
          const processedContacts = processContactsData(contactData);
          const processedAccounts = processAccountsData(accountData, processedContacts);
          
          const processedNotifications: Notification[] = [];
          
          calculateAnalytics(processedContacts);
          
          setIsAuthenticated(true);
          setContacts(processedContacts);
          setAccounts(processedAccounts);
          setNotifications(processedNotifications);
          
          toast({
            title: "Upload successful",
            description: `Processed ${files.length} files successfully`,
          });
        } catch (error) {
          console.error("Error processing files:", error);
          toast({
            title: "Error processing files",
            description: "There was a problem processing your HubSpot data files",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          resolve();
        }
      }, 2000);
    });
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
