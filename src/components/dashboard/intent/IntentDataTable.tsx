
import React from "react";
import { IntentData } from "../types/intentTypes";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import IntentTableSearch from "./table/IntentTableSearch";
import SortableTableHeader from "./table/SortableTableHeader";
import IntentTableRow from "./table/IntentTableRow";
import TableExpandedRow from "./table/TableExpandedRow";
import EmptyTableRow from "./table/EmptyTableRow";
import { useIntentTableData } from "./table/useIntentTableData";

interface IntentDataTableProps {
  data: IntentData[];
}

const IntentDataTable: React.FC<IntentDataTableProps> = ({ data }) => {
  const {
    processedData,
    sortField,
    sortDirection,
    searchTerm,
    expanded,
    handleSort,
    setSearchTerm,
    toggleExpand,
    originalDataLength
  } = useIntentTableData(data);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <h2 className="text-lg font-semibold">Intent Signals</h2>
        <IntentTableSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHeader 
                  label="Company"
                  field="companyName"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHeader 
                  label="Topic"
                  field="topic"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHeader 
                  label="Category"
                  field="category"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHeader 
                  label="Score"
                  field="score"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHeader 
                  label="Date"
                  field="date"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableHead className="w-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((item, index) => (
                <React.Fragment key={index}>
                  <IntentTableRow
                    item={item}
                    index={index}
                    expanded={!!expanded[index]}
                    toggleExpand={toggleExpand}
                  />
                  
                  {expanded[index] && (
                    <TableExpandedRow item={item} />
                  )}
                </React.Fragment>
              ))}
              
              {processedData.length === 0 && (
                <EmptyTableRow searchTerm={searchTerm} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Showing {processedData.length} of {originalDataLength} records
        {originalDataLength - processedData.length > 0 && 
          ` (${originalDataLength - processedData.length} invalid records filtered out)`
        }
      </div>
    </div>
  );
};

export default IntentDataTable;
