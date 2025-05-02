
import React from 'react';
import HubspotConnect from "@/components/hubspot/HubspotConnect";

const ConnectSection: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Connect Your HubSpot Account
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful lead prioritization and intent detection by connecting your HubSpot account.
        </p>
      </div>
      
      <HubspotConnect />
    </div>
  );
};

export default ConnectSection;
