
import { supabase } from "@/integrations/supabase/client";

export const fetchApiKeyFromSupabase = async (): Promise<string> => {
  try {
    // Try to get API key from Supabase first
    const { data, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'hubspot')
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching HubSpot API key from Supabase:", error);
      // Fall back to localStorage
      return localStorage.getItem("hubspot_api_key") || "";
    }
    
    return data?.api_key || "";
  } catch (error) {
    console.error("Error in fetchApiKeyFromSupabase:", error);
    return localStorage.getItem("hubspot_api_key") || "";
  }
};

export const saveApiKeyToSupabase = async (key: string): Promise<boolean> => {
  try {
    // Check if we have an existing record
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('service', 'hubspot')
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
      console.error("Error checking for existing API key:", error);
      return false;
    }
    
    let result;
    
    if (data?.id) {
      // Update existing record
      result = await supabase
        .from('api_keys')
        .update({ api_key: key, updated_at: new Date().toISOString() })
        .eq('id', data.id);
    } else {
      // Insert new record
      result = await supabase
        .from('api_keys')
        .insert([{ service: 'hubspot', api_key: key }]);
    }
    
    if (result.error) {
      console.error("Error saving API key to Supabase:", result.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveApiKeyToSupabase:", error);
    return false;
  }
};
