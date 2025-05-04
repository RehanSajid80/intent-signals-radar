import { supabase } from "@/integrations/supabase/client";
import { IntentData, DbIntentData } from "../../types/intentTypes";

/**
 * Save intent data to Supabase
 */
export const saveToSupabase = async (intentDataArray: IntentData[]) => {
  try {
    // Get the user ID first, outside of the map function
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id || null;
    
    if (!userId) {
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
      user_id: userId
    }));
    
    // Log what we're trying to insert to help with debugging
    console.log("Attempting to insert data:", supabaseRows[0]);
    
    // Insert data in batches to avoid request size limitations
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < supabaseRows.length; i += batchSize) {
      const batch = supabaseRows.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    let errors = [];
    let totalInserted = 0;
    
    for (const batch of batches) {
      const { data, error } = await supabase
        .from('intent_data')
        .insert(batch)
        .select('id');
      
      if (error) {
        errors.push(error);
        console.error("Error inserting batch:", error);
      } else if (data) {
        totalInserted += data.length;
      }
    }
    
    if (errors.length > 0) {
      // If we had some successful inserts but some failed
      if (totalInserted > 0) {
        return { 
          data: { inserted: totalInserted }, 
          error: new Error(`${errors.length} batches failed to insert, but ${totalInserted} rows were saved.`) 
        };
      }
      return { data: null, error: new Error(`Failed to insert data: ${errors[0].message}`) };
    }
    
    return { data: { inserted: totalInserted }, error: null };
  } catch (err) {
    console.error("Error in saveToSupabase:", err);
    return { data: null, error: err as Error };
  }
};

/**
 * Fetch intent data from Supabase
 * @param dateFilter Optional date to filter data by
 */
export const fetchSupabaseData = async (dateFilter?: string): Promise<IntentData[]> => {
  try {
    let query = supabase
      .from('intent_data')
      .select('*');
    
    // Apply date filter if provided
    if (dateFilter) {
      query = query.eq('date', dateFilter);
    }
    
    // Execute the query
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      // Convert to our frontend format
      const convertedData: IntentData[] = data.map((item: DbIntentData) => ({
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
    }
    
    return [];
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return [];
  }
};
