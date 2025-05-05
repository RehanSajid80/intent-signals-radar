import { supabase } from "@/integrations/supabase/client";
import { IntentData } from "../../../types/intentTypes";

/**
 * Save intent data to Supabase
 */
export const saveToSupabase = async (intentDataArray: IntentData[], weekLabel?: string) => {
  try {
    console.log("Saving data for week:", weekLabel || "Not specified");
    
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
      week_label: weekLabel || null,
      // Do not set user_id as it's handled by RLS policies
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
