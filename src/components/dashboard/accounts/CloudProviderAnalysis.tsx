
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Cloud, Microsoft, Apple, Google } from "lucide-react";

const CloudProviderAnalysis = () => {
  const { accounts } = useHubspot();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Provider Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer Name</TableHead>
                <TableHead className="text-center">AWS Client</TableHead>
                <TableHead className="text-center">Azure</TableHead>
                <TableHead className="text-center">Google Cloud</TableHead>
                <TableHead className="text-center">Oracle Cloud</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell className="text-center">
                    {account.isAWSClient ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.isAzureClient ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.isGoogleCloudClient ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.isOracleCloudClient ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudProviderAnalysis;
