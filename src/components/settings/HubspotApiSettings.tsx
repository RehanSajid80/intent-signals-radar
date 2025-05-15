
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHubspot } from "@/context/HubspotContext";
import { testHubspotConnection } from "@/lib/hubspot-api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HubspotApiSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const { toast } = useToast();
  const { refreshData, isAuthenticated } = useHubspot();

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedKey = localStorage.getItem("hubspot_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      // Check connection status when component mounts
      checkConnectionStatus(savedKey);
    }
  }, []);

  // Update connection status based on HubSpot context
  useEffect(() => {
    if (isAuthenticated) {
      setConnectionStatus("connected");
    }
  }, [isAuthenticated]);

  const checkConnectionStatus = async (key: string) => {
    try {
      const isValid = await testHubspotConnection(key);
      setConnectionStatus(isValid ? "connected" : "disconnected");
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnectionStatus("disconnected");
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
      // Store API key in localStorage regardless of validation
      // This allows users to save the key even if HubSpot API is temporarily unavailable
      localStorage.setItem("hubspot_api_key", apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your HubSpot API key has been saved. You can now try connecting to HubSpot.",
      });
      
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
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        setConnectionStatus("disconnected");
        toast({
          title: "Validation Notice",
          description: "API key saved, but we couldn't validate it with HubSpot. You can still try connecting from the dashboard.",
          variant: "default",
        });
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
      await refreshData();
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
        {connectionStatus === "connected" && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Your HubSpot API connection is active and working properly.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-base font-medium">API Key</Label>
          <div className="flex">
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type={showKey ? "text" : "password"}
              placeholder="Enter your HubSpot API key"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowKey(!showKey)}
              className="ml-2"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Your API key will be stored locally in your browser.
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
            disabled={loading || !apiKey}
          >
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HubspotApiSettings;
