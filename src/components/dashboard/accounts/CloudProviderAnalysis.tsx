
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Cloud, CheckCircle2, XCircle } from "lucide-react";

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
                    {account.cloudProviders?.aws ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.cloudProviders?.azure ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.cloudProviders?.googleCloud ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.cloudProviders?.oracle ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
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
