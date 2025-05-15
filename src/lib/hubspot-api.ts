import { toast } from "@/hooks/use-toast";

// Define types for HubSpot API responses
export interface HubspotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    jobtitle?: string;
    phone?: string;
    hs_lead_status?: string;
    lifecyclestage?: string;
    lastmodifieddate?: string;
    createdate?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface HubspotCompany {
  id: string;
  properties: {
    name?: string;
    industry?: string;
    website?: string;
    numberofemployees?: string;
    city?: string;
    country?: string;
    phone?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface HubspotDeal {
  id: string;
  properties: {
    dealname?: string;
    amount?: string;
    dealstage?: string;
    pipeline?: string;
    closedate?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

// Define API endpoints
const HUBSPOT_BASE_URL = "https://api.hubapi.com";
const CONTACT_ENDPOINT = "/crm/v3/objects/contacts";
const COMPANY_ENDPOINT = "/crm/v3/objects/companies";
const DEAL_ENDPOINT = "/crm/v3/objects/deals";

// Helper function to make API requests
async function makeHubspotRequest<T>(
  endpoint: string, 
  apiKey: string, 
  params: Record<string, string> = {}
): Promise<T> {
  // Build query parameters
  const queryParams = new URLSearchParams(params).toString();
  const url = `${HUBSPOT_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("HubSpot API error:", errorData);
      throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error making HubSpot request:", error);
    throw error;
  }
}

// Function to validate API key and test connection
export async function testHubspotConnection(apiKey: string): Promise<boolean> {
  try {
    // Instead of testing with the OAuth endpoint (which has CORS issues),
    // try to fetch a simple API endpoint with a minimal number of records
    const testEndpoint = `${CONTACT_ENDPOINT}?limit=1`;
    const url = `${HUBSPOT_BASE_URL}${testEndpoint}`;
    
    // Create a timeout to abort the request if it takes too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Check if the API key is valid by checking the response
    return response.ok;
  } catch (error) {
    console.error("HubSpot connection test failed:", error);
    
    // If this is a CORS error or network error, we can't tell if the API key is valid
    // So we'll assume it is and let the user proceed - they can verify through data retrieval
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log("Detected network error - may be CORS related. Proceeding with API key.");
      // Return true to allow the user to try using the API key
      // The subsequent data fetching will validate if it actually works
      return true;
    }
    
    return false;
  }
}

// Function to fetch contacts from HubSpot
export async function fetchHubspotContacts(apiKey: string, limit: number = 100): Promise<HubspotContact[]> {
  try {
    interface ContactsResponse {
      results: HubspotContact[];
      paging?: {
        next?: {
          after: string;
        }
      };
    }
    
    // Define properties to retrieve
    const properties = [
      "firstname", 
      "lastname", 
      "email", 
      "company", 
      "jobtitle", 
      "phone", 
      "hs_lead_status",
      "lifecyclestage",
      "lastmodifieddate",
      "createdate",
      "hubspot_owner_id",
      "hs_email_last_click_date",
      "hs_email_last_open_date"
    ];
    
    const response = await makeHubspotRequest<ContactsResponse>(
      `${CONTACT_ENDPOINT}`, 
      apiKey, 
      { 
        limit: limit.toString(),
        properties: properties.join(",")
      }
    );
    
    return response.results || [];
  } catch (error) {
    console.error("Error fetching HubSpot contacts:", error);
    toast({
      title: "Error fetching contacts",
      description: "Could not fetch contacts from HubSpot. Please check your API key.",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch companies from HubSpot
export async function fetchHubspotCompanies(apiKey: string, limit: number = 100): Promise<HubspotCompany[]> {
  try {
    interface CompaniesResponse {
      results: HubspotCompany[];
      paging?: {
        next?: {
          after: string;
        }
      };
    }
    
    // Define properties to retrieve
    const properties = [
      "name",
      "industry",
      "website",
      "numberofemployees",
      "city",
      "country",
      "phone"
    ];
    
    const response = await makeHubspotRequest<CompaniesResponse>(
      `${COMPANY_ENDPOINT}`, 
      apiKey, 
      { 
        limit: limit.toString(),
        properties: properties.join(",")
      }
    );
    
    return response.results || [];
  } catch (error) {
    console.error("Error fetching HubSpot companies:", error);
    toast({
      title: "Error fetching companies",
      description: "Could not fetch companies from HubSpot. Please check your API key.",
      variant: "destructive"
    });
    return [];
  }
}

// Function to fetch deals from HubSpot
export async function fetchHubspotDeals(apiKey: string, limit: number = 100): Promise<HubspotDeal[]> {
  try {
    interface DealsResponse {
      results: HubspotDeal[];
      paging?: {
        next?: {
          after: string;
        }
      };
    }
    
    // Define properties to retrieve
    const properties = [
      "dealname",
      "amount",
      "dealstage",
      "pipeline",
      "closedate",
      "hubspot_owner_id"
    ];
    
    const response = await makeHubspotRequest<DealsResponse>(
      `${DEAL_ENDPOINT}`, 
      apiKey, 
      { 
        limit: limit.toString(),
        properties: properties.join(",")
      }
    );
    
    return response.results || [];
  } catch (error) {
    console.error("Error fetching HubSpot deals:", error);
    toast({
      title: "Error fetching deals",
      description: "Could not fetch deals from HubSpot. Please check your API key.",
      variant: "destructive"
    });
    return [];
  }
}

// Convert HubSpot data to local data format
export function convertHubspotDataToLocalFormat(
  contacts: HubspotContact[],
  companies: HubspotCompany[],
  deals: HubspotDeal[]
) {
  // Map contacts to local format
  const localContacts = contacts.map(contact => {
    const props = contact.properties;
    
    // Calculate priority level based on lead status and lifecycle stage
    let priorityLevel: "high" | "medium" | "low" = "low";
    if (props.hs_lead_status?.toLowerCase().includes('qualified') || 
        props.lifecyclestage === 'opportunity') {
      priorityLevel = "high";
    } else if (props.hs_lead_status?.toLowerCase().includes('open') || 
              props.lifecyclestage === 'salesqualifiedlead') {
      priorityLevel = "medium";
    }
    
    // Create an engagement level score (simplified)
    const lastModified = props.lastmodifieddate ? new Date(props.lastmodifieddate) : null;
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Calculate engagement level (1-10)
    let engagementLevel = 1;
    if (lastModified && lastModified > thirtyDaysAgo) {
      // More recent activity gets higher score
      const daysAgo = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
      engagementLevel = Math.max(1, 10 - Math.floor(daysAgo / 3)); 
    }
    
    // Create intent signals
    const intentSignals = [];
    
    // Helper function to safely convert date strings
    const safelyCreateDate = (dateValue: string | number | boolean | undefined): Date | null => {
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        return new Date(dateValue);
      }
      return null;
    };
    
    if (props.hs_email_last_open_date) {
      const openDate = safelyCreateDate(props.hs_email_last_open_date);
      if (openDate) {
        intentSignals.push({
          id: `intent-email-${contact.id}`,
          type: "email_open",
          timestamp: openDate.toISOString(),
          description: "Opened marketing email",
          strength: 60
        });
      }
    }
    
    if (props.hs_email_last_click_date) {
      const clickDate = safelyCreateDate(props.hs_email_last_click_date);
      if (clickDate) {
        intentSignals.push({
          id: `intent-click-${contact.id}`,
          type: "email_open", 
          timestamp: clickDate.toISOString(),
          description: "Clicked email link",
          strength: 75
        });
      }
    }
    
    // Ensure hubspot_owner_id is always a string
    const ownerIdString = props.hubspot_owner_id ? String(props.hubspot_owner_id) : '';
    
    return {
      id: contact.id,
      firstName: props.firstname || '',
      lastName: props.lastname || '',
      email: props.email || '',
      company: props.company || '',
      title: props.jobtitle || '',
      phone: props.phone || '',
      score: engagementLevel * 10, // Simple score calculation
      priorityLevel: priorityLevel,
      lastActivity: props.lastmodifieddate || '',
      engagementLevel: engagementLevel,
      intentSignals: intentSignals,
      owner: ownerIdString,
      lifecycleStage: props.lifecyclestage || '',
      lastEngagementDate: props.lastmodifieddate || '',
      timesContacted: 0, // Not available in basic API
      city: '',
      country: '',
      marketingStatus: '',
      leadStatus: props.hs_lead_status || ''
    };
  });
  
  // Map companies to local format
  const companyMap = new Map();
  companies.forEach(company => {
    const props = company.properties;
    
    companyMap.set(props.name || '', {
      id: company.id,
      name: props.name || '',
      industry: props.industry || '',
      website: props.website || '',
      size: props.numberofemployees || '',
      contacts: [], // Will be filled later
      stage: "awareness" as any, // Default
      penetrationScore: 0, // Will calculate later
      totalDeals: 0, // Will calculate later
      totalRevenue: 0, // Will calculate later
      activeDeals: 0, // Will calculate later
      city: props.city || '',
      country: props.country || '',
      lastActivity: '',
      timesContacted: 0,
      buyingRoles: 0,
      pageviews: 0,
      sessions: 0,
      leadStatus: '',
      lifecycleStage: ''
    });
  });
  
  // Assign contacts to companies
  localContacts.forEach(contact => {
    if (contact.company && companyMap.has(contact.company)) {
      const company = companyMap.get(contact.company);
      company.contacts.push(contact);
      
      // Update company metrics
      if (contact.lastActivity && (!company.lastActivity || contact.lastActivity > company.lastActivity)) {
        company.lastActivity = contact.lastActivity;
      }
      
      // Count buying roles (simplified - contacts with title containing relevant keywords)
      const buyingRoleKeywords = ['director', 'vp', 'chief', 'head', 'manager', 'lead'];
      if (contact.title && buyingRoleKeywords.some(keyword => contact.title.toLowerCase().includes(keyword))) {
        company.buyingRoles += 1;
      }
    }
  });
  
  // Process deals data and update companies
  deals.forEach(deal => {
    const props = deal.properties;
    const dealCompanyName = props.dealname?.split(' - ')[0]; // Assuming format "Company - Deal Name"
    
    if (dealCompanyName && companyMap.has(dealCompanyName)) {
      const company = companyMap.get(dealCompanyName);
      company.totalDeals += 1;
      
      // Add deal amount if available
      if (props.amount) {
        company.totalRevenue += parseInt(props.amount, 10) || 0;
      }
      
      // Count active deals
      const activeStages = ['appointment_scheduled', 'qualified_to_buy', 'presentation_scheduled', 'contract_sent'];
      if (props.dealstage && activeStages.includes(props.dealstage)) {
        company.activeDeals += 1;
      }
      
      // Update company stage based on deal stage
      if (props.dealstage) {
        let companyStage = 'awareness';
        
        // Map HubSpot deal stages to our stages
        if (['closedwon'].includes(props.dealstage)) {
          companyStage = 'closed_won';
        } else if (['closedlost'].includes(props.dealstage)) {
          companyStage = 'closed_lost';
        } else if (['contract_sent'].includes(props.dealstage)) { 
          companyStage = 'negotiation';
        } else if (['proposal_sent'].includes(props.dealstage)) {
          companyStage = 'proposal';
        } else if (['presentation_scheduled'].includes(props.dealstage)) {
          companyStage = 'demo';
        } else if (['qualified_to_buy'].includes(props.dealstage)) {
          companyStage = 'qualification';
        } else if (['appointment_scheduled'].includes(props.dealstage)) {
          companyStage = 'prospecting';
        }
        
        company.stage = companyStage as any;
      }
    }
  });
  
  // Calculate penetration score for companies
  companyMap.forEach(company => {
    // Simple calculation: (number of contacts / 10) * 10 with a max of 100
    const contactScore = Math.min(10, company.contacts.length);
    // Role score: number of buying roles * 20 with a max of 60
    const roleScore = Math.min(60, company.buyingRoles * 20);
    // Engagement score: based on active deals
    const dealScore = Math.min(30, company.activeDeals * 10);
    
    company.penetrationScore = contactScore + roleScore + dealScore;
    if (company.penetrationScore > 100) company.penetrationScore = 100;
  });
  
  return {
    contacts: localContacts,
    accounts: Array.from(companyMap.values())
  };
}
