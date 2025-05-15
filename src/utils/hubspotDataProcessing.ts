
import { Contact, Account, IntentSignal, FunnelStage } from "@/types/hubspot";

export const processContactsData = (data: any[]): Contact[] => {
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

export const processAccountsData = (data: any[], processedContacts: Contact[]): Account[] => {
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

export const calculateAnalytics = (contactsData: Contact[]) => {
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
  
  return {
    contactOwnerStats: ownerStats,
    contactLifecycleStats: lifecycleStats,
    jobTitleStats: jobStats,
    engagementByOwner: engagementStats
  };
};
