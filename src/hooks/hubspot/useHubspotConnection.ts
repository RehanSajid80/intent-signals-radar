
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchApiKeyFromSupabase, saveApiKeyToSupabase } from "@/utils/hubspotApiKeyUtils";
import { testHubspotConnection } from "@/lib/hubspot-api";
import { supabase } from "@/integrations/supabase/client";

export const useHubspotConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [hasShownSyncToast, setHasShownSyncToast] = useState(false);

  const connectToHubspot = async () => {
    // Reset toast state when connecting
    setHasShownSyncToast(false);
    
    // Get the API key securely
    const apiKey = await fetchApiKeyFromSupabase();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your HubSpot API key in Settings first.",
        variant: "destructive",
      });
      return null;
    }
    
    setIsConnecting(true);
    
    // Test the API key by making an actual API request
    try {
      const isValid = await testHubspotConnection(apiKey);
      
      if (isValid) {
        toast({
          title: "Connected to HubSpot",
          description: "Your API key is valid. Fetching data...",
        });
        
        return true;
      } else {
        toast({
          title: "Connection Failed",
          description: "Your HubSpot API key appears to be invalid.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return null;
      }
    } catch (error) {
      console.error("Error connecting to HubSpot:", error);
      
      // Improved error messages based on error type
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Connection Limited",
          description: "Browser security may prevent direct API access. Try checking your API key in the HubSpot portal.",
          variant: "default",
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to HubSpot API. Please check your API key and try again.",
          variant: "destructive",
        });
      }
      
      setIsConnecting(false);
      return null;
    }
  };

  const disconnectFromHubspot = async (): Promise<void> => {
    try {
      // Clear API key from Supabase
      const { error } = await supabase
        .from('api_keys')
        .update({ api_key: null })
        .eq('service', 'hubspot');
        
      if (error) {
        console.error("Error clearing API key from Supabase:", error);
      }
      
      // Also clear from localStorage
      localStorage.removeItem("hubspot_api_key");
      
      // Reset toast state on disconnect
      setHasShownSyncToast(false);
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from HubSpot API.",
      });
    } catch (error) {
      console.error("Error disconnecting from HubSpot:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from HubSpot API.",
        variant: "destructive",
      });
    }
  };

  return {
    isConnecting,
    error,
    connectToHubspot,
    disconnectFromHubspot,
    hasShownSyncToast,
    setHasShownSyncToast
  };
};
