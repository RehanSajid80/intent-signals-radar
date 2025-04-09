
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

const ContactOwnerDistribution = () => {
  const { contactOwnerStats } = useHubspot();
  
  // Transform data for chart
  const chartData = Object.entries(contactOwnerStats)
    .map(([owner, count]) => ({
      owner: owner === '' ? 'Unassigned' : owner,
      count,
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 10); // Take top 10 owners
  
  const colors = [
    '#0091ae', '#32a8c0', '#64c2d1', '#96dbe2', '#c8f5f3',
    '#25c199', '#4ad1aa', '#6fe1bb', '#94f2cc', '#c0fcdd',
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Contact Owner Distribution</CardTitle>
          </div>
        </div>
        <CardDescription>
          Number of contacts assigned to each owner
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="owner" 
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip 
                  formatter={(value) => [`${value} contacts`, 'Count']}
                  labelFormatter={(label) => `Owner: ${label}`}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No contact owner data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactOwnerDistribution;
