
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [open, setOpen] = React.useState(false);

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
    
    return validWeeks.map(week => ({
      value: week,
      label: week
    }));
  }, [availableWeeks, getCurrentWeek]);

  // Safe onSelect handler
  const handleSelect = React.useCallback((selectedValue: string) => {
    if (selectedValue) {
      onChange(selectedValue);
      setOpen(false);
    }
  }, [onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value || "Select week..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search week..." />
          <CommandEmpty>No week found.</CommandEmpty>
          <CommandGroup>
            {weeks && weeks.length > 0 ? weeks.map((week) => (
              <CommandItem
                key={week.value}
                value={week.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === week.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {week.label}
              </CommandItem>
            )) : (
              <CommandItem value="no-weeks" disabled>
                No weeks available
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
