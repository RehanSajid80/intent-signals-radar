
import { useState } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useHubspotOperations } from "@/hooks/useHubspotOperations";
import type { HubspotState, HubspotStateSetters } from "./useHubspotState";
import type { HubspotActions } from "./types";

export const useHubspotActions = (
  state: HubspotState,
  setters: HubspotStateSetters
) => {
  const { handleAsync, isLoading: isProcessing } = useErrorHandler();
  const { connectToHubspot, disconnectFromHubspot, refreshData, isConnecting } = useHubspotOperations();

  const actions: HubspotActions = {
    connectToHubspot: async () => {
      const result = await handleAsync(async () => {
        const data = await connectToHubspot();
        if (data) {
          setters.setContacts(data.contacts || []);
          setters.setAccounts(data.accounts || []);
          setters.setIsAuthenticated(true);
          setters.setLastSyncTime(new Date());
        }
        return data;
      });
      return result !== null;
    },

    disconnectFromHubspot: async () => {
      await handleAsync(async () => {
        await disconnectFromHubspot();
        setters.setContacts([]);
        setters.setAccounts([]);
        setters.setDeals([]);
        setters.setDealStages([]);
        setters.setOwnerStats([]);
        setters.setLifecycleStages([]);
        setters.setIntentSignals([]);
        setters.setIsAuthenticated(false);
        setters.setLastSyncTime(null);
      });
    },

    refreshData: async () => {
      const result = await handleAsync(async () => {
        const data = await refreshData();
        if (data) {
          setters.setContacts(data.contacts || []);
          setters.setAccounts(data.accounts || []);
          setters.setLastSyncTime(new Date());
        }
        return data;
      });
      return result !== null;
    },

    testHubspotConnection: async (apiKey?: string) => {
      return await handleAsync(async () => {
        // Mock implementation for now
        return new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });
      }) !== null;
    }
  };

  return {
    actions,
    isConnecting,
    isProcessing
  };
};
