
import React from "react";
import { IntentData } from "../types/intentTypes";

interface IntentDataPreviewProps {
  previewData: IntentData[];
}

const IntentDataPreview: React.FC<IntentDataPreviewProps> = ({ previewData }) => {
  if (previewData.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Preview:</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Intent ID</th>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Topic</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{row.intentId}</td>
                <td className="p-2">{row.companyName}</td>
                <td className="p-2">{row.topic}</td>
                <td className="p-2">{row.category}</td>
                <td className="p-2">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Showing first 3 rows of data
      </p>
    </div>
  );
};

export default IntentDataPreview;
