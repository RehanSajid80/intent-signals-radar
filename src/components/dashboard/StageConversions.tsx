import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useHubspot, Contact } from "@/context/hubspot";

interface StageConversionsProps {
  contacts: Contact[];
}

const StageConversions: React.FC<StageConversionsProps> = ({ contacts }) => {
  // Dummy data for demonstration
  const data = [
    { name: 'Awareness', value: 400 },
    { name: 'Consideration', value: 300 },
    { name: 'Decision', value: 200 },
    { name: 'Closed Won', value: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stage Conversions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StageConversions;
