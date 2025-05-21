
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const OwnerLifecycleBreakdown = () => {
  const { contactLifecycleStats, contactOwnerStats } = useHubspot();
  const [selectedOwner, setSelectedOwner] = useState<string>(() => {
    // Select the owner with most contacts by default
    const entries = Object.entries(contactOwnerStats);
    if (entries.length === 0) return '';
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  });
  
  // Get the owners sorted by contact count
  const owners = Object.entries(contactOwnerStats)
    .sort((a, b) => b[1] - a[1])
    .map(([owner]) => owner);
  
  // Get lifecycle data for selected owner
  const lifecycleData = selectedOwner && contactLifecycleStats[selectedOwner]
    ? Object.entries(contactLifecycleStats[selectedOwner])
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
    : [];
  
  const COLORS = ['#0091ae', '#00b8a9', '#25c199', '#4ad1aa', '#6fe1bb', '#94f2cc', '#c0fcdd'];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Owner Lifecycle Breakdown</CardTitle>
          </div>
        </div>
        <CardDescription>
          Lifecycle stages for contacts by owner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedOwner} onValueChange={setSelectedOwner}>
            <SelectTrigger>
              <SelectValue placeholder="Select an owner" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner || 'Unassigned'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {lifecycleData.length > 0 ? (
          <div className="h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} contacts`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No lifecycle data available for this owner
          </div>
        )}
        
        {lifecycleData.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {lifecycleData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-1" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="truncate" title={item.name}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerLifecycleBreakdown;
