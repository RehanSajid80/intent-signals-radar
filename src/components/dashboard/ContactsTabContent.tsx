
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users } from "lucide-react";

const ContactsTabContent = () => {
  return (
    <>
      <Tabs defaultValue="contacts" className="mb-4">
        <TabsList>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Contact Data
          </TabsTrigger>
          <TabsTrigger value="intent" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Intent Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="intent" className="mt-4">
          <IntentUpload />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ContactsTabContent;
