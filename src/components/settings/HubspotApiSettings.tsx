import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, RefreshCw, CheckCircle, XCircle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHubspot } from "@/context/HubspotContext";
import { testHubspotConnection } from "@/lib/hubspot-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { fetchApiKeyFromSupabase, saveApiKeyToSupabase } from "@/utils/hubspotApiKeyUtils";

const HubspotApiSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingKey, setFetchingKey] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const { toast } = useToast();
  const { refreshData, isAuthenticated } = useHubspot();
  const [hasStoredKey, setHasStoredKey] = useState(false);

  // Load API key status from Supabase on component mount
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      try {
        setFetchingKey(true);
        
        // Check if we have an API key stored in Supabase
        const apiKey = await fetchApiKeyFromSupabase();
        
        if (apiKey) {
          setApiKey("••••••••••••••••••••"); // Masked key
          setHasStoredKey(true);
          checkConnectionStatus(apiKey);
        } else {
          setHasStoredKey(false);
        }
      } catch (error) {
        console.error("Error in checkApiKeyStatus:", error);
      } finally {
        setFetchingKey(false);
      }
    };
    
    checkApiKeyStatus();
  }, []);

  // Update connection status based on HubSpot context
  useEffect(() => {
    if (isAuthenticated) {
      setConnectionStatus("connected");
    }
  }, [isAuthenticated]);

  const checkConnectionStatus = async (key: string) => {
    if (!key) return;
    
    try {
      const isValid = await testHubspotConnection(key);
      setConnectionStatus(isValid ? "connected" : "disconnected");
      
      if (isValid) {
        console.log("API key validation successful");
      } else {
        console.log("API key validation failed");
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      // Don't immediately set to disconnected for network errors
      // since they might be CORS related
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        setConnectionStatus("disconnected");
      }
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // First, save to Supabase
      const savedToSupabase = await saveApiKeyToSupabase(apiKey);
      
      // Always save to localStorage as backup
      localStorage.setItem("hubspot_api_key", apiKey);
      
      // Show appropriate toast based on whether Supabase save was successful
      if (savedToSupabase) {
        toast({
          title: "API Key Saved",
          description: "Your HubSpot API key has been securely saved to the database.",
        });
        
        setHasStoredKey(true);
        // Mask the displayed key after saving
        setApiKey("••••••••••••••••••••");
        setShowKey(false);
      } else {
        toast({
          title: "API Key Saved Locally",
          description: "Your HubSpot API key has been saved locally. Database storage failed.",
        });
      }
      
      // Try to validate the key but don't block saving if it fails
      try {
        const isValid = await testHubspotConnection(apiKey);
        
        if (isValid) {
          setConnectionStatus("connected");
          toast({
            title: "API Key Validated",
            description: "Your HubSpot API key was successfully validated with HubSpot.",
          });
        } else {
          setConnectionStatus("disconnected");
          toast({
            title: "API Key Warning",
            description: "Your API key was saved, but couldn't be validated with HubSpot.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        
        // Special handling for network/CORS errors
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          toast({
            title: "API Key Saved",
            description: "API key saved. Validation limited due to browser security restrictions.",
            variant: "default",
          });
        } else {
          setConnectionStatus("disconnected");
          toast({
            title: "Validation Notice",
            description: "API key saved, but we couldn't validate it with HubSpot. You can still try connecting from the dashboard.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await refreshData();
      setConnectionStatus("connected");
      toast({
        title: "Connection Successful",
        description: "Successfully connected to HubSpot API and retrieved data.",
      });
    } catch (error) {
      setConnectionStatus("disconnected");
      toast({
        title: "Connection Failed",
        description: "Failed to connect to HubSpot API. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow direct editing if we don't have a stored key or if showKey is true
    if (!hasStoredKey || showKey) {
      setApiKey(e.target.value);
    }
  };

  const toggleShowKey = async () => {
    if (showKey) {
      // When hiding the key, if we have a stored key, mask it
      if (hasStoredKey) {
        setApiKey("••••••••••••••••••••");
      }
      setShowKey(false);
    } else {
      // When showing the key, if we have a stored key, load it from storage
      if (hasStoredKey) {
        try {
          const key = await fetchApiKeyFromSupabase();
          setApiKey(key);
        } catch (error) {
          console.error("Error retrieving API key:", error);
        }
      }
      setShowKey(true);
    }
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
          {connectionStatus !== "unknown" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
              {connectionStatus === "connected" ? (
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <XCircle className="h-4 w-4" />
                  <span>Disconnected</span>
                </div>
              )}
            </div>
          )}
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
            
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-base font-medium">API Key</Label>
              <div className="flex">
                <div className="relative flex-1">
                  <Input
                    id="api-key"
                    value={apiKey}
                    onChange={handleInputChange}
                    type={showKey ? "text" : "password"}
                    placeholder={hasStoredKey ? "API key stored securely" : "Enter your HubSpot API key"}
                    className="flex-1 pr-10"
                  />
                  {hasStoredKey && !showKey && (
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleShowKey}
                  className="ml-2"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your API key will be securely stored in the database and masked for security.
              </p>
              <p className="text-sm text-muted-foreground">
                <a 
                  href="https://app.hubspot.com/api-key"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get your HubSpot API key here
                </a>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSaveApiKey} 
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save API Key
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={loading || !hasStoredKey}
              >
                Test Connection
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
