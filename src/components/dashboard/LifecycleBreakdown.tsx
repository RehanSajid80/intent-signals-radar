
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LifeBuoy } from 'lucide-react';

const LifecycleBreakdown = () => {
  const { contacts } = useHubspot();
  
  // Calculate lifecycle statistics
  const lifecycleStats = contacts.reduce((acc, contact) => {
    const stage = contact.lifecycleStage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Format for chart
  const chartData = Object.entries(lifecycleStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const COLORS = [
    '#0091ae', '#00b8a9', '#25c199', '#4ad1aa', 
    '#6fe1bb', '#94f2cc', '#c0fcdd', '#25c0ff'
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Lifecycle Stage Breakdown</CardTitle>
          </div>
        </div>
        <CardDescription>
          Number of contacts in each lifecycle stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} contacts`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lifecycle Stage</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map(({ name, value }) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-right">{value}</TableCell>
                    <TableCell className="text-right">
                      {Math.round((value / contacts.length) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifecycleBreakdown;
