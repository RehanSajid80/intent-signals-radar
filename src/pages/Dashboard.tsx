
import React, { useState, useEffect, useCallback } from 'react';
import { useHubspot } from "@/context/hubspot";
import Sidebar from "@/components/Sidebar";
import UnauthenticatedView from "@/components/dashboard/UnauthenticatedView";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { isAuthenticated, refreshData, contacts } = useHubspot();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [pauseApiCalls, setPauseApiCalls] = useState(false);
  const { toast } = useToast();
  
  const togglePauseApiCalls = useCallback(() => {
    const newValue = !pauseApiCalls;
    setPauseApiCalls(newValue);
    localStorage.setItem('hubspot_pause_api_calls', newValue.toString());
    
    toast({
      title: newValue ? "API Calls Paused" : "API Calls Resumed",
      description: newValue 
        ? "All HubSpot API calls have been paused to reduce network requests." 
        : "HubSpot API calls have been resumed."
    });
  }, [pauseApiCalls, toast]);
  
  // Load pause setting from localStorage on mount
  useEffect(() => {
    const savedPauseSetting = localStorage.getItem('hubspot_pause_api_calls');
    if (savedPauseSetting) {
      setPauseApiCalls(savedPauseSetting === 'true');
    }
  }, []);
  
  // Check if we might be experiencing CORS issues
  useEffect(() => {
    // Only check for CORS issues if we've attempted to fetch data
    if (isAuthenticated && contacts.length === 0 && hasAttemptedFetch) {
      setCorsError(true);
    } else if (contacts.length > 0) {
      setCorsError(false);
    }
  }, [isAuthenticated, contacts, hasAttemptedFetch]);
  
  const handleRefreshData = useCallback(async () => {
    // Always check if API calls are paused FIRST
    if (pauseApiCalls) {
      toast({
        title: "API Calls Paused",
        description: "API calls are currently paused. Please unpause to refresh data.",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Not connected",
        description: "Please connect to HubSpot in Settings before refreshing data.",
        variant: "destructive"
      });
      return;
    }
    
    // Limit refresh attempts to prevent spamming API calls
    setRefreshAttempts(prev => prev + 1);
    if (refreshAttempts > 3) {
      toast({
        title: "Too many refresh attempts",
        description: "Please wait a moment before trying again.",
        variant: "default"
      });
      return;
    }
    
    setIsRefreshing(true);
    setHasAttemptedFetch(true);
    
    try {
      await refreshData();
      toast({
        title: "Data refreshed",
        description: "HubSpot data has been successfully refreshed."
      });
      // Reset refresh attempts on success
      setRefreshAttempts(0);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setCorsError(true);
      
      // Only show error toast on first attempt
      if (refreshAttempts <= 1) {
        toast({
          title: "Refresh failed",
          description: "There was a problem refreshing your HubSpot data.",
          variant: "destructive"
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated, refreshData, toast, refreshAttempts, pauseApiCalls]);
  
  // Attempt to fetch data once on initial mount if authenticated - but only if API calls aren't paused
  useEffect(() => {
    // Only attempt a fetch if we haven't tried yet, we're authenticated, not currently refreshing, and API calls aren't paused
    if (isAuthenticated && !hasAttemptedFetch && !isRefreshing && !pauseApiCalls) {
      // Mark that we've attempted a fetch to prevent multiple attempts
      setHasAttemptedFetch(true);
      handleRefreshData();
    }
  }, [isAuthenticated, hasAttemptedFetch, isRefreshing, handleRefreshData, pauseApiCalls]);
  
  const enableDemoData = useCallback(() => {
    toast({
      title: "Demo data enabled",
      description: "Sample data is now being displayed for demonstration purposes."
    });
    // This will be handled by useHubspotDemoData hook in context
    localStorage.setItem('hubspot_use_demo_data', 'true');
    window.location.reload(); // Refresh to apply changes
  }, [toast]);
  
  // Reset refresh attempts periodically
  useEffect(() => {
    if (refreshAttempts > 0) {
      const timer = setTimeout(() => {
        setRefreshAttempts(0);
      }, 60000); // Reset after 1 minute
      
      return () => clearTimeout(timer);
    }
  }, [refreshAttempts]);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <DashboardHeader 
          isAuthenticated={isAuthenticated}
          handleRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          refreshAttempts={refreshAttempts}
          pauseApiCalls={pauseApiCalls}
          togglePauseApiCalls={togglePauseApiCalls}
        />
        
        <main className="p-4 md:p-6">
          {!isAuthenticated ? (
            <UnauthenticatedView />
          ) : (
            <DashboardContent 
              corsError={corsError}
              enableDemoData={enableDemoData}
              pauseApiCalls={pauseApiCalls}
              togglePauseApiCalls={togglePauseApiCalls}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
