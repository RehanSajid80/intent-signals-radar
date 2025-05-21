
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, LogOut, WifiOff } from "lucide-react";
import { useHubspotApiKey } from "@/hooks/useHubspotApiKey";
import { useHubspot } from "@/context/hubspot";
import ConnectionStatus from "./hubspot/ConnectionStatus";
import ApiKeyInput from "./hubspot/ApiKeyInput";
import ActionButtons from "./hubspot/ActionButtons";
import ConnectionHelp from "./hubspot/ConnectionHelp";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const HubspotApiSettings = () => {
  const {
    apiKey,
    loading: apiKeyLoading,
    fetchingKey,
    showKey,
    connectionStatus,
    connectionError,
    hasStoredKey,
    handleSaveApiKey,
    handleTestConnection,
    handleInputChange,
    toggleShowKey
  } = useHubspotApiKey();
  
  const { 
    isAuthenticated, 
    refreshData, 
    disconnectFromHubspot 
  } = useHubspot();

  const [disconnecting, setDisconnecting] = useState(false);
  const [apiCallsPaused, setApiCallsPaused] = useState(false);
  
  // Load pause setting from localStorage on mount
  useEffect(() => {
    const savedPauseSetting = localStorage.getItem('hubspot_pause_api_calls');
    if (savedPauseSetting) {
      setApiCallsPaused(savedPauseSetting === 'true');
    }
  }, []);
  
  // Toggle API calls pause setting
  const toggleApiCallsPause = () => {
    const newValue = !apiCallsPaused;
    setApiCallsPaused(newValue);
    localStorage.setItem('hubspot_pause_api_calls', newValue.toString());
  };
  
  const handleRefreshData = async () => {
    await refreshData();
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await disconnectFromHubspot();
    } finally {
      setDisconnecting(false);
    }
  };

  const loading = apiKeyLoading || disconnecting;

  return (
    <Card className="border-2 border-blue-200 shadow-md">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-700">HubSpot API Connection</CardTitle>
            <CardDescription>
              Configure your HubSpot API connection to sync your data
            </CardDescription>
          </div>
          <ConnectionStatus 
            status={connectionStatus} 
            errorMessage={connectionError}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {fetchingKey ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* API Calls Pause Switch - New prominent section at the top */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-amber-800 flex items-center">
                    <WifiOff className="h-4 w-4 mr-2" />
                    API Connection Control
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    {apiCallsPaused 
                      ? "API calls are currently paused. No data will be fetched from HubSpot." 
                      : "API calls are active. The application will try to fetch data from HubSpot."}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="api-pause-switch"
                    checked={apiCallsPaused}
                    onCheckedChange={toggleApiCallsPause}
                  />
                  <Label htmlFor="api-pause-switch" className="font-medium cursor-pointer">
                    {apiCallsPaused ? "Resume API Calls" : "Pause API Calls"}
                  </Label>
                </div>
              </div>
              {apiCallsPaused && (
                <p className="text-xs text-amber-600 mt-2">
                  Tip: Use this when experiencing connection issues to prevent repeated error messages.
                </p>
              )}
            </div>

            {connectionStatus === "connected" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Your HubSpot API connection is active and working properly. Your API key is securely stored.
                </AlertDescription>
              </Alert>
            )}
            
            {connectionStatus === "error" && <ConnectionHelp />}
            
            <ApiKeyInput
              apiKey={apiKey}
              showKey={showKey}
              hasStoredKey={hasStoredKey}
              onInputChange={handleInputChange}
              onToggleShowKey={toggleShowKey}
            />

            <ActionButtons
              loading={loading}
              hasStoredKey={hasStoredKey}
              isConnected={connectionStatus === "connected"}
              onSaveApiKey={handleSaveApiKey}
              onTestConnection={handleTestConnection}
              onRefreshData={handleRefreshData}
              onDisconnect={handleDisconnect}
              apiCallsPaused={apiCallsPaused}
            />

            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-3">Disconnect from HubSpot</h3>
                <p className="text-muted-foreground mb-4">
                  This will remove your HubSpot connection and clear all synced data from this application.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2"
                >
                  {disconnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Disconnect from HubSpot
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
