
import React, { useState } from 'react';
import AccountsTable from "@/components/dashboard/accounts/AccountsTable";
import AccountEngagementList from "@/components/dashboard/accounts/AccountEngagementList";
import ContactRoleMapping from "@/components/dashboard/accounts/ContactRoleMapping";
import { useHubspot } from "@/context/HubspotContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers, ListFilter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountsTabContent = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const { accounts } = useHubspot();
  
  // Listen for navigation from the Account list
  const handleAccountSelected = React.useCallback((accountId: string) => {
    setSelectedAccountId(accountId);
  }, []);
  
  // Find the selected account
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
        <Tabs defaultValue="engagement" className="mb-4">
          <TabsList>
            <TabsTrigger value="engagement" className="flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              Engagement View
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement" className="mt-4">
            <AccountEngagementList onAccountSelected={handleAccountSelected} />
          </TabsContent>
          
          <TabsContent value="table" className="mt-4">
            <AccountsTable onSelectAccount={handleAccountSelected} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AccountsTabContent;
