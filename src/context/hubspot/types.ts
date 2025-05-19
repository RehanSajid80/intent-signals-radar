
import { 
  Contact, 
  Account, 
  Notification, 
  FileUploadItem 
} from "@/types/hubspot";

export interface HubspotState {
  isAuthenticated: boolean;
  contacts: Contact[];
  accounts: Account[];
  notifications: Notification[];
  contactOwnerStats: Record<string, number>;
  contactLifecycleStats: Record<string, Record<string, number>>;
  jobTitleStats: Record<string, number>;
  engagementByOwner: Record<string, {high: number, medium: number, low: number}>;
}

export interface HubspotActions {
  connectToHubspot: () => Promise<void>;
  disconnectFromHubspot: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  refreshData: () => Promise<void>;
  processFileUpload: (files: FileUploadItem[]) => Promise<void>;
}

export interface HubspotContextType extends HubspotState, HubspotActions {
  isConnecting: boolean;
  isProcessing: boolean;
  priorityContacts: Contact[];
}
