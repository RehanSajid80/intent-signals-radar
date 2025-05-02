
import React from "react";
import { TableHead } from "@/components/ui/table";
import { SortAsc, SortDesc } from "lucide-react";

type SortField = "companyName" | "topic" | "category" | "score" | "date";
type SortDirection = "asc" | "desc";

interface SortableTableHeaderProps {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/60"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {sortField === field && (
          <span className="ml-1">
            {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </span>
        )}
      </div>
    </TableHead>
  );
};

export default SortableTableHeader;
