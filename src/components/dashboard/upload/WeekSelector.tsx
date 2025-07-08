
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface WeekSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableWeeks?: string[];
  disabled?: boolean;
}

export function WeekSelector({ 
  value, 
  onChange, 
  availableWeeks = [],
  disabled = false
}: WeekSelectorProps) {
  // Generate the current week if no value is selected
  const getCurrentWeek = React.useCallback(() => {
    const current = new Date();
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `Week of ${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
  }, []);

  // Create a list of available weeks plus the current week
  const weeks = React.useMemo(() => {
    // Ensure we have an array of available weeks (never undefined)
    const safeAvailableWeeks = Array.isArray(availableWeeks) ? availableWeeks : [];
    const currentWeek = getCurrentWeek();
    
    // Ensure no duplicates and filter out any undefined/null values
    const validWeeks = [...new Set([currentWeek, ...safeAvailableWeeks])].filter(Boolean);
    
    return validWeeks;
  }, [availableWeeks, getCurrentWeek]);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", !value && "text-muted-foreground")}>
        <SelectValue placeholder="Select week..." />
      </SelectTrigger>
      <SelectContent>
        {weeks && weeks.length > 0 ? weeks.map((week) => (
          <SelectItem key={week} value={week}>
            {week}
          </SelectItem>
        )) : (
          <SelectItem value="no-weeks" disabled>
            No weeks available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
