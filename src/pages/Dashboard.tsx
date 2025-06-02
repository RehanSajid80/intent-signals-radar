import React from 'react';
import Sidebar from "@/components/Sidebar";
import { useHubspot } from "@/context/hubspot";
import SummaryCards from "@/components/dashboard/SummaryCards";
import LeadScoring from "@/components/dashboard/LeadScoring";
import PriorityLeads from "@/components/dashboard/PriorityLeads";
import Notifications from "@/components/dashboard/Notifications";
import AccountEngagementList from "@/components/dashboard/accounts/AccountEngagementList";
import StageConversions from "@/components/dashboard/StageConversions";
import OwnerLifecycleBreakdown from "@/components/dashboard/OwnerLifecycleBreakdown";
import LifecycleStages from "@/components/dashboard/LifecycleStages";
import AccountsTable from "@/components/dashboard/accounts/AccountsTable";
import IntentSignals from "@/components/dashboard/IntentSignals";

const Dashboard = () => {
  const { isAuthenticated } = useHubspot();

  if (!isAuthenticated) {
    return <div>Not authenticated. Please connect to HubSpot in the settings.</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <SummaryCards />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LeadScoring />
          <PriorityLeads />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <IntentSignals />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Notifications />
          <AccountEngagementList />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StageConversions />
          <OwnerLifecycleBreakdown />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <LifecycleStages />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <AccountsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
