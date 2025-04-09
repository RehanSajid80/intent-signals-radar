
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare } from 'lucide-react';

const EngagementByOwner = () => {
  const { engagementByOwner } = useHubspot();
  
  // Transform data for stacked bar chart
  const chartData = Object.entries(engagementByOwner)
    .map(([owner, stats]) => ({
      owner: owner === '' ? 'Unassigned' : owner,
      high: stats.high,
      medium: stats.medium,
      low: stats.low,
      total: stats.high + stats.medium + stats.low
    }))
    .sort((a, b) => b.total - a.total) // Sort by total count descending
    .slice(0, 6); // Take top 6 owners
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Engagement by Owner</CardTitle>
          </div>
        </div>
        <CardDescription>
          Contact engagement levels by owner in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="owner" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} contacts`, 
                    name.charAt(0).toUpperCase() + name.slice(1) + ' Engagement'
                  ]}
                />
                <Legend />
                <Bar dataKey="high" name="High" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" name="Medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" name="Low" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No engagement data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementByOwner;
