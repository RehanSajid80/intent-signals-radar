
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from 'lucide-react';

const ContactBreakdown = () => {
  const { contacts } = useHubspot();
  
  // Calculate owner statistics
  const ownerStats = contacts.reduce((acc, contact) => {
    const owner = contact.owner || 'Unassigned';
    acc[owner] = (acc[owner] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort owners by contact count (descending)
  const sortedOwners = Object.entries(ownerStats)
    .sort((a, b) => b[1] - a[1])
    .map(([owner, count]) => ({ owner, count }));
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Contact Breakdown by Owner</CardTitle>
          </div>
        </div>
        <CardDescription>
          Number of contacts assigned to each owner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact Owner</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOwners.map(({ owner, count }) => (
              <TableRow key={owner}>
                <TableCell className="font-medium">{owner}</TableCell>
                <TableCell className="text-right">{count}</TableCell>
                <TableCell className="text-right">
                  {Math.round((count / contacts.length) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContactBreakdown;
