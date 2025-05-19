
import { useState, useEffect } from 'react';
import { Contact, Account, Notification } from '@/types/hubspot';

export const useHubspotDemoData = () => {
  const [useDemoData, setUseDemoData] = useState(false);
  
  useEffect(() => {
    const shouldUseDemoData = localStorage.getItem('hubspot_use_demo_data') === 'true';
    setUseDemoData(shouldUseDemoData);
  }, []);
  
  const getDemoData = () => {
    const demoContacts: Contact[] = [
      {
        id: "demo-1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        company: "Acme Corp",
        title: "CTO",
        phone: "555-123-4567",
        score: 87,
        priorityLevel: "high",
        lastActivity: "2023-05-10T14:30:00Z",
        engagementLevel: 8,
        intentSignals: [
          {
            id: "intent-1",
            type: "website_visit",
            timestamp: "2023-05-09T10:15:00Z",
            description: "Visited pricing page",
            strength: 7
          }
        ],
        owner: "Sarah Johnson",
        lifecycleStage: "opportunity",
        lastEngagementDate: "2023-05-10T14:30:00Z",
        timesContacted: 5,
        city: "San Francisco",
        country: "USA",
        marketingStatus: "subscribed",
        leadStatus: "working"
      },
      {
        id: "demo-2",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@techfirm.com",
        company: "Tech Firm Inc",
        title: "CEO",
        phone: "555-987-6543",
        score: 92,
        priorityLevel: "high",
        lastActivity: "2023-05-11T09:45:00Z",
        engagementLevel: 9,
        intentSignals: [
          {
            id: "intent-2",
            type: "demo_request",
            timestamp: "2023-05-10T16:20:00Z",
            description: "Requested product demo",
            strength: 9
          }
        ],
        owner: "Mike Wilson",
        lifecycleStage: "customer",
        lastEngagementDate: "2023-05-11T09:45:00Z",
        timesContacted: 8,
        city: "New York",
        country: "USA",
        marketingStatus: "subscribed",
        leadStatus: "qualified"
      },
      // Add more demo contacts as needed
    ];
    
    const demoAccounts: Account[] = [
      {
        id: "acct-1",
        name: "Acme Corp",
        industry: "Technology",
        website: "https://acmecorp.example.com",
        size: "Enterprise",
        contacts: [demoContacts[0]],
        stage: "qualification",
        penetrationScore: 45,
        totalDeals: 2,
        totalRevenue: 35000,
        activeDeals: 1,
        city: "San Francisco",
        country: "USA",
        lastActivity: "2023-05-10T14:30:00Z",
        timesContacted: 12,
        buyingRoles: 3,
        pageviews: 85,
        sessions: 24,
        leadStatus: "working",
        lifecycleStage: "opportunity",
        cloudProviders: {
          aws: true,
          azure: true,
          googleCloud: false,
          oracle: false
        }
      },
      {
        id: "acct-2",
        name: "Tech Firm Inc",
        industry: "Finance",
        website: "https://techfirm.example.com",
        size: "Mid-Market",
        contacts: [demoContacts[1]],
        stage: "demo",
        penetrationScore: 65,
        totalDeals: 1,
        totalRevenue: 25000,
        activeDeals: 1,
        city: "New York",
        country: "USA",
        lastActivity: "2023-05-11T09:45:00Z",
        timesContacted: 8,
        buyingRoles: 2,
        pageviews: 52,
        sessions: 18,
        leadStatus: "qualified",
        lifecycleStage: "opportunity"
      }
    ];
    
    const demoNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "intent_signal", // Use the exact enum value
        entityId: "demo-1",
        entityType: "contact",
        message: "High intent signal from John Smith at Acme Corp",
        timestamp: "2023-05-09T10:20:00Z",
        read: false
      },
      {
        id: "notif-2",
        type: "stage_change", // Use the exact enum value
        entityId: "acct-2",
        entityType: "account",
        message: "Tech Firm Inc moved to Demo stage",
        timestamp: "2023-05-10T16:25:00Z",
        read: false
      },
      {
        id: "notif-3",
        type: "priority_change", // Use the exact enum value
        entityId: "demo-2",
        entityType: "contact",
        message: "Jane Doe priority increased to High",
        timestamp: "2023-05-11T09:50:00Z",
        read: true
      }
    ];
    
    const demoContactOwnerStats = {
      "Sarah Johnson": 5,
      "Mike Wilson": 8,
      "Alex Thompson": 3
    };
    
    const demoContactLifecycleStats = {
      "Sarah Johnson": {
        "lead": 2,
        "opportunity": 2,
        "customer": 1
      },
      "Mike Wilson": {
        "lead": 1,
        "opportunity": 3,
        "customer": 4
      },
      "Alex Thompson": {
        "lead": 1,
        "opportunity": 1,
        "customer": 1
      }
    };
    
    const demoJobTitleStats = {
      "CTO": 3,
      "CEO": 2,
      "VP of Engineering": 4,
      "VP of Sales": 3,
      "IT Manager": 5
    };
    
    const demoEngagementByOwner = {
      "Sarah Johnson": {
        high: 2,
        medium: 2,
        low: 1
      },
      "Mike Wilson": {
        high: 3,
        medium: 3,
        low: 2
      },
      "Alex Thompson": {
        high: 1,
        medium: 1,
        low: 1
      }
    };
    
    return {
      contacts: demoContacts,
      accounts: demoAccounts,
      notifications: demoNotifications,
      contactOwnerStats: demoContactOwnerStats,
      contactLifecycleStats: demoContactLifecycleStats,
      jobTitleStats: demoJobTitleStats,
      engagementByOwner: demoEngagementByOwner
    };
  };
  
  return { useDemoData, getDemoData };
};

export default useHubspotDemoData;
