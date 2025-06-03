
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useHubspot } from "@/context/hubspot";

interface OwnerLifecycleBreakdownProps {
  ownerId: string;
}

const OwnerLifecycleBreakdown: React.FC<OwnerLifecycleBreakdownProps> = ({ ownerId }) => {
  const { contacts } = useHubspot();

  // Filter contacts by owner
  const ownerContacts = React.useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact => contact.ownerId === ownerId);
  }, [contacts, ownerId]);

  // Define default lifecycle stages if not available from context
  const defaultLifecycleStages = [
    { stage: 'subscriber', label: 'Subscriber' },
    { stage: 'lead', label: 'Lead' },
    { stage: 'marketing_qualified_lead', label: 'Marketing Qualified Lead' },
    { stage: 'sales_qualified_lead', label: 'Sales Qualified Lead' },
    { stage: 'opportunity', label: 'Opportunity' },
    { stage: 'customer', label: 'Customer' },
    { stage: 'evangelist', label: 'Evangelist' }
  ];

  // Count contacts in each lifecycle stage for the owner
  const lifecycleCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    defaultLifecycleStages.forEach(stage => {
      counts[stage.stage] = 0;
    });

    ownerContacts.forEach(contact => {
      const stage = contact.lifecycleStage || 'unknown';
      counts[stage] = (counts[stage] || 0) + 1;
    });

    return counts;
  }, [ownerContacts]);

  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    return defaultLifecycleStages.map(stage => ({
      name: stage.label,
      count: lifecycleCounts[stage.stage] || 0,
    }));
  }, [lifecycleCounts]);

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
