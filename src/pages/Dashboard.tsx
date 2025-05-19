
import React, { useState } from 'react';
import { useHubspot } from "@/context/HubspotContext";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OverviewContent from "@/components/dashboard/OverviewContent";
import UnauthenticatedView from "@/components/dashboard/UnauthenticatedView";
import LeadScoring from "@/components/dashboard/LeadScoring";
import AccountsTabContent from "@/components/dashboard/AccountsTabContent";
import ContactsTabContent from "@/components/dashboard/ContactsTabContent";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { isAuthenticated, refreshData } = useHubspot();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleRefreshData = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Not connected",
        description: "Please connect to HubSpot in Settings before refreshing data.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRefreshing(true);
    try {
      await refreshData();
      toast({
        title: "Data refreshed",
        description: "HubSpot data has been successfully refreshed."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your HubSpot data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.zyter.com/wp-content/uploads/2023/04/ZTC_LOGO_FINAL1.png" 
                alt="Zyter Logo" 
                className="h-8 md:h-10" 
              />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh HubSpot Data'}
              </Button>
              <div className="text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</>
                ) : (
                  <>Not connected to HubSpot</>
                )}
              </div>
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
                  <AccountsTabContent />
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
