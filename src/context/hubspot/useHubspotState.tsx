
import { useState } from "react";
import type { Contact, Account, Deal, DealStage, OwnerStats, LifecycleStage, IntentSignal } from "./types";

export interface HubspotState {
  contacts: Contact[];
  accounts: Account[];
  deals: Deal[];
  dealStages: DealStage[];
  ownerStats: OwnerStats[];
  lifecycleStages: LifecycleStage[];
  intentSignals: IntentSignal[];
  isAuthenticated: boolean;
  lastSyncTime: Date | null;
}

export interface HubspotStateSetters {
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setDealStages: React.Dispatch<React.SetStateAction<DealStage[]>>;
  setOwnerStats: React.Dispatch<React.SetStateAction<OwnerStats[]>>;
  setLifecycleStages: React.Dispatch<React.SetStateAction<LifecycleStage[]>>;
  setIntentSignals: React.Dispatch<React.SetStateAction<IntentSignal[]>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setLastSyncTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const useHubspotState = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealStages, setDealStages] = useState<DealStage[]>([]);
  const [ownerStats, setOwnerStats] = useState<OwnerStats[]>([]);
  const [lifecycleStages, setLifecycleStages] = useState<LifecycleStage[]>([]);
  const [intentSignals, setIntentSignals] = useState<IntentSignal[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const state: HubspotState = {
    contacts,
    accounts,
    deals,
    dealStages,
    ownerStats,
    lifecycleStages,
    intentSignals,
    isAuthenticated,
    lastSyncTime,
  };

  const setters: HubspotStateSetters = {
    setContacts,
    setAccounts,
    setDeals,
    setDealStages,
    setOwnerStats,
    setLifecycleStages,
    setIntentSignals,
    setIsAuthenticated,
    setLastSyncTime,
  };

  return { state, setters };
};
