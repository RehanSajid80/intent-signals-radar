import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntentData } from "../types/intentTypes";
import { TrendingUp, TrendingDown, Minus, Users, BarChart3, Target } from "lucide-react";

interface WeekTrendsAnalysisProps {
  currentWeekData: IntentData[];
  previousWeekData: IntentData[];
  currentWeek: string;
  previousWeek: string;
}

const WeekTrendsAnalysis: React.FC<WeekTrendsAnalysisProps> = ({
  currentWeekData,
  previousWeekData,
  currentWeek,
  previousWeek
}) => {
  // Calculate metrics for current week
  const currentAvgScore = currentWeekData.length > 0 
    ? currentWeekData.reduce((sum, item) => sum + item.score, 0) / currentWeekData.length 
    : 0;
  const currentUniqueCompanies = new Set(currentWeekData.map(item => item.companyName)).size;
  const currentTopics = new Set(currentWeekData.map(item => item.topic)).size;

  // Calculate metrics for previous week
  const previousAvgScore = previousWeekData.length > 0 
    ? previousWeekData.reduce((sum, item) => sum + item.score, 0) / previousWeekData.length 
    : 0;
  const previousUniqueCompanies = new Set(previousWeekData.map(item => item.companyName)).size;
  const previousTopics = new Set(previousWeekData.map(item => item.topic)).size;

  // Calculate changes
  const scoreDiff = currentAvgScore - previousAvgScore;
  const companiesDiff = currentUniqueCompanies - previousUniqueCompanies;
  const topicsDiff = currentTopics - previousTopics;

  // Get top companies for current week
  const topCompanies = currentWeekData
    .reduce((acc, item) => {
      if (!acc[item.companyName]) {
        acc[item.companyName] = { totalScore: 0, count: 0 };
      }
      acc[item.companyName].totalScore += item.score;
      acc[item.companyName].count += 1;
      return acc;
    }, {} as Record<string, { totalScore: number; count: number }>);

  const topCompaniesList = Object.entries(topCompanies)
    .map(([company, data]) => ({
      company,
      avgScore: data.totalScore / data.count,
      signals: data.count
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (previousWeekData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Week-on-Week Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No previous week data available for comparison. Upload data for multiple weeks to see trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Week-on-Week Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparing {currentWeek} vs {previousWeek}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Average Intent Score</p>
                <p className="text-2xl font-bold">{currentAvgScore.toFixed(1)}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(scoreDiff)}
                <span className={`text-sm font-medium ${getTrendColor(scoreDiff)}`}>
                  {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold">{currentUniqueCompanies}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(companiesDiff)}
                <span className={`text-sm font-medium ${getTrendColor(companiesDiff)}`}>
                  {companiesDiff > 0 ? '+' : ''}{companiesDiff}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Unique Topics</p>
                <p className="text-2xl font-bold">{currentTopics}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(topicsDiff)}
                <span className={`text-sm font-medium ${getTrendColor(topicsDiff)}`}>
                  {topicsDiff > 0 ? '+' : ''}{topicsDiff}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Companies by Intent Score
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Companies with highest average intent scores this week
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCompaniesList.map((company, index) => (
              <div key={company.company} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{company.company}</p>
                    <p className="text-sm text-muted-foreground">{company.signals} signals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{company.avgScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">avg score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeekTrendsAnalysis;