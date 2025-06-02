import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHubspot } from "@/context/hubspot";

const CloudProviderAnalysis = ({ accountId }: { accountId: string }) => {
  const { accounts } = useHubspot();
  const account = accounts.find(a => a.id === accountId);

  if (!account) {
    return <div>Account not found</div>;
  }

  // Mock cloud provider data
  const cloudProviders = [
    { name: "AWS", usage: Math.floor(Math.random() * 100) },
    { name: "Azure", usage: Math.floor(Math.random() * 100) },
    { name: "GCP", usage: Math.floor(Math.random() * 100) },
    { name: "Other", usage: Math.floor(Math.random() * 100) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cloud Provider Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cloudProviders.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between">
              <span>{provider.name}</span>
              <Badge variant="secondary">{provider.usage}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudProviderAnalysis;
