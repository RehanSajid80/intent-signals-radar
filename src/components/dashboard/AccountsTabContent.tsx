
import React, { useState } from 'react';
import AccountEngagementList from "@/components/dashboard/accounts/AccountEngagementList";
import ContactRoleMapping from "@/components/dashboard/accounts/ContactRoleMapping";
import { useHubspot } from "@/context/HubspotContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
        <AccountEngagementList />
      )}
    </div>
  );
};

export default AccountsTabContent;
