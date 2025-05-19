
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useHubspotDemoData } from "@/hooks/useHubspotDemoData";
import { Contact, Account, Notification } from "@/types/hubspot";
import { HubspotState } from "./types";

export const useHubspotState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contactOwnerStats, setContactOwnerStats] = useState<Record<string, number>>({});
  const [contactLifecycleStats, setContactLifecycleStats] = useState<Record<string, Record<string, number>>>({});
  const [jobTitleStats, setJobTitleStats] = useState<Record<string, number>>({});
  const [engagementByOwner, setEngagementByOwner] = useState<Record<string, {high: number, medium: number, low: number}>>({});

  const { toast } = useToast();
  
  // Import demo data hook
  const { useDemoData, getDemoData } = useHubspotDemoData();

  // Apply demo data if needed
  useEffect(() => {
    if (useDemoData) {
      const demoData = getDemoData();
      setContacts(demoData.contacts);
      setAccounts(demoData.accounts);
      setNotifications(demoData.notifications);
      setContactOwnerStats(demoData.contactOwnerStats);
      setContactLifecycleStats(demoData.contactLifecycleStats);
      setJobTitleStats(demoData.jobTitleStats);
      setEngagementByOwner(demoData.engagementByOwner);
      setIsAuthenticated(true);
      
      toast({
        title: "Using sample data",
        description: "Displaying sample data for demonstration purposes."
      });
    }
  }, [useDemoData, toast]);

  const state: HubspotState = {
    isAuthenticated,
    contacts,
    accounts,
    notifications,
    contactOwnerStats,
    contactLifecycleStats,
    jobTitleStats,
    engagementByOwner
  };

  const setters = {
    setIsAuthenticated,
    setContacts,
    setAccounts,
    setNotifications,
    setContactOwnerStats,
    setContactLifecycleStats,
    setJobTitleStats,
    setEngagementByOwner
  };

  return { state, setters };
};
