
import React from 'react';
import Sidebar from "@/components/Sidebar";
import GTMIntelligenceDashboard from "@/components/dashboard/gtm/GTMIntelligenceDashboard";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-4">
        <GTMIntelligenceDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
