
import React from "react";
import { IntentData } from "../IntentUpload";
import { cn } from "@/lib/utils";

interface IntentDataTableProps {
  data: IntentData[];
}

const IntentDataTable: React.FC<IntentDataTableProps> = ({ data }) => {
  return (
    <div className="rounded-md border overflow-x-auto max-h-[500px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 sticky top-0">
            <th className="p-2 text-left font-medium">Company</th>
            <th className="p-2 text-left font-medium">Topic</th>
            <th className="p-2 text-left font-medium">Category</th>
            <th className="p-2 text-left font-medium">Score</th>
            <th className="p-2 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.sort((a, b) => b.score - a.score).map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.companyName}</td>
              <td className="p-2">{item.topic}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">
                <span 
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    item.score > 80 ? "bg-green-100 text-green-800" :
                    item.score > 60 ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  )}
                >
                  {item.score}
                </span>
              </td>
              <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IntentDataTable;
