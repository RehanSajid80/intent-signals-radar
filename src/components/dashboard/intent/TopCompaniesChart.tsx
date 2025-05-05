
import React, { useMemo } from "react";
import { 
  BarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { IntentData } from "../types/intentTypes";

interface TopCompaniesChartProps {
  data: IntentData[];
}

interface CompanyStats {
  count: number;
  totalScore: number;
  topics: Set<string>;
  categories: Set<string>;
}

interface ChartData {
  company: string;
  avgScore: number;
  count: number;
  topics: string[];
  categories: string[];
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data }) => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"];

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
    }, {} as Record<string, CompanyStats>);
    
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
      .slice(0, 10);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={topCompanies}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="company" tick={{fontSize: 12}} />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => [`${value}`, 'Average Score']} />
        <Bar dataKey="avgScore" name="Average Score">
          {topCompanies.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopCompaniesChart;
