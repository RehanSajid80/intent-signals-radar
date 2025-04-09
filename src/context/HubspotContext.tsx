
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
}

const HubspotContext = createContext<HubspotContextType | undefined>(undefined);

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@acme.com",
    company: "Acme Corp",
    title: "VP of Marketing",
    phone: "(555) 123-4567",
    score: 85,
    priorityLevel: "high",
    lastActivity: "2023-04-08T10:30:00",
    engagementLevel: 80,
    intentSignals: [
      {
        id: "s1",
        type: "pricing_visit",
        timestamp: "2023-04-07T14:25:00",
        description: "Viewed pricing page 3 times in the last week",
        strength: 90,
      },
      {
        id: "s2",
        type: "demo_request",
        timestamp: "2023-04-06T11:15:00",
        description: "Requested product demo call",
        strength: 95,
      },
    ],
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@globex.com",
    company: "Globex International",
    title: "CTO",
    phone: "(555) 987-6543",
    score: 72,
    priorityLevel: "medium",
    lastActivity: "2023-04-05T15:45:00",
    engagementLevel: 65,
    intentSignals: [
      {
        id: "s3",
        type: "content_download",
        timestamp: "2023-04-04T09:20:00",
        description: "Downloaded technical whitepaper",
        strength: 75,
      },
    ],
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@soylent.com",
    company: "Soylent Corp",
    title: "Director of Sales",
    phone: "(555) 456-7890",
    score: 91,
    priorityLevel: "high",
    lastActivity: "2023-04-07T16:30:00",
    engagementLevel: 85,
    intentSignals: [
      {
        id: "s4",
        type: "email_open",
        timestamp: "2023-04-07T09:10:00",
        description: "Opened 5 emails in the last 3 days",
        strength: 85,
      },
      {
        id: "s5",
        type: "website_visit",
        timestamp: "2023-04-06T14:20:00",
        description: "Visited solution pages multiple times",
        strength: 80,
      },
    ],
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@initech.com",
    company: "Initech",
    title: "Product Manager",
    phone: "(555) 789-0123",
    score: 65,
    priorityLevel: "medium",
    lastActivity: "2023-04-04T11:15:00",
    engagementLevel: 60,
    intentSignals: [
      {
        id: "s6",
        type: "form_submission",
        timestamp: "2023-04-03T10:45:00",
        description: "Filled out contact form",
        strength: 70,
      },
    ],
  },
  {
    id: "5",
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.patel@umbrella.com",
    company: "Umbrella Corporation",
    title: "CEO",
    phone: "(555) 234-5678",
    score: 95,
    priorityLevel: "high",
    lastActivity: "2023-04-08T09:00:00",
    engagementLevel: 90,
    intentSignals: [
      {
        id: "s7",
        type: "demo_request",
        timestamp: "2023-04-07T16:30:00",
        description: "Scheduled executive demo",
        strength: 95,
      },
      {
        id: "s8",
        type: "pricing_visit",
        timestamp: "2023-04-07T16:00:00",
        description: "Viewed enterprise pricing details",
        strength: 90,
      },
    ],
  },
];

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Acme Corp",
    industry: "Manufacturing",
    website: "acme.com",
    size: "Enterprise",
    contacts: mockContacts.filter(c => c.company === "Acme Corp"),
    stage: "proposal",
    penetrationScore: 75,
    totalDeals: 3,
    totalRevenue: 120000,
    activeDeals: 2,
  },
  {
    id: "2",
    name: "Globex International",
    industry: "Technology",
    website: "globex.com",
    size: "Mid-Market",
    contacts: mockContacts.filter(c => c.company === "Globex International"),
    stage: "demo",
    penetrationScore: 45,
    totalDeals: 1,
    totalRevenue: 50000,
    activeDeals: 1,
  },
  {
    id: "3",
    name: "Soylent Corp",
    industry: "Food & Beverage",
    website: "soylent.com",
    size: "Enterprise",
    contacts: mockContacts.filter(c => c.company === "Soylent Corp"),
    stage: "negotiation",
    penetrationScore: 80,
    totalDeals: 2,
    totalRevenue: 200000,
    activeDeals: 1,
  },
  {
    id: "4",
    name: "Initech",
    industry: "Technology",
    website: "initech.com",
    size: "SMB",
    contacts: mockContacts.filter(c => c.company === "Initech"),
    stage: "qualification",
    penetrationScore: 30,
    totalDeals: 1,
    totalRevenue: 0,
    activeDeals: 1,
  },
  {
    id: "5",
    name: "Umbrella Corporation",
    industry: "Pharmaceuticals",
    website: "umbrella.com",
    size: "Enterprise",
    contacts: mockContacts.filter(c => c.company === "Umbrella Corporation"),
    stage: "proposal",
    penetrationScore: 65,
    totalDeals: 2,
    totalRevenue: 175000,
    activeDeals: 2,
  },
];

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "stage_change",
    entityId: "3",
    entityType: "account",
    message: "Soylent Corp has moved to Negotiation stage",
    timestamp: "2023-04-07T16:30:00",
    read: false,
  },
  {
    id: "n2",
    type: "intent_signal",
    entityId: "1",
    entityType: "contact",
    message: "Sarah Johnson showed high intent: requested product demo",
    timestamp: "2023-04-06T11:15:00",
    read: false,
  },
  {
    id: "n3",
    type: "priority_change",
    entityId: "5",
    entityType: "contact",
    message: "Aisha Patel is now a high-priority contact",
    timestamp: "2023-04-05T09:00:00",
    read: true,
  },
];

export const HubspotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Initialize with mock data for demo
  useEffect(() => {
    if (isAuthenticated) {
      setContacts(mockContacts);
      setAccounts(mockAccounts);
      setNotifications(mockNotifications);
    } else {
      setContacts([]);
      setAccounts([]);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const connectToHubspot = () => {
    setIsConnecting(true);
    
    // Simulate OAuth flow and API connection
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsConnecting(false);
      toast({
        title: "Connected to HubSpot",
        description: "Your HubSpot account has been successfully connected",
      });
    }, 2000);
  };

  const disconnectFromHubspot = () => {
    setIsAuthenticated(false);
    toast({
      title: "Disconnected from HubSpot",
      description: "Your HubSpot account has been disconnected",
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

  // Parse CSV file and return data as JSON
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
          
          // Only process lines that have the right number of values
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

  // Process file uploads
  const processFileUpload = async (files: FileUploadItem[]): Promise<void> => {
    setIsProcessing(true);
    
    toast({
      title: "Processing files",
      description: "Your HubSpot data files are being processed",
    });
    
    // Simulate processing delay
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        try {
          let contactData: any[] = [];
          let accountData: any[] = [];
          let dealData: any[] = [];
          
          // Process each file based on type
          for (const item of files) {
            const data = await parseCSV(item.file);
            
            if (item.type === 'contacts') {
              contactData = data;
            } else if (item.type === 'accounts') {
              accountData = data;
            } else if (item.type === 'deals') {
              dealData = data;
            }
          }
          
          // Here we would transform the raw CSV data into our application's data models
          // For this demo, we'll use mock data instead
          
          setIsAuthenticated(true);
          setContacts(mockContacts);
          setAccounts(mockAccounts);
          setNotifications(mockNotifications);
          
          toast({
            title: "Upload successful",
            description: `Processed ${files.length} files successfully`,
          });
        } catch (error) {
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
