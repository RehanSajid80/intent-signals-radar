
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, LogOut } from "lucide-react";
import { useHubspotApiKey } from "@/hooks/useHubspotApiKey";
import { useHubspot } from "@/context/hubspot";
import ConnectionStatus from "./hubspot/ConnectionStatus";
import ApiKeyInput from "./hubspot/ApiKeyInput";
import ActionButtons from "./hubspot/ActionButtons";
import ConnectionHelp from "./hubspot/ConnectionHelp";
import { Button } from "@/components/ui/button";

const HubspotApiSettings = () => {
  const {
    apiKey,
    loading,
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

  const handleRefreshData = async () => {
    await refreshData();
  };

  const handleDisconnect = async () => {
    await disconnectFromHubspot();
  };

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
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect from HubSpot
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
