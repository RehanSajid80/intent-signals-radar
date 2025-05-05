
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
    // Use specific column selection to avoid TypeScript recursion issues
    let query = supabase.from('intent_data').select('id, date, company_name, topic, category, score, website, secondary_industry_hierarchical_category, alexa_rank, employees, week_label');
    
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
      // Use specific column selection to avoid TypeScript recursion
      const { data } = await supabase
        .from('intent_data')
        .select('id, date, company_name, topic, category, score, website, secondary_industry_hierarchical_category, alexa_rank, employees, week_label');
      
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
    // Use specific column selection to avoid TypeScript recursion issues
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
    
    // Extract week labels and filter out any null values
    const weekLabels = data
      .map(item => item.week_label)
      .filter(Boolean) as string[];
    
    // Get unique week labels
    const uniqueWeeks = [...new Set(weekLabels)];
    
    // Sort in reverse chronological order (assuming week labels can be sorted)
    return uniqueWeeks.sort().reverse();
  } catch (err) {
    console.error("Error fetching available weeks:", err);
    return [];
  }
};
