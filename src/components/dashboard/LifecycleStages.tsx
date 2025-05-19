import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LifeBuoy } from 'lucide-react';

const LifecycleStages = () => {
  const { contacts } = useHubspot();
  
  // Calculate lifecycle stage stats
  const lifecycleData = useMemo(() => {
    const stages: Record<string, number> = {};
    
    contacts.forEach(contact => {
      const stage = contact.lifecycleStage || 'Unknown';
      stages[stage] = (stages[stage] || 0) + 1;
    });
    
    return Object.entries(stages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [contacts]);
  
  const COLORS = ['#0091ae', '#00b8a9', '#25c199', '#4ad1aa', '#6fe1bb', '#94f2cc', '#c0fcdd'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Lifecycle Stages</CardTitle>
          </div>
        </div>
        <CardDescription>
          Distribution of contacts by lifecycle stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lifecycleData.length > 0 ? (
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} contacts`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No lifecycle stage data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LifecycleStages;
