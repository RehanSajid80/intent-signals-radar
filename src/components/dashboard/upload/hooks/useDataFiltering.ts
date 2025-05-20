
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../../types/intentTypes";
import { fetchSupabaseData } from "../utils/supabase";

export const useDataFiltering = (setIntentData: (data: IntentData[]) => void) => {
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchFailed, setLastFetchFailed] = useState(false);
  const { toast } = useToast();

  const handleDateFilterChange = (date: string | null) => {
    setDateFilter(date);
  };

  const fetchFilteredData = async (date?: string, week?: string): Promise<IntentData[]> => {
    // Skip fetch if the last attempt failed and we're trying the same params
    if (lastFetchFailed && 
        ((date === dateFilter) || (date === undefined && dateFilter === null))) {
      return [];
    }
    
    setIsLoading(true);
    setLastFetchFailed(false);
    
    try {
      const data = await fetchSupabaseData(date, week);
      if (data && data.length > 0) {
        setIntentData(data);
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
      
      // Only show error toast once per session for the same error
      toast({
        title: "Error Loading Data",
        description: "Could not load data from database",
        variant: "destructive",
      });
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
