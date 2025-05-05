
import { supabase } from "@/integrations/supabase/client";
import { IntentData } from "../../../types/intentTypes";
import { convertDbRowsToIntentData } from "./dataConverters";

/**
 * Fetch intent data from Supabase
 * @param dateFilter Optional date to filter data by
 * @param weekLabel Optional week label to filter data by
 */
export const fetchSupabaseData = async (dateFilter?: string, weekLabel?: string): Promise<IntentData[]> => {
  try {
    // Use simple query structure to avoid TypeScript recursion issues
    let query = supabase.from('intent_data').select('*');
    
    // Apply filters if provided
    if (dateFilter) {
      query = query.eq('date', dateFilter);
    }
    
    if (weekLabel) {
      query = query.eq('week_label', weekLabel);
    }
    
    // Execute the query
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return convertDbRowsToIntentData(data);
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    
    // Final fallback with simplified query
    try {
      const { data } = await supabase
        .from('intent_data')
        .select('*');
      
      return data ? convertDbRowsToIntentData(data) : [];
    } catch (finalError) {
      console.error("Final fallback query failed:", finalError);
      return [];
    }
  }
};

/**
 * Fetch available weeks from Supabase
 */
export const fetchAvailableWeeks = async (): Promise<string[]> => {
  try {
    // Simplified query that should work without TypeScript recursion issues
    const { data, error } = await supabase
      .from('intent_data')
      .select('week_label');
    
    if (error) {
      console.error("Error fetching weeks:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Use type assertion for week_label to help TypeScript
    const weekLabels = data
      .map(item => (item as any).week_label as string)
      .filter(Boolean);
    
    const uniqueWeeks = [...new Set(weekLabels)];
    return uniqueWeeks.sort().reverse();
  } catch (err) {
    console.error("Error fetching available weeks:", err);
    return [];
  }
};
