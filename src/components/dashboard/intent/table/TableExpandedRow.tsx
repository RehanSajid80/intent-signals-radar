
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntentData } from "../../types/intentTypes";
import { format } from "date-fns";

interface TableExpandedRowProps {
  item: IntentData;
  onCompanyAnalysis?: (companyName: string) => void;
}

const TableExpandedRow: React.FC<TableExpandedRowProps> = ({ item, onCompanyAnalysis }) => {
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
    <TableRow className="bg-muted/20">
      <TableCell colSpan={6} className="py-3">
        <div className="grid sm:grid-cols-2 gap-4 px-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Company Details</h4>
            <div className="bg-white p-3 rounded border text-sm">
              <p><span className="font-medium">Company:</span> {item.companyName}</p>
              {item.website && (
                <p>
                  <span className="font-medium">Website:</span>{' '}
                  <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    {item.website}
                  </a>
                </p>
              )}
              {item.employees && <p><span className="font-medium">Employees:</span> {item.employees}</p>}
              {item.secondaryIndustryHierarchicalCategory && (
                <p><span className="font-medium">Industry:</span> {item.secondaryIndustryHierarchicalCategory}</p>
              )}
              {item.alexaRank && <p><span className="font-medium">Alexa Rank:</span> {item.alexaRank}</p>}
              <p><span className="font-medium">Intent Topic:</span> {item.topic}</p>
              <p><span className="font-medium">Category:</span> {item.category}</p>
              <p><span className="font-medium">Date:</span> {formatDate(item.date)}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Intent Analysis</h4>
            <div className="bg-white p-3 rounded border text-sm">
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Intent Strength</p>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      item.score >= 90 ? "bg-purple-500" :
                      item.score >= 80 ? "bg-blue-500" :
                      item.score >= 70 ? "bg-green-500" :
                      item.score >= 60 ? "bg-yellow-500" :
                      "bg-orange-500"
                    )}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
              <p>
                <span className="font-medium">Recommendation:</span>{' '}
                 {item.score >= 90 ? "Immediate follow-up recommended" :
                  item.score >= 80 ? "High priority follow-up" :
                  item.score >= 70 ? "Schedule follow-up" :
                  item.score >= 60 ? "Monitor interest" :
                  "Low priority"}
               </p>
               {onCompanyAnalysis && (
                 <Button 
                   size="sm" 
                   onClick={() => onCompanyAnalysis(item.companyName)}
                   className="mt-3"
                 >
                   <Brain className="h-4 w-4 mr-2" />
                   Analyze Company
                 </Button>
               )}
             </div>
           </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TableExpandedRow;
