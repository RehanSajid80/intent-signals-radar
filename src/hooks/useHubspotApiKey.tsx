
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useHubspot } from "@/context/HubspotContext";
import { fetchApiKeyFromSupabase, saveApiKeyToSupabase } from "@/utils/hubspotApiKeyUtils";
import { testHubspotConnection } from "@/lib/hubspot-api";

export function useHubspotApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingKey, setFetchingKey] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const { toast } = useToast();
  const { refreshData, isAuthenticated } = useHubspot();

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

  return {
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
  };
}
