
import { useState, useEffect } from "react";
import { fetchAvailableWeeks } from "../utils/supabase";

export const useWeekManagement = () => {
  const [weekLabel, setWeekLabel] = useState<string>("");
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [weekFilter, setWeekFilter] = useState<string | null>(null);

  // Load available weeks when component mounts
  useEffect(() => {
    const loadWeeks = async () => {
      const weeks = await fetchAvailableWeeks();
      setAvailableWeeks(weeks);
    };
    
    loadWeeks();
  }, []);

  // Generate the current week label
  useEffect(() => {
    const current = new Date();
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weekString = `Week of ${startOfWeek.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })} - ${endOfWeek.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
    
    setWeekLabel(weekString);
  }, []);

  const handleWeekLabelChange = (week: string) => {
    setWeekLabel(week);
  };

  const handleWeekFilterChange = (week: string | null) => {
    setWeekFilter(week);
  };
  
  const refreshAvailableWeeks = async () => {
    const weeks = await fetchAvailableWeeks();
    setAvailableWeeks(weeks);
    return weeks;
  };

  return {
    weekLabel,
    availableWeeks,
    weekFilter,
    handleWeekLabelChange,
    handleWeekFilterChange,
    refreshAvailableWeeks
  };
};
