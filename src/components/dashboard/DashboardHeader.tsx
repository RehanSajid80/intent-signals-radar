
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DashboardHeaderProps {
  isAuthenticated: boolean;
  handleRefreshData: () => Promise<void>;
  isRefreshing: boolean;
  refreshAttempts: number;
  pauseApiCalls?: boolean;
  togglePauseApiCalls?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isAuthenticated,
  handleRefreshData,
  isRefreshing,
  refreshAttempts,
  pauseApiCalls = false,
  togglePauseApiCalls
}) => {
  // Get current date/time for last updated display
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the time display when refreshing completes
  useEffect(() => {
    if (!isRefreshing) {
      setCurrentTime(new Date());
    }
  }, [isRefreshing]);

  return (
    <header className="border-b bg-card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img 
            src="https://www.zyter.com/wp-content/uploads/2023/04/ZTC_LOGO_FINAL1.png" 
            alt="Zyter Logo" 
            className="h-8 md:h-10" 
          />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-3">
            {togglePauseApiCalls && (
              <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                <Switch
                  id="dashboard-pause-api"
                  checked={pauseApiCalls}
                  onCheckedChange={togglePauseApiCalls}
                  className="data-[state=checked]:bg-amber-500"
                />
                <Label htmlFor="dashboard-pause-api" className={`text-sm cursor-pointer flex items-center ${pauseApiCalls ? 'text-amber-700' : 'text-amber-600'}`}>
                  <WifiOff className={`h-4 w-4 mr-1.5 ${pauseApiCalls ? 'text-amber-600' : 'text-amber-400'}`} />
                  {pauseApiCalls ? 'API calls paused' : 'Pause API calls'}
                </Label>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshData}
              disabled={isRefreshing || refreshAttempts > 3 || pauseApiCalls}
              className="flex items-center gap-1"
            >
              {pauseApiCalls ? (
                <>
                  <WifiOff className="h-4 w-4 text-amber-500" />
                  API Calls Paused
                </>
              ) : (
                <>
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh HubSpot Data'}
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {isAuthenticated ? (
              <>Last updated: {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</>
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
