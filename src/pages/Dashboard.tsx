import React, { useState, useEffect } from 'react';
import { useHubspot } from "@/context/hubspot";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import OverviewContent from "@/components/dashboard/OverviewContent";
import UnauthenticatedView from "@/components/dashboard/UnauthenticatedView";
import LeadScoring from "@/components/dashboard/LeadScoring";
import AccountsTabContent from "@/components/dashboard/AccountsTabContent";
import ContactsTabContent from "@/components/dashboard/ContactsTabContent";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ConnectionHelp from "@/components/settings/hubspot/ConnectionHelp";

const Dashboard = () => {
  const { isAuthenticated, refreshData, contacts } = useHubspot();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const { toast } = useToast();
  
  // Check if we might be experiencing CORS issues
  useEffect(() => {
    // If authenticated but no data, might be CORS
    if (isAuthenticated && contacts.length === 0) {
      setCorsError(true);
    } else {
      setCorsError(false);
    }
  }, [isAuthenticated, contacts]);
  
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
      setCorsError(true);
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your HubSpot data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const enableDemoData = () => {
    toast({
      title: "Demo data enabled",
      description: "Sample data is now being displayed for demonstration purposes."
    });
    // This will be handled by useHubspotDemoData hook in context
    localStorage.setItem('hubspot_use_demo_data', 'true');
    window.location.reload(); // Refresh to apply changes
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
              {corsError && (
                <div className="space-y-4 mb-6">
                  <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <AlertTitle className="text-amber-800">Data Connection Issue</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <p className="mb-2">
                        We're having trouble retrieving your HubSpot data due to browser security limitations (CORS).
                        Your API key may still be valid, but direct access is restricted in the browser.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800"
                          onClick={enableDemoData}
                        >
                          Show Sample Data
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <ConnectionHelp />
                </div>
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
