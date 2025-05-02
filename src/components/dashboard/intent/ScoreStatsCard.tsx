
import React, { useMemo } from "react";
import { IntentData } from "../IntentUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreStatsCardProps {
  data: IntentData[];
}

const ScoreStatsCard: React.FC<ScoreStatsCardProps> = ({ data }) => {
  const scoreStats = useMemo(() => {
    if (data.length === 0) {
      return { avg: 0, high: 0, low: 0, count: 0, highScoreCount: 0, highScorePercentage: 0 };
    }
    
    // Filter out invalid scores
    const validData = data.filter(item => 
      !isNaN(item.score) && item.score !== null && item.score !== undefined
    );
    
    if (validData.length === 0) {
      return { avg: 0, high: 0, low: 0, count: 0, highScoreCount: 0, highScorePercentage: 0 };
    }
    
    const scores = validData.map(item => item.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / scores.length);
    const high = Math.max(...scores);
    const low = Math.min(...scores);
    const highScoreCount = scores.filter(score => score >= 90).length;
    const highScorePercentage = Math.round((highScoreCount / scores.length) * 100);
    
    return { 
      avg, 
      high, 
      low, 
      count: scores.length,
      highScoreCount,
      highScorePercentage,
      validDataCount: validData.length,
      invalidDataCount: data.length - validData.length
    };
  }, [data]);

  // Create a score distribution for visualization
  const scoreDistribution = useMemo(() => {
    const validData = data.filter(item => 
      !isNaN(item.score) && item.score !== null && item.score !== undefined
    );
    
    if (validData.length === 0) return [];
    
    // Create 10 buckets for scores 0-9, 10-19, etc.
    const buckets = Array(10).fill(0);
    
    validData.forEach(item => {
      // Handle edge case of score = 100
      const bucketIndex = item.score === 100 ? 9 : Math.floor(item.score / 10);
      if (bucketIndex >= 0 && bucketIndex < 10) {
        buckets[bucketIndex]++;
      }
    });
    
    // Calculate percentages
    return buckets.map(count => (count / validData.length) * 100);
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Intent Score Analytics</span>
          <div className="flex gap-2">
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              Total: {scoreStats.count}
            </span>
            {scoreStats.invalidDataCount > 0 && (
              <span className="text-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                Invalid: {scoreStats.invalidDataCount}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-2xl font-bold">{scoreStats.avg}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Highest</div>
            <div className="text-2xl font-bold text-green-700">{scoreStats.high}</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Lowest</div>
            <div className="text-2xl font-bold text-orange-700">{scoreStats.low}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">High Intent</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-700">{scoreStats.highScorePercentage}%</div>
              <div className="ml-1 text-xs text-muted-foreground">(≥90)</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Score Distribution</div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
            {scoreDistribution.map((percentage, i) => {
              // Get color based on score range
              const color = i < 6 
                ? "bg-orange-400" 
                : i < 8 
                  ? "bg-yellow-400" 
                  : i < 9 
                    ? "bg-blue-400" 
                    : "bg-purple-500";
              
              return (
                <div 
                  key={i} 
                  className={cn("h-full transition-all", color)}
                  style={{ width: `${percentage}%` }}
                  title={`${i*10}-${(i+1)*10-1}: ${Math.round(percentage)}%`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreStatsCard;
