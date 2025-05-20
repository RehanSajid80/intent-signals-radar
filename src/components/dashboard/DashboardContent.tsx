
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OverviewContent from "@/components/dashboard/OverviewContent";
import LeadScoring from "@/components/dashboard/LeadScoring";
import AccountsTabContent from "@/components/dashboard/AccountsTabContent";
import ContactsTabContent from "@/components/dashboard/ContactsTabContent";
import CorsErrorAlert from "@/components/dashboard/CorsErrorAlert";

interface DashboardContentProps {
  corsError: boolean;
  enableDemoData: () => void;
  pauseApiCalls: boolean;
  togglePauseApiCalls: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  corsError,
  enableDemoData,
  pauseApiCalls,
  togglePauseApiCalls
}) => {
  return (
    <>
      {corsError && (
        <CorsErrorAlert 
          enableDemoData={enableDemoData} 
          pauseApiCalls={pauseApiCalls}
          togglePauseApiCalls={togglePauseApiCalls}
        />
      )}
      
      <SummaryCards />
      
      <Tabs defaultValue="overview" className="mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <OverviewContent />
        </TabsContent>
        
        <TabsContent value="leads" className="mt-4">
          <LeadScoring />
        </TabsContent>
        
        <TabsContent value="accounts" className="mt-4">
          <AccountsTabContent />
        </TabsContent>
        
        <TabsContent value="contacts" className="mt-4">
          <ContactsTabContent />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardContent;
