
import { useState, useEffect } from 'react';
import { Contact, Account, IntentSignal } from "@/types/hubspot";

export const useHubspotDemoData = () => {
  const [useDemoData, setUseDemoData] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const shouldUseDemoData = localStorage.getItem('hubspot_use_demo_data') === 'true';
    setUseDemoData(shouldUseDemoData);
    setLoading(false);
  }, []);
  
  // Generate mock contacts
  const generateContacts = (): Contact[] => {
    const companies = ['Acme Inc', 'TechGiant', 'DataCorp', 'Cloud Solutions', 'Innovate Systems', 'SecureNet'];
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa', 'James', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Martinez'];
    const titles = ['CEO', 'CTO', 'Marketing Director', 'Sales Manager', 'IT Director', 'VP of Operations', 'Product Manager', 'Lead Developer'];
    const lifecycleStages = ['Lead', 'Marketing Qualified Lead', 'Sales Qualified Lead', 'Opportunity', 'Customer'];
    const owners = ['Alex Johnson', 'Maria Rodriguez', 'Samantha Lee', 'James Wilson', 'Robert Chen'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const lifecycleStage = lifecycleStages[Math.floor(Math.random() * lifecycleStages.length)];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const score = Math.floor(Math.random() * 90) + 10; // 10-100
      const priorityLevel = score > 70 ? 'high' : (score > 40 ? 'medium' : 'low');
      const engagementLevel = Math.floor((score / 100) * 10);
      const timesContacted = Math.floor(Math.random() * 15);
      
      // Generate random date in last 30 days
      const lastEngagementDate = new Date();
      lastEngagementDate.setDate(lastEngagementDate.getDate() - Math.floor(Math.random() * 30));
      
      // Generate some intent signals
      const intentSignals: IntentSignal[] = [];
      if (Math.random() > 0.5) {
        intentSignals.push({
          id: `intent-email-${i}`,
          type: "email_open",
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          description: "Opened marketing email",
          strength: Math.floor(Math.random() * 40) + 30 // 30-70
        });
      }
      
      if (Math.random() > 0.7) {
        intentSignals.push({
          id: `intent-web-${i}`,
          type: "website_visit",
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
          description: "Visited pricing page",
          strength: Math.floor(Math.random() * 30) + 60 // 60-90
        });
      }
      
      return {
        id: `contact-${i}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
        company,
        title,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        score,
        priorityLevel,
        lastActivity: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
        engagementLevel,
        intentSignals,
        owner,
        lifecycleStage,
        lastEngagementDate: lastEngagementDate.toISOString(),
        timesContacted,
        city: ['New York', 'San Francisco', 'Chicago', 'Austin', 'Boston'][Math.floor(Math.random() * 5)],
        country: 'USA',
        marketingStatus: Math.random() > 0.2 ? 'Subscribed' : 'Unsubscribed',
        leadStatus: ['New', 'Open', 'In Progress', 'Qualified', 'Unqualified'][Math.floor(Math.random() * 5)]
      };
    });
  };
  
  // Generate mock accounts
  const generateAccounts = (demoContacts: Contact[]): Account[] => {
    // Group contacts by company
    const companyGroups = demoContacts.reduce((groups: Record<string, Contact[]>, contact) => {
      if (!groups[contact.company]) {
        groups[contact.company] = [];
      }
      groups[contact.company].push(contact);
      return groups;
    }, {});
    
    // Create account for each company
    return Object.entries(companyGroups).map(([company, contacts], index) => {
      const stages: ('awareness' | 'prospecting' | 'qualification' | 'demo' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost')[] = 
        ['awareness', 'prospecting', 'qualification', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const totalDeals = Math.floor(Math.random() * 5) + 1;
      const activeDeals = Math.floor(Math.random() * totalDeals);
      const totalRevenue = Math.floor(Math.random() * 500000) + 10000;
      const penetrationScore = Math.min(100, Math.floor(Math.random() * 80) + contacts.length * 5);
      
      const sizes = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
      const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail'];
      
      return {
        id: `account-${index}`,
        name: company,
        industry: industries[Math.floor(Math.random() * industries.length)],
        website: `https://www.${company.toLowerCase().replace(' ', '')}.com`,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        contacts,
        stage,
        penetrationScore,
        totalDeals,
        totalRevenue,
        activeDeals,
        city: contacts[0]?.city || 'Unknown',
        country: contacts[0]?.country || 'Unknown',
        lastActivity: contacts.sort((a, b) => 
          new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        )[0]?.lastActivity || '',
        timesContacted: contacts.reduce((sum, contact) => sum + contact.timesContacted, 0),
        buyingRoles: contacts.filter(c => 
          ['CEO', 'CTO', 'VP', 'Director', 'Manager'].some(role => c.title?.includes(role))
        ).length,
        pageviews: Math.floor(Math.random() * 500) + 50,
        sessions: Math.floor(Math.random() * 100) + 10,
        leadStatus: ['New', 'Open', 'Qualified'][Math.floor(Math.random() * 3)],
        lifecycleStage: ['Lead', 'Opportunity', 'Customer'][Math.floor(Math.random() * 3)],
        cloudProviders: {
          aws: Math.random() > 0.5,
          azure: Math.random() > 0.6, 
          googleCloud: Math.random() > 0.7,
          oracle: Math.random() > 0.8
        }
      };
    });
  };
  
  // Calculate analytics from contacts
  const generateAnalytics = (contacts: Contact[]) => {
    const ownerStats: Record<string, number> = {};
    const lifecycleStats: Record<string, Record<string, number>> = {};
    const jobStats: Record<string, number> = {};
    const engagementStats: Record<string, {high: number, medium: number, low: number}> = {};
    
    contacts.forEach(contact => {
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
      
      // Categorize engagement as high/medium/low
      if (contact.engagementLevel >= 7) {
        engagementStats[owner].high++;
      } else if (contact.engagementLevel >= 4) {
        engagementStats[owner].medium++;
      } else {
        engagementStats[owner].low++;
      }
    });
    
    return {
      contactOwnerStats: ownerStats,
      contactLifecycleStats: lifecycleStats,
      jobTitleStats: jobStats,
      engagementByOwner: engagementStats
    };
  };
  
  // Generate all the data
  const getDemoData = () => {
    const demoContacts = generateContacts();
    const demoAccounts = generateAccounts(demoContacts);
    const analytics = generateAnalytics(demoContacts);
    
    return {
      contacts: demoContacts,
      accounts: demoAccounts,
      contactOwnerStats: analytics.contactOwnerStats,
      contactLifecycleStats: analytics.contactLifecycleStats,
      jobTitleStats: analytics.jobTitleStats,
      engagementByOwner: analytics.engagementByOwner,
      notifications: [
        {
          id: 'notification-1',
          type: 'intent_signal',
          entityId: demoContacts[0].id,
          entityType: 'contact',
          message: `${demoContacts[0].firstName} ${demoContacts[0].lastName} showed high intent by visiting the pricing page`,
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false
        },
        {
          id: 'notification-2',
          type: 'stage_change',
          entityId: demoAccounts[0].id,
          entityType: 'account',
          message: `${demoAccounts[0].name} has moved to ${demoAccounts[0].stage} stage`,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: true
        }
      ]
    };
  };
  
  return {
    useDemoData,
    loading,
    getDemoData
  };
};
