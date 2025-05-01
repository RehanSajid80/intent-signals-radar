
import React from 'react';
import ContactBreakdown from "@/components/dashboard/ContactBreakdown";
import LifecycleBreakdown from "@/components/dashboard/LifecycleBreakdown";
import LeadIntentBreakdown from "@/components/dashboard/LeadIntentBreakdown";
import ContactOwnerDistribution from "@/components/dashboard/ContactOwnerDistribution";
import LifecycleStages from "@/components/dashboard/LifecycleStages";
import EngagementByOwner from "@/components/dashboard/EngagementByOwner";
import OwnerLifecycleBreakdown from "@/components/dashboard/OwnerLifecycleBreakdown";
import JobTitleAnalysis from "@/components/dashboard/JobTitleAnalysis";
import ContactsList from "@/components/dashboard/ContactsList";
import IntentUpload from "@/components/dashboard/IntentUpload";

const ContactsTabContent = () => {
  return (
    <>
      <IntentUpload />
      
      <div className="space-y-4 mb-4">
        <ContactBreakdown />
        <LifecycleBreakdown />
        <LeadIntentBreakdown />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ContactOwnerDistribution />
        <LifecycleStages />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <EngagementByOwner />
        <OwnerLifecycleBreakdown />
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <JobTitleAnalysis />
      </div>
      
      <ContactsList />
    </>
  );
};

export default ContactsTabContent;
