
// Types for HubSpot integration
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
  ownerId?: string;
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

export interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: DealStage;
  closeDate: string;
  probability: number;
  ownerId: string;
  accountId: string;
}

export type DealStage = 
  | "prospecting" 
  | "qualification" 
  | "needs_analysis" 
  | "value_proposition" 
  | "id_decision_makers" 
  | "perception_analysis" 
  | "proposal_price_quote" 
  | "negotiation_review" 
  | "closed_won" 
  | "closed_lost";

export interface OwnerStats {
  ownerId: string;
  name: string;
  contactCount: number;
  dealCount: number;
  totalRevenue: number;
}

export interface LifecycleStage {
  stage: string;
  label: string;
  count: number;
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

export type FunnelStage = 
  | "awareness" 
  | "prospecting" 
  | "qualification" 
  | "demo" 
  | "proposal" 
  | "negotiation" 
  | "closed_won" 
  | "closed_lost";

export interface CloudProviderDetails {
  aws: string;
  azure: string;
  googleCloud: string;
  oracle: string;
}

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

export interface HubspotContextType extends HubspotState {
  isConnecting: boolean;
  isProcessing: boolean;
  priorityContacts: Contact[];
  connectToHubspot: () => void;
  disconnectFromHubspot: () => void;
  markNotificationAsRead: (id: string) => void;
  refreshData: () => Promise<void>;
  processFileUpload: (files: any[]) => Promise<void>;
  deals?: Deal[];
}
