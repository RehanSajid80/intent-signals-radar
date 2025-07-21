
import React from 'react';
import Sidebar from "@/components/Sidebar";
import { useHubspot } from "@/context/hubspot";
import GTMIntelligenceDashboard from "@/components/dashboard/gtm/GTMIntelligenceDashboard";
import UnauthenticatedView from "@/components/dashboard/UnauthenticatedView";

const Dashboard = () => {
  const { isAuthenticated } = useHubspot();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-4">
        {isAuthenticated ? (
          <GTMIntelligenceDashboard />
        ) : (
          <UnauthenticatedView />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
