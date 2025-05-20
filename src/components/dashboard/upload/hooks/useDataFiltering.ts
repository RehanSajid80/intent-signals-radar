
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../../types/intentTypes";
import { fetchSupabaseData } from "../utils/supabase";

export const useDataFiltering = (setIntentData: (data: IntentData[]) => void) => {
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchFailed, setLastFetchFailed] = useState(false);
  const [lastFailedParams, setLastFailedParams] = useState<{date?: string, week?: string} | null>(null);
  const { toast } = useToast();

  const handleDateFilterChange = (date: string | null) => {
    setDateFilter(date);
  };

  const fetchFilteredData = async (date?: string, week?: string): Promise<IntentData[]> => {
    // Skip fetch if the last attempt failed with the same parameters to prevent error spam
    if (lastFetchFailed && 
        lastFailedParams && 
        lastFailedParams.date === date && 
        lastFailedParams.week === week) {
      console.log("Skipping repeated failed fetch with same parameters");
      return [];
    }
    
    setIsLoading(true);
    
    try {
      const data = await fetchSupabaseData(date, week);
      if (data && data.length > 0) {
        setIntentData(data);
        // Reset failure state on success
        setLastFetchFailed(false);
        setLastFailedParams(null);
        return data;
      } else {
        // Only show toast if we're filtering specifically
        if (date || week) {
          toast({
            title: "No Data Found",
            description: date 
              ? `No data found for ${date}` 
              : week 
                ? `No data found for ${week}`
                : "No data found in the database",
            variant: "default",
          });
        }
        return [];
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setLastFetchFailed(true);
      setLastFailedParams({ date, week });
      
      // Prevent error message spam - only show one toast per session for the same error
      if (!lastFetchFailed || 
          !lastFailedParams ||
          lastFailedParams.date !== date || 
          lastFailedParams.week !== week) {
        toast({
          title: "Error Loading Data",
          description: "Could not load data from database",
          variant: "destructive",
        });
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dateFilter,
    isLoading,
    handleDateFilterChange,
    fetchFilteredData
  };
};
