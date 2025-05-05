
import { supabase } from "@/integrations/supabase/client";
import { IntentData, DbIntentData } from "../../types/intentTypes";

/**
 * Save intent data to Supabase
 */
export const saveToSupabase = async (intentDataArray: IntentData[], weekLabel?: string) => {
  try {
    // Get the user ID first, outside of the map function
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id || null;
    
    console.log("Auth status:", !!userId, "User ID:", userId);
    console.log("Saving data for week:", weekLabel || "Not specified");
    
    if (!userId) {
      console.error("Authentication error: User is not authenticated");
      return { data: null, error: new Error("User is not authenticated") };
    }
    
    // Convert to Supabase format - keeping only fields that exist in the database
    const supabaseRows = intentDataArray.map(item => ({
      date: item.date,
      company_name: item.companyName,
      topic: item.topic,
      category: item.category,
      score: item.score,
      website: item.website || null,
      secondary_industry_hierarchical_category: item.secondaryIndustryHierarchicalCategory || null,
      alexa_rank: item.alexaRank ? parseInt(item.alexaRank) : null,
      employees: item.employees ? parseInt(item.employees) : null,
      user_id: userId,
      week_label: weekLabel || null
    }));
    
    // Log what we're trying to insert to help with debugging
    console.log("Attempting to insert data count:", supabaseRows.length);
    console.log("Sample data:", supabaseRows[0]);
    
    // Insert data in batches to avoid request size limitations
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < supabaseRows.length; i += batchSize) {
      const batch = supabaseRows.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    console.log("Processing data in", batches.length, "batches");
    
    let errors = [];
    let totalInserted = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Inserting batch ${i+1}/${batches.length}, size: ${batch.length}`);
      
      const { data, error } = await supabase
        .from('intent_data')
        .insert(batch)
        .select('id');
      
      if (error) {
        errors.push(error);
        console.error(`Batch ${i+1} error:`, error.message, error.details, error.hint);
      } else if (data) {
        totalInserted += data.length;
        console.log(`Batch ${i+1} success: inserted ${data.length} rows`);
      }
    }
    
    if (errors.length > 0) {
      // If we had some successful inserts but some failed
      if (totalInserted > 0) {
        console.log(`Partial success: ${totalInserted} rows inserted, ${errors.length} batches failed`);
        return { 
          data: { inserted: totalInserted }, 
          error: new Error(`${errors.length} batches failed to insert, but ${totalInserted} rows were saved.`) 
        };
      }
      console.error("Complete failure to insert data:", errors[0]);
      return { data: null, error: new Error(`Failed to insert data: ${errors[0].message}`) };
    }
    
    console.log("Full success: all data inserted, total:", totalInserted);
    return { data: { inserted: totalInserted }, error: null };
  } catch (err) {
    console.error("Error in saveToSupabase:", err);
    return { data: null, error: err as Error };
  }
};

/**
 * Fetch intent data from Supabase
 * @param dateFilter Optional date to filter data by
 * @param weekLabel Optional week label to filter data by
 */
export const fetchSupabaseData = async (dateFilter?: string, weekLabel?: string): Promise<IntentData[]> => {
  try {
    // Define the base query - avoiding type recursion issues
    let query = supabase.from('intent_data').select();
    
    // Apply filters if provided
    if (dateFilter) {
      query = query.eq('date', dateFilter);
    }
    
    if (weekLabel) {
      query = query.eq('week_label', weekLabel);
    }
    
    // Execute the query with ordering
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Convert to our frontend format with explicit typing
    const convertedData: IntentData[] = data.map((item: any) => ({
      intentId: item.id,
      date: item.date,
      companyName: item.company_name,
      topic: item.topic,
      category: item.category,
      score: item.score,
      website: item.website || '',
      secondaryIndustryHierarchicalCategory: item.secondary_industry_hierarchical_category || '',
      alexaRank: item.alexa_rank?.toString() || '',
      employees: item.employees?.toString() || '',
      weekLabel: item.week_label || '',
      // Fill other fields as empty strings
      companyId: '',
      foundedYear: '',
      companyHQPhone: '',
      revenue: '',
      primaryIndustry: '',
      primarySubIndustry: '',
      allIndustries: '',
      allSubIndustries: '',
      industryHierarchicalCategory: '',
      linkedInUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      certifiedActiveCompany: '',
      certificationDate: '',
      totalFundingAmount: '',
      recentFundingAmount: '',
      recentFundingRound: '',
      recentFundingDate: '',
      recentInvestors: '',
      allInvestors: '',
      companyStreetAddress: '',
      companyCity: '',
      companyState: '',
      companyZipCode: '',
      companyCountry: '',
      fullAddress: '',
      numberOfLocations: '',
      queryName: '',
    }));
    
    return convertedData;
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return [];
  }
};

/**
 * Fetch available weeks from Supabase
 */
export const fetchAvailableWeeks = async (): Promise<string[]> => {
  try {
    // Use a simpler query approach to avoid type issues
    const { data, error } = await supabase
      .from('intent_data')
      .select('week_label')
      .not('week_label', 'is', null);
      
    if (error) {
      console.error("Error fetching weeks:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Extract unique week labels
    const weekLabels = data
      .map(item => item.week_label as string)
      .filter(Boolean);
      
    const uniqueWeeks = [...new Set(weekLabels)];
    return uniqueWeeks.sort().reverse();
  } catch (err) {
    console.error("Error fetching available weeks:", err);
    return [];
  }
};
