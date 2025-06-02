import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHubspot } from "@/context/hubspot";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const lifecycleStageColors = {
  subscriber: "#007bff",
  lead: "#6610f2",
  marketingqualifiedlead: "#6f42c1",
  salesqualifiedlead: "#e83e8c",
  opportunity: "#dc3545",
  customer: "#fd7e14",
  evangelist: "#ffc107",
  other: "#28a745",
};

const LifecycleStages = () => {
  const { contacts } = useHubspot();

  const lifecycleStageCounts = contacts.reduce((acc: any, contact: any) => {
    const stage = contact.lifecycleStage || "other";
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const lifecycleStageData = Object.entries(lifecycleStageCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifecycle Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lifecycleStageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {lifecycleStageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        lifecycleStageColors[
                          entry.name as keyof typeof lifecycleStageColors
                        ] || "#8884d8"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="data">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Lifecycle Stage
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lifecycleStageData.map((stage) => (
                    <tr key={stage.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stage.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{stage.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LifecycleStages;
