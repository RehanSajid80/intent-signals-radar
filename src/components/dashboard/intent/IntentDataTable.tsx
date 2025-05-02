
import React from "react";
import { IntentData } from "../IntentUpload";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface IntentDataTableProps {
  data: IntentData[];
}

const IntentDataTable: React.FC<IntentDataTableProps> = ({ data }) => {
  // Sort data by score (descending) and filter out invalid scores
  const sortedData = React.useMemo(() => {
    return [...data]
      .filter(item => !isNaN(item.score) && item.score !== null)
      .sort((a, b) => b.score - a.score);
  }, [data]);

  return (
    <div className="rounded-md border overflow-x-auto max-h-[500px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 sticky top-0 z-10">
            <th className="p-2 text-left font-medium">Company</th>
            <th className="p-2 text-left font-medium">Topic</th>
            <th className="p-2 text-left font-medium">Category</th>
            <th className="p-2 text-left font-medium">Score</th>
            <th className="p-2 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => {
            // Parse date safely
            let formattedDate = "Invalid date";
            try {
              if (item.date) {
                const date = new Date(item.date);
                if (!isNaN(date.getTime())) {
                  formattedDate = format(date, 'MM/dd/yyyy');
                }
              }
            } catch (error) {
              console.error("Error formatting date:", error);
            }
            
            return (
              <tr key={index} className="border-b hover:bg-muted/30">
                <td className="p-2">{item.companyName}</td>
                <td className="p-2">{item.topic}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">
                  <span 
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      item.score >= 90 ? "bg-purple-100 text-purple-800" :
                      item.score >= 80 ? "bg-blue-100 text-blue-800" :
                      item.score >= 70 ? "bg-green-100 text-green-800" :
                      item.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                      "bg-orange-100 text-orange-800"
                    )}
                  >
                    {item.score}
                  </span>
                </td>
                <td className="p-2">{formattedDate}</td>
              </tr>
            );
          })}
          {data.length > 0 && sortedData.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                No valid score data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IntentDataTable;
