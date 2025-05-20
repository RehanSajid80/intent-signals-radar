
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  isAuthenticated: boolean;
  handleRefreshData: () => Promise<void>;
  isRefreshing: boolean;
  refreshAttempts: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isAuthenticated,
  handleRefreshData,
  isRefreshing,
  refreshAttempts
}) => {
  return (
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
            disabled={isRefreshing || refreshAttempts > 3}
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
  );
};

export default DashboardHeader;
