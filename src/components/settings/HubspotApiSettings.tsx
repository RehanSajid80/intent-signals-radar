
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useHubspotApiKey } from "@/hooks/useHubspotApiKey";
import ConnectionStatus from "./hubspot/ConnectionStatus";
import ApiKeyInput from "./hubspot/ApiKeyInput";
import ActionButtons from "./hubspot/ActionButtons";

const HubspotApiSettings = () => {
  const {
    apiKey,
    loading,
    fetchingKey,
    showKey,
    connectionStatus,
    hasStoredKey,
    handleSaveApiKey,
    handleTestConnection,
    handleInputChange,
    toggleShowKey
  } = useHubspotApiKey();

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
          <ConnectionStatus status={connectionStatus} />
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
              onSaveApiKey={handleSaveApiKey}
              onTestConnection={handleTestConnection}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
