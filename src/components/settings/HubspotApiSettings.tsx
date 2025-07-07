
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHubspot } from "@/context/hubspot";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { AlertTriangle, CheckCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const HubspotApiSettings = () => {
  const { isAuthenticated, testHubspotConnection, refreshData } = useHubspot();
  const [newApiKey, setNewApiKey] = useState("");
  const { error, isLoading, handleAsync, clearError } = useErrorHandler();

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewApiKey(e.target.value);
    clearError();
  };

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) {
      return;
    }

    const result = await handleAsync(async () => {
      const isValid = await testHubspotConnection(newApiKey);
      if (isValid) {
        localStorage.setItem("hubspotApiKey", newApiKey);
        await refreshData();
        setNewApiKey("");
        return true;
      } else {
        throw new Error("Invalid API Key. Please check your key and try again.");
      }
    });

    if (result) {
      // Success handled by the success state
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HubSpot API Settings</CardTitle>
        <CardDescription>
          Configure your HubSpot API key to connect your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hubspot-api-key">HubSpot API Key</Label>
          <Input
            id="hubspot-api-key"
            type="password"
            value={newApiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your HubSpot API key"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSaveApiKey} 
          disabled={isLoading || !newApiKey.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Testing Connection...
            </>
          ) : (
            "Save API Key"
          )}
        </Button>
        
        {isAuthenticated ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-600">
              Connected to HubSpot successfully!
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Not connected to HubSpot. Please provide a valid API key.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
