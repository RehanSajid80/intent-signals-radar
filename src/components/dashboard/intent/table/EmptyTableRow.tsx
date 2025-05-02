
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyTableRowProps {
  searchTerm: string;
}

const EmptyTableRow: React.FC<EmptyTableRowProps> = ({ searchTerm }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-24 text-center">
        {searchTerm ? (
          <div className="text-muted-foreground">
            No results found for "{searchTerm}"
          </div>
        ) : (
          <div className="text-muted-foreground">
            No valid score data available
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
