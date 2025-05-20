
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../../types/intentTypes";
import { fetchSupabaseData } from "../utils/supabase";

export const useDataFiltering = (setIntentData: (data: IntentData[]) => void) => {
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDateFilterChange = (date: string | null) => {
    setDateFilter(date);
  };

  const fetchFilteredData = async (date?: string, week?: string): Promise<IntentData[]> => {
    try {
      const data = await fetchSupabaseData(date, week);
      if (data && data.length > 0) {
        setIntentData(data);
        return data;
      } else {
        toast({
          title: "No Data Found",
          description: date 
            ? `No data found for ${date}` 
            : week 
              ? `No data found for ${week}`
              : "No data found in the database",
          variant: "default",
        });
        return [];
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "Error Loading Data",
        description: "Could not load data from database",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    dateFilter,
    handleDateFilterChange,
    fetchFilteredData
  };
};
