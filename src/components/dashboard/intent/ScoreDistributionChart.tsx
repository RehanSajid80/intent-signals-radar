
import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";
import { IntentData } from "../IntentUpload";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ScoreDistributionChartProps {
  data: IntentData[];
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  // Process data to create a histogram of score distributions
  const scoreDistribution = useMemo(() => {
    // Group scores into ranges (0-59, 60-69, 70-79, 80-89, 90-100)
    const ranges = [
      { name: "0-59", min: 0, max: 59, color: "#F97316" }, // Orange
      { name: "60-69", min: 60, max: 69, color: "#FFBB28" }, // Yellow
      { name: "70-79", min: 70, max: 79, color: "#00C49F" }, // Green
      { name: "80-89", min: 80, max: 89, color: "#0088FE" }, // Blue
      { name: "90-100", min: 90, max: 100, color: "#8B5CF6" } // Purple
    ];

    // Initialize counts
    const distribution = ranges.map(range => ({
      range: range.name,
      count: 0,
      color: range.color
    }));

    // Filter out invalid scores and count scores in each range
    data.filter(item => !isNaN(item.score) && item.score !== null && item.score !== undefined)
        .forEach(item => {
          const score = item.score;
          for (let i = 0; i < ranges.length; i++) {
            if (score >= ranges[i].min && score <= ranges[i].max) {
              distribution[i].count++;
              break;
            }
          }
        });

    return distribution;
  }, [data]);

  // Calculate average score - handling NaN values
  const averageScore = useMemo(() => {
    if (data.length === 0) return 0;
    
    // Filter out invalid scores
    const validScores = data.filter(item => 
      !isNaN(item.score) && item.score !== null && item.score !== undefined
    );
    
    if (validScores.length === 0) return 0;
    
    const sum = validScores.reduce((total, item) => total + item.score, 0);
    return Math.round(sum / validScores.length);
  }, [data]);

  return (
    <div className="h-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm font-medium">
          Score Distribution
        </div>
        <div className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
          Avg: {averageScore}
        </div>
      </div>
      
      <ChartContainer 
        className="h-[85%]" 
        config={{
          low: { label: "Low (0-59)", color: "#F97316" },
          medium: { label: "Medium (60-79)", color: "#FFBB28" },
          high: { label: "High (80-89)", color: "#0088FE" },
          critical: { label: "Critical (90-100)", color: "#8B5CF6" },
        }}
      >
        <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <ReferenceLine 
            y={Math.round(data.length / 5)} 
            stroke="#666" 
            strokeDasharray="3 3" 
            label={{ value: 'Average', position: 'insideBottomRight' }} 
          />
          <Bar dataKey="count" name="Signals">
            {scoreDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ScoreDistributionChart;
