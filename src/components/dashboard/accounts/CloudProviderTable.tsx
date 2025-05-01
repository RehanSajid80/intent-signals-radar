
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CloudProviderStatus } from "./CloudProviderStatus";
import { AnalyzedAccount } from "@/types/cloudProviders";

interface CloudProviderTableProps {
  accounts: AnalyzedAccount[];
}

export const CloudProviderTable = ({ accounts }: CloudProviderTableProps) => {
  return (
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
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="text-center">
                  <CloudProviderStatus 
                    isActive={!!account.cloudProviders?.aws}
                    detailText={account.cloudProviders?.details?.aws}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <CloudProviderStatus 
                    isActive={!!account.cloudProviders?.azure}
                    detailText={account.cloudProviders?.details?.azure}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <CloudProviderStatus 
                    isActive={!!account.cloudProviders?.googleCloud}
                    detailText={account.cloudProviders?.details?.googleCloud}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <CloudProviderStatus 
                    isActive={!!account.cloudProviders?.oracle}
                    detailText={account.cloudProviders?.details?.oracle}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No cloud provider analysis data yet. Enter an account name and URL to analyze.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
