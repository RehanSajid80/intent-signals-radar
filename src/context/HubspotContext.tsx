import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchHubspotContacts, 
  fetchHubspotCompanies, 
  fetchHubspotDeals, 
  convertHubspotDataToLocalFormat,
  testHubspotConnection
} from "@/lib/hubspot-api";
import { supabase } from "@/lib/supabase";

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
  city?: string;
  country?: string;
  lastActivity?: string;
  timesContacted?: number;
  buyingRoles?: number;
  pageviews?: number;
  sessions?: number;
  leadStatus?: string;
  lifecycleStage?: string;
  cloudProviders?: {
    aws?: boolean;
    azure?: boolean;
    googleCloud?: boolean;
    oracle?: boolean;
    details?: CloudProviderDetails;
  };
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

interface CloudProviderDetails {
  aws: string;
  azure: string;
  googleCloud: string;
  oracle: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  const [contactOwnerStats, setContactOwnerStats] = useState<Record<string, number>>({});
  const [contactLifecycleStats, setContactLifecycleStats] = useState<Record<string, Record<string, number>>>({});
  const [jobTitleStats, setJobTitleStats] = useState<Record<string, number>>({});
  const [engagementByOwner, setEngagementByOwner] = useState<Record<string, {high: number, medium: number, low: number}>>({});

  useEffect(() => {
    // Check for saved API key on component mount
    const savedApiKey = localStorage.getItem("hubspot_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // We don't automatically set isAuthenticated here anymore
      // We'll validate the API key first in connectToHubspot
    }
  }, []);

  const connectToHubspot = () => {
    // Get the API key from localStorage
    const savedApiKey = localStorage.getItem("hubspot_api_key");
    
    if (!savedApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your HubSpot API key in Settings first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    // Test the API key by making an actual API request
    testHubspotConnection(savedApiKey)
      .then(isValid => {
        if (isValid) {
          setApiKey(savedApiKey);
          setIsAuthenticated(true);
          toast({
            title: "Connected to HubSpot",
            description: "Your API key is valid. Fetching data...",
          });
          
          // Automatically fetch data after successful connection
          refreshData();
        } else {
          toast({
            title: "Connection Failed",
            description: "Your HubSpot API key appears to be invalid.",
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        console.error("Error connecting to HubSpot:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to HubSpot API. Please check your API key and try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsConnecting(false);
      });
  };

  const disconnectFromHubspot = async () => {
    try {
      // Clear API key from Supabase
      const { error } = await supabase
        .from('api_keys')
        .update({ api_key: '' })
        .eq('service', 'hubspot');
        
      if (error) {
        console.error("Error clearing API key from Supabase:", error);
      }
      
      // Also clear from localStorage
      localStorage.removeItem("hubspot_api_key");
      
      // Reset state
      setContacts([]);
      setAccounts([]);
      setNotifications([]);
      
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

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const fetchApiKeyFromSupabase = async () => {
    try {
      // Try to get API key from Supabase first
      const { data, error } = await supabase
        .from('api_keys')
        .select('api_key')
        .eq('service', 'hubspot')
        .single();
        
      if (error) {
        console.error("Error fetching HubSpot API key from Supabase:", error);
        // Fall back to localStorage
        return localStorage.getItem("hubspot_api_key") || "";
      }
      
      return data?.api_key || "";
    } catch (error) {
      console.error("Error in fetchApiKeyFromSupabase:", error);
      return localStorage.getItem("hubspot_api_key") || "";
    }
  };
  
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get API key from Supabase with localStorage as fallback
      const apiKey = await fetchApiKeyFromSupabase();
      
      if (!apiKey) {
        setError("No API key found. Please add your HubSpot API key in the settings.");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Fetch data from HubSpot API
      const [contactsData, companiesData, dealsData] = await Promise.all([
        fetchHubspotContacts(apiKey),
        fetchHubspotCompanies(apiKey),
        fetchHubspotDeals(apiKey)
      ]);
      
      console.log(`Retrieved ${contactsData.length} contacts, ${companiesData.length} companies, and ${dealsData.length} deals from HubSpot`);
      
      // Convert the data to our local format
      const { contacts: localContacts, accounts: localAccounts } = 
        convertHubspotDataToLocalFormat(contactsData, companiesData, dealsData);
      
      // Update state
      setContacts(localContacts);
      setAccounts(localAccounts);
      
      // Calculate analytics based on the new data
      if (localContacts.length > 0) {
        calculateAnalytics(localContacts);
      }
      
      toast({
        title: "Data Synced",
        description: `Successfully loaded ${localContacts.length} contacts and ${localAccounts.length} accounts from HubSpot`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error refreshing HubSpot data:", error);
      setError("Failed to fetch data from HubSpot API. Please check your API key.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          console.log("Failed to read file or result is not a string");
          resolve([]);
          return;
        }
        
        const csvData = event.target.result;
        console.log("CSV data length:", csvData.length);
        
        // Split by line breaks, handling different OS formats
        const lines = csvData.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
        
        if (lines.length <= 1) {
          console.log("CSV has no data rows, only headers or empty");
          resolve([]);
          return;
        }
        
        console.log("Number of lines in CSV:", lines.length);
        console.log("Headers:", lines[0]);
        
        // Parse headers - handle both comma and tab delimiters
        const delimiter = lines[0].includes('\t') ? '\t' : ',';
        const headers = lines[0].split(delimiter).map(header => header.trim());
        console.log("Parsed headers:", headers);
        
        const result = [];
        
        // Start from line 1 (after header)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.trim() === '') continue;
          
          // Handle quoted values correctly
          let inQuote = false;
          let currentValue = '';
          const values = [];
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
              inQuote = !inQuote;
            } else if (char === delimiter && !inQuote) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          // Add the last value
          values.push(currentValue.trim());
          
          // Create object from headers and values
          if (values.length === headers.length) {
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
              // Remove any surrounding quotes
              let value = values[index];
              if (value && value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
              }
              obj[header] = value;
            });
            result.push(obj);
          } else {
            console.log(`Line ${i} has ${values.length} values but ${headers.length} headers. Skipping.`);
            console.log("Values:", values);
          }
        }
        
        console.log("Parsed result count:", result.length);
        if (result.length > 0) {
          console.log("First parsed row:", result[0]);
        }
        
        resolve(result);
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        resolve([]);
      };
      
      reader.readAsText(file);
    });
  };

  const processContactsData = (data: any[]): Contact[] => {
    console.log("Processing contacts data, count:", data.length);
    
    if (data.length === 0) {
      console.log("No contact data to process");
      return [];
    }
    
    return data.map((item, index) => {
      console.log(`Processing contact ${index}:`, item['First Name'], item['Last Name']);
      
      // Make sure we're correctly parsing the HubSpot Score as a number
      let contactScore = 0;
      
      // Try different possible column names for the score
      if (item['HubSpot Score'] !== undefined) {
        contactScore = parseInt(item['HubSpot Score'], 10) || 0;
        console.log(`Found 'HubSpot Score' for ${item['First Name']} ${item['Last Name']}: ${contactScore}`);
      } else if (item['Lead Score'] !== undefined) {
        contactScore = parseInt(item['Lead Score'], 10) || 0;
        console.log(`Found 'Lead Score' for ${item['First Name']} ${item['Last Name']}: ${contactScore}`);
      } else if (item['Score'] !== undefined) {
        contactScore = parseInt(item['Score'], 10) || 0;
        console.log(`Found 'Score' for ${item['First Name']} ${item['Last Name']}: ${contactScore}`);
      }
      
      // Log the column names for debugging
      if (index === 0) {
        console.log("Available columns:", Object.keys(item));
      }
      
      const timesContacted = parseInt(item['Number of times contacted'] || '0', 10);
      
      let priorityLevel: "high" | "medium" | "low" = "medium";
      if (item['Lead Status']?.toLowerCase().includes('qualified') || contactScore >= 20) {
        priorityLevel = "high";
      } else if (item['Lead Status']?.toLowerCase().includes('nurturing') || (contactScore >= 10 && contactScore < 20)) {
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
      
      // Ensure owner is a string
      const ownerString = item['Contact owner'] ? String(item['Contact owner']) : '';
      
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
        owner: ownerString,
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
      
      // Extract cloud provider information from the CSV data
      const cloudProviders = {
        aws: item.isAWSClient === 'Yes' || item.isAWSClient === 'true' || item.isAWSClient === true,
        azure: item.isAzureClient === 'Yes' || item.isAzureClient === 'true' || item.isAzureClient === true,
        googleCloud: item.isGoogleCloudClient === 'Yes' || item.isGoogleCloudClient === 'true' || item.isGoogleCloudClient === true,
        oracle: item.isOracleCloudClient === 'Yes' || item.isOracleCloudClient === 'true' || item.isOracleCloudClient === true
      };
      
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
        activeDeals: parseInt(item.activeDeals || '0', 10),
        city: item.City || '',
        country: item.Country || item['Country/Region'] || '',
        lastActivity: item['Last Activity Date'] || '',
        timesContacted: parseInt(item['Number of times contacted'] || '0', 10),
        buyingRoles: parseInt(item['Number of contacts with a buying role'] || '0', 10),
        pageviews: parseInt(item['Number of Pageviews'] || '0', 10),
        sessions: parseInt(item['Number of Sessions'] || '0', 10),
        leadStatus: item['Lead Status'] || '',
        lifecycleStage: item['Lifecycle Stage'] || '',
        cloudProviders: cloudProviders
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
          if (processedContacts.length > 0) {
            calculateAnalytics(processedContacts);
          }
          
          setIsAuthenticated(true);
          setContacts(processedContacts);
          setAccounts(processedAccounts);
          setNotifications(processedNotifications);
          
          toast({
            title: "Upload successful",
            description: `Processed ${processedContacts.length} contacts and ${processedAccounts.length} accounts`,
          });
        } catch (error) {
          console.error("Error processing files:", error);
          toast({
            title: "Error processing files",
            description: "There was a problem processing your HubSpot data files. Check the console for details.",
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
    isLoading,
    error,
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
