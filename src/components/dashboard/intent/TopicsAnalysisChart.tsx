
import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { IntentData } from "../IntentUpload";

interface TopicsAnalysisChartProps {
  data: IntentData[];
}

const TopicsAnalysisChart: React.FC<TopicsAnalysisChartProps> = ({ data }) => {
  const topicAnalysis = useMemo(() => {
    // Group by topic and calculate counts and average scores
    const topicStats = data.reduce((acc, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = {
          count: 0,
          totalScore: 0,
        };
      }
      
      acc[item.topic].count += 1;
      acc[item.topic].totalScore += item.score;
      
      return acc;
    }, {} as Record<string, { count: number, totalScore: number }>);
    
    // Convert to array and sort by count
    return Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Only show top 10 topics
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={topicAnalysis}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="topic" tick={{fontSize: 12}} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Signal Count" fill="#0088FE" />
        <Bar dataKey="avgScore" name="Average Score" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopicsAnalysisChart;
