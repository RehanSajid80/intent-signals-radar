
import React from 'react';
import { useHubspot } from "@/context/HubspotContext";
import DataCard from "@/components/ui/DataCard";

const SummaryCards = () => {
  const { isAuthenticated, contacts, accounts } = useHubspot();
  
  const highPriorityCount = isAuthenticated ? contacts.filter(c => c.priorityLevel === "high").length : 0;
  const highPriorityPercent = isAuthenticated && contacts.length > 0 
    ? Math.round((highPriorityCount / contacts.length) * 100) 
    : 0;
  
  const activeDealsCount = isAuthenticated ? accounts.reduce((sum, account) => sum + account.activeDeals, 0) : 0;
  const averagePenetration = isAuthenticated && accounts.length > 0
    ? Math.round(accounts.reduce((sum, account) => sum + account.penetrationScore, 0) / accounts.length)
    : 0;
    
  const recentSignalsCount = isAuthenticated ? contacts.flatMap(c => 
    c.intentSignals.filter(s => 
      new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
  ).length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <DataCard
        title="High Priority Leads"
        value={highPriorityCount}
        description={`${highPriorityPercent}% of total contacts`}
        icon="chart"
        trend={5}
      />
      <DataCard
        title="Active Deals"
        value={activeDealsCount}
        description="Across all accounts"
        icon="activity"
        trend={3}
      />
      <DataCard
        title="Avg. Account Penetration"
        value={`${averagePenetration}%`}
        description="Opportunity score"
        icon="trending-up"
        trend={2}
      />
      <DataCard
        title="Recent Intent Signals"
        value={recentSignalsCount}
        description="Last 7 days"
        icon="trending-up"
        trend={12}
      />
    </div>
  );
};

export default SummaryCards;
