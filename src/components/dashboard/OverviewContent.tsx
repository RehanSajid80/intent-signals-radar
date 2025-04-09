
import React from 'react';
import AccountPenetration from "@/components/dashboard/account-penetration/AccountPenetration";
import LifecycleStageBreakdown from "@/components/dashboard/LifecycleStageBreakdown";
import IntentSignals from "@/components/dashboard/IntentSignals";
import PriorityLeads from "@/components/dashboard/PriorityLeads";
import Notifications from "@/components/dashboard/Notifications";

const OverviewContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <AccountPenetration className="w-full" />
        <LifecycleStageBreakdown />
        <IntentSignals />
      </div>
      <div className="space-y-3">
        <PriorityLeads />
        <Notifications />
      </div>
    </div>
  );
};

export default OverviewContent;
