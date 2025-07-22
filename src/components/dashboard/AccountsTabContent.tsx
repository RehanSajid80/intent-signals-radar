
import React, { useState } from 'react';
import AccountsTable from "@/components/dashboard/accounts/AccountsTable";
import AccountEngagementList from "@/components/dashboard/accounts/AccountEngagementList";
import ContactRoleMapping from "@/components/dashboard/accounts/ContactRoleMapping";
import CloudProviderAnalysis from "@/components/dashboard/accounts/CloudProviderAnalysis";
import IntentUpload from "@/components/dashboard/IntentUpload";
import { useHubspot } from "@/context/hubspot";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers, ListFilter, ChevronRight, BarChart, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountsTabContent = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const { accounts: contextAccounts } = useHubspot();
  const { accounts: supabaseAccounts, isLoading, loadData } = useSupabaseData();
  
  // Use Supabase data if available, fallback to context data
  const accounts = supabaseAccounts.length > 0 ? supabaseAccounts : contextAccounts;
  
  const handleAccountSelected = React.useCallback((accountId: string) => {
    setSelectedAccountId(accountId);
  }, []);
  
  const selectedAccount = selectedAccountId ? accounts.find(a => a.id === selectedAccountId) : null;
  
  return (
    <div>
      {selectedAccountId ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedAccountId(null)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Accounts
            </Button>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold mb-1">{selectedAccount?.name}</h2>
            <div className="text-muted-foreground">
              {selectedAccount?.industry} · {selectedAccount?.size} · {selectedAccount?.contacts.length} contacts
            </div>
          </div>
          
          <ContactRoleMapping accountId={selectedAccountId} />
        </div>
      ) : (
        <Tabs defaultValue="table" className="mb-4">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              Engagement View
            </TabsTrigger>
            <TabsTrigger value="intent" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Intent Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div></div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadData}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>
              <CloudProviderAnalysis accountId="default" />
              <AccountsTable onSelectAccount={handleAccountSelected} accounts={accounts} />
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div></div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadData}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
              </div>
              <CloudProviderAnalysis accountId="default" />
              <AccountEngagementList onAccountSelected={handleAccountSelected} accounts={accounts} />
            </div>
          </TabsContent>
          
          <TabsContent value="intent" className="mt-4">
            <div className="space-y-4">
              <IntentUpload />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AccountsTabContent;
