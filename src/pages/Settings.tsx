import React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useHubspot } from "@/context/hubspot";
import HubspotApiSettings from "@/components/settings/HubspotApiSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import ScoringSettings from "@/components/settings/ScoringSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const { isAuthenticated } = useHubspot();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Remove this check to allow settings page to be accessed without authentication
    // This way we can set the API key before connecting
    /* 
    if (!isAuthenticated) {
      navigate("/");
    }
    */
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-6">
          {/* Security notice */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-700">Enhanced Security</AlertTitle>
            <AlertDescription className="text-blue-600">
              Your API keys are now securely stored in the database and masked in the UI for security. 
              We follow best practices to protect your sensitive data.
            </AlertDescription>
          </Alert>
          
          {/* Highlight the HubSpot API settings card at the top */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">HubSpot Integration</h2>
            <HubspotApiSettings />
          </div>
          
          <Tabs defaultValue="integrations">
            <TabsList className="mb-6">
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Model</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrations">
              <IntegrationSettings />
            </TabsContent>
            
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="scoring">
              <ScoringSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
