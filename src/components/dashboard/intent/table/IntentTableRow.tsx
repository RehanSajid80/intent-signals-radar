
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { IntentData } from "../../types/intentTypes";
import ScoreBadge from "./ScoreBadge";

interface IntentTableRowProps {
  item: IntentData;
  index: number;
  expanded: boolean;
  toggleExpand: (index: number) => void;
}

const IntentTableRow: React.FC<IntentTableRowProps> = ({ 
  item, 
  index, 
  expanded, 
  toggleExpand 
}) => {
  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Invalid date";
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? format(date, 'MM/dd/yyyy') : "Invalid date";
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <TableRow 
      className={cn(
        "hover:bg-muted/50 transition-colors",
        expanded && "bg-muted/30"
      )}
    >
      <TableCell className="font-medium">{item.companyName}</TableCell>
      <TableCell>{item.topic}</TableCell>
      <TableCell>
        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
          {item.category}
        </span>
      </TableCell>
      <TableCell>
        <ScoreBadge score={item.score} />
      </TableCell>
      <TableCell>{formatDate(item.date)}</TableCell>
      <TableCell>
        <button 
          onClick={() => toggleExpand(index)}
          className="p-1 rounded-full hover:bg-muted"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default IntentTableRow;
