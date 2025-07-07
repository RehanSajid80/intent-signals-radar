
import React, { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { IntentData } from "../types/intentTypes";

interface CategoryDistributionChartProps {
  data: IntentData[];
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data }) => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"];

  const categoryDistribution = useMemo(() => {
    // Group by category
    const categoryStats = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array for chart
    return Object.entries(categoryStats)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={categoryDistribution}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {categoryDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} signals`, ""]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryDistributionChart;
