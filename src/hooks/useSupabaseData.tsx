import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Contact, Account } from "@/types/hubspot";

export interface SupabaseDataState {
  contacts: Contact[];
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
}

export const useSupabaseData = () => {
  const [state, setState] = useState<SupabaseDataState>({
    contacts: [],
    accounts: [],
    isLoading: true,
    error: null
  });

  // Convert database row to Contact type
  const convertDbToContact = (row: any): Contact => ({
    id: row.hubspot_id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    company: row.company || '',
    title: row.title || '',
    phone: row.phone || '',
    score: row.score || 0,
    priorityLevel: row.priority_level || 'low',
    lastActivity: row.last_activity || '',
    engagementLevel: row.engagement_level || 1,
    intentSignals: [],
    owner: row.owner || '',
    lifecycleStage: row.lifecycle_stage || '',
    lastEngagementDate: row.last_engagement_date || '',
    timesContacted: row.times_contacted || 0,
    city: row.city || '',
    country: row.country || '',
    marketingStatus: row.marketing_status || '',
    leadStatus: row.lead_status || ''
  });

  // Convert database row to Account type
  const convertDbToAccount = (row: any, contacts: Contact[]): Account => ({
    id: row.hubspot_id,
    name: row.name,
    industry: row.industry || '',
    website: row.website || '',
    size: row.size || '',
    contacts: contacts.filter(contact => contact.company === row.name),
    stage: row.stage || 'awareness',
    penetrationScore: row.penetration_score || 0,
    totalDeals: row.total_deals || 0,
    totalRevenue: row.total_revenue || 0,
    activeDeals: row.active_deals || 0,
    city: row.city || '',
    country: row.country || '',
    lastActivity: row.last_activity || '',
    timesContacted: row.times_contacted || 0,
    buyingRoles: row.buying_roles || 0,
    pageviews: row.pageviews || 0,
    sessions: row.sessions || 0,
    leadStatus: row.lead_status || '',
    lifecycleStage: row.lifecycle_stage || ''
  });

  // Load data from Supabase
  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [contactsResult, accountsResult] = await Promise.all([
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('accounts').select('*').order('created_at', { ascending: false })
      ]);

      if (contactsResult.error) throw contactsResult.error;
      if (accountsResult.error) throw accountsResult.error;

      const contacts = contactsResult.data?.map(convertDbToContact) || [];
      const accounts = accountsResult.data?.map(row => convertDbToAccount(row, contacts)) || [];

      setState({
        contacts,
        accounts,
        isLoading: false,
        error: null
      });

      return { contacts, accounts };
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
      return null;
    }
  };

  // Save contacts to Supabase
  const saveContacts = async (contacts: Contact[]) => {
    try {
      const contactsData = contacts.map(contact => ({
        user_id: null, // Allow anonymous for now
        hubspot_id: contact.id,
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        company: contact.company,
        title: contact.title,
        phone: contact.phone,
        score: contact.score,
        priority_level: contact.priorityLevel,
        last_activity: contact.lastActivity || null,
        engagement_level: contact.engagementLevel,
        owner: contact.owner,
        lifecycle_stage: contact.lifecycleStage,
        last_engagement_date: contact.lastEngagementDate || null,
        times_contacted: contact.timesContacted,
        city: contact.city,
        country: contact.country,
        marketing_status: contact.marketingStatus,
        lead_status: contact.leadStatus
      }));

      const { error } = await supabase
        .from('contacts')
        .upsert(contactsData, { 
          onConflict: 'user_id,hubspot_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      console.log(`Saved ${contacts.length} contacts to Supabase`);
    } catch (error) {
      console.error('Error saving contacts:', error);
      throw error;
    }
  };

  // Save accounts to Supabase
  const saveAccounts = async (accounts: Account[]) => {
    try {
      const accountsData = accounts.map(account => ({
        user_id: null, // Allow anonymous for now
        hubspot_id: account.id,
        name: account.name,
        industry: account.industry,
        website: account.website,
        size: account.size,
        stage: account.stage,
        penetration_score: account.penetrationScore,
        total_deals: account.totalDeals,
        total_revenue: account.totalRevenue,
        active_deals: account.activeDeals,
        city: account.city,
        country: account.country,
        last_activity: account.lastActivity || null,
        times_contacted: account.timesContacted,
        buying_roles: account.buyingRoles,
        pageviews: account.pageviews,
        sessions: account.sessions,
        lead_status: account.leadStatus,
        lifecycle_stage: account.lifecycleStage
      }));

      const { error } = await supabase
        .from('accounts')
        .upsert(accountsData, { 
          onConflict: 'user_id,hubspot_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      console.log(`Saved ${accounts.length} accounts to Supabase`);
    } catch (error) {
      console.error('Error saving accounts:', error);
      throw error;
    }
  };

  // Save both contacts and accounts
  const saveData = async (contacts: Contact[], accounts: Account[]) => {
    try {
      await Promise.all([
        saveContacts(contacts),
        saveAccounts(accounts)
      ]);
    } catch (error) {
      console.error('Error saving data to Supabase:', error);
      throw error;
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  return {
    ...state,
    loadData,
    saveData,
    saveContacts,
    saveAccounts
  };
};