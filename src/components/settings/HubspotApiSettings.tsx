
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHubspot } from "@/context/HubspotContext";
import { testHubspotConnection } from "@/lib/hubspot-api";

const HubspotApiSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();
  const { refreshData } = useHubspot();

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedKey = localStorage.getItem("hubspot_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

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
      // Actually test the connection with the API key
      const isValid = await testHubspotConnection(apiKey);
      
      if (isValid) {
        // Store API key in localStorage
        localStorage.setItem("hubspot_api_key", apiKey);
        
        toast({
          title: "API Key Saved",
          description: "Your HubSpot API key has been saved and validated successfully.",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "The API key could not be validated with HubSpot. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      toast({
        title: "Validation Error",
        description: "An error occurred while validating your API key. Please try again.",
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
      toast({
        title: "Connection Successful",
        description: "Successfully connected to HubSpot API and retrieved data.",
      });
    } catch (error) {
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
        <CardTitle className="text-blue-700">HubSpot API Connection</CardTitle>
        <CardDescription>
          Configure your HubSpot API connection to sync your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
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
            className="bg-blue-600 hover:bg-blue-700"
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
