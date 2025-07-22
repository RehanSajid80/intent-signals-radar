import React from 'react';
import Sidebar from "@/components/Sidebar";
import AccountsTabContent from "@/components/dashboard/AccountsTabContent";

const Accounts = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze your account portfolio with intent signals and engagement insights.
            </p>
          </div>
          <AccountsTabContent />
        </div>
      </div>
    </div>
  );
};

export default Accounts;