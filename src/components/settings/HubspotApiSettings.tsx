import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHubspot } from "@/context/hubspot";

const HubspotApiSettings = () => {
  const { apiKey, setApiKey, isAuthenticated, testHubspotConnection, refreshData } = useHubspot();
  const [newApiKey, setNewApiKey] = useState(apiKey || "");
  const [isTesting, setIsTesting] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewApiKey(e.target.value);
  };

  const handleSaveApiKey = async () => {
    setIsTesting(true);
    try {
      const isValid = await testHubspotConnection(newApiKey);
      if (isValid) {
        setApiKey(newApiKey);
        localStorage.setItem("hubspotApiKey", newApiKey);
        await refreshData();
        alert("API Key saved and connection is valid!");
      } else {
        alert("Invalid API Key. Please check your key and try again.");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      alert("Failed to test connection. Please check your API key and try again.");
    } finally {
      setIsTesting(false);
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
          />
        </div>
        <Button onClick={handleSaveApiKey} disabled={isTesting}>
          {isTesting ? "Testing Connection..." : "Save API Key"}
        </Button>
        {isAuthenticated ? (
          <p className="text-sm text-green-500">
            Connected to HubSpot!
          </p>
        ) : (
          <p className="text-sm text-red-500">
            Not connected to HubSpot. Please provide a valid API key.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
