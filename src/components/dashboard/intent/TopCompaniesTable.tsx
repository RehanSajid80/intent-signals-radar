
import React, { useMemo, useState } from "react";
import { IntentData } from "../types/intentTypes";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TopCompaniesTableProps {
  data: IntentData[];
}

const TopCompaniesTable: React.FC<TopCompaniesTableProps> = ({ data }) => {
  const [displayCount, setDisplayCount] = useState<number>(10);
  
  const topCompanies = useMemo(() => {
    // Group by company and calculate average scores
    const companyScores = data.reduce((acc, item) => {
      if (!acc[item.companyName]) {
        acc[item.companyName] = {
          count: 0,
          totalScore: 0,
          topics: new Set(),
          categories: new Set()
        };
      }
      
      acc[item.companyName].count += 1;
      acc[item.companyName].totalScore += item.score;
      acc[item.companyName].topics.add(item.topic);
      acc[item.companyName].categories.add(item.category);
      
      return acc;
    }, {} as Record<string, { count: number, totalScore: number, topics: Set<string>, categories: Set<string> }>);
    
    // Convert to array and sort by average score
    return Object.entries(companyScores)
      .map(([company, stats]) => ({
        company,
        avgScore: Math.round(stats.totalScore / stats.count),
        count: stats.count,
        topics: Array.from(stats.topics),
        categories: Array.from(stats.categories)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, displayCount);
  }, [data, displayCount]);

  const handleDisplayCountChange = (value: string) => {
    setDisplayCount(Number(value));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Top Companies by Intent</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Show:</span>
          <Select 
            value={displayCount.toString()} 
            onValueChange={handleDisplayCountChange}
          >
            <SelectTrigger className="h-8 w-[90px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left font-medium">Company</th>
              <th className="p-2 text-left font-medium">Avg. Score</th>
              <th className="p-2 text-left font-medium">Signals</th>
              <th className="p-2 text-left font-medium">Topics</th>
            </tr>
          </thead>
          <tbody>
            {topCompanies.map((company, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{company.company}</td>
                <td className="p-2">
                  <span 
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      company.avgScore > 80 ? "bg-green-100 text-green-800" :
                      company.avgScore > 60 ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    )}
                  >
                    {company.avgScore}
                  </span>
                </td>
                <td className="p-2">{company.count}</td>
                <td className="p-2 max-w-xs truncate">
                  {company.topics.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCompaniesTable;
