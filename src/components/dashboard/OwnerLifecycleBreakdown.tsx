import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useHubspot } from "@/context/hubspot";

interface OwnerLifecycleBreakdownProps {
  ownerId: string;
}

const OwnerLifecycleBreakdown: React.FC<OwnerLifecycleBreakdownProps> = ({ ownerId }) => {
  const { contacts, lifecycleStages } = useHubspot();

  // Filter contacts by owner
  const ownerContacts = React.useMemo(() => {
    return contacts.filter(contact => contact.ownerId === ownerId);
  }, [contacts, ownerId]);

  // Count contacts in each lifecycle stage for the owner
  const lifecycleCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    lifecycleStages.forEach(stage => {
      counts[stage.stage] = 0;
    });

    ownerContacts.forEach(contact => {
      const stage = contact.lifecycleStage || 'unknown';
      counts[stage] = (counts[stage] || 0) + 1;
    });

    return counts;
  }, [ownerContacts, lifecycleStages]);

  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    return lifecycleStages.map(stage => ({
      name: stage.label,
      count: lifecycleCounts[stage.stage] || 0,
    }));
  }, [lifecycleStages, lifecycleCounts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifecycle Stage Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OwnerLifecycleBreakdown;
