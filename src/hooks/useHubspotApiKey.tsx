
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchApiKeyFromSupabase, saveApiKeyToSupabase } from "@/utils/hubspotApiKeyUtils";
import { testHubspotConnection } from "@/lib/hubspot-api";

type ConnectionStatus = "connected" | "disconnected" | "unknown" | "connecting" | "error";

export function useHubspotApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingKey, setFetchingKey] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("unknown");
  const [connectionError, setConnectionError] = useState<string>("");
  
  const { toast } = useToast();

  useEffect(() => {
    async function loadApiKey() {
      try {
        const storedApiKey = await fetchApiKeyFromSupabase();
        if (storedApiKey) {
          setHasStoredKey(true);
          // If an API key exists, check the connection
          try {
            const isValid = await testHubspotConnection(storedApiKey);
            setConnectionStatus(isValid ? "connected" : "disconnected");
          } catch (error) {
            console.error("Error checking connection on load:", error);
            // If there's a network error, set status to "error" instead of "disconnected"
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
              setConnectionStatus("error");
              setConnectionError("Browser security restrictions may be preventing direct API access.");
            } else {
              setConnectionStatus("disconnected");
            }
          }
        } else {
          setConnectionStatus("disconnected");
        }
      } catch (error) {
        console.error("Error loading API key:", error);
        setConnectionStatus("disconnected");
      } finally {
        setFetchingKey(false);
      }
    }

    loadApiKey();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() && !hasStoredKey) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Only save if there's a new key to save
      if (apiKey.trim()) {
        await saveApiKeyToSupabase(apiKey);
        setHasStoredKey(true);
        toast({
          title: "Success",
          description: "API key saved successfully",
        });
        setApiKey(""); // Clear the input after saving
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setConnectionStatus("connecting");
    setConnectionError("");
    
    try {
      const storedApiKey = await fetchApiKeyFromSupabase();
      if (!storedApiKey) {
        toast({
          title: "Error",
          description: "No API key found. Please save an API key first.",
          variant: "destructive",
        });
        setConnectionStatus("disconnected");
        return;
      }

      const isValid = await testHubspotConnection(storedApiKey);
      
      if (isValid) {
        setConnectionStatus("connected");
        toast({
          title: "Success",
          description: "Successfully connected to HubSpot",
        });
      } else {
        setConnectionStatus("disconnected");
        toast({
          title: "Connection Failed",
          description: "Your HubSpot API key appears to be invalid",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      
      // If this is likely a CORS error, provide a more helpful message
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setConnectionStatus("error");
        setConnectionError("Browser security restrictions may be preventing direct API access. Your API key may still be valid.");
        toast({
          title: "Connection Limited",
          description: "Browser security may prevent direct API access. Your API key may still be valid.",
          variant: "default",
        });
      } else {
        setConnectionStatus("disconnected");
        toast({
          title: "Connection Error",
          description: "Failed to connect to HubSpot",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
