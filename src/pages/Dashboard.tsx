
import React from 'react';
import { useHubspot } from "@/context/HubspotContext";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OverviewContent from "@/components/dashboard/OverviewContent";
import UnauthenticatedView from "@/components/dashboard/UnauthenticatedView";
import LeadScoring from "@/components/dashboard/LeadScoring";
import AccountPenetrationAnalysis from "@/components/dashboard/AccountPenetrationAnalysis";
import ContactsTabContent from "@/components/dashboard/ContactsTabContent";

const Dashboard = () => {
  const { isAuthenticated, isConnecting } = useHubspot();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              {isAuthenticated ? (
                <>Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</>
              ) : (
                <>Not connected to HubSpot</>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6">
          {!isAuthenticated ? (
            <UnauthenticatedView />
          ) : (
            <>
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
                  <AccountPenetrationAnalysis />
                </TabsContent>
                
                <TabsContent value="contacts" className="mt-4">
                  <ContactsTabContent />
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
