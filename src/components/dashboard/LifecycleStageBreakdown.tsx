
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LifeBuoy } from 'lucide-react';

const LifecycleStageBreakdown = () => {
  const { contacts } = useHubspot();
  
  // Group contacts by lifecycle stage
  const stageGroups = contacts.reduce((acc, contact) => {
    const stage = contact.lifecycleStage || 'Unknown';
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(contact);
    return acc;
  }, {} as Record<string, typeof contacts>);
  
  // Create array of stages for display
  const stages = Object.keys(stageGroups).sort();
  
  // Calculate percentages
  const getPercentage = (count: number) => {
    return contacts.length > 0 
      ? Math.round((count / contacts.length) * 100) 
      : 0;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <LifeBuoy className="h-5 w-5 text-primary" />
          <CardTitle className="text-md">Lifecycle Stage Breakdown</CardTitle>
        </div>
        <CardDescription>
          Contacts in each lifecycle stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lifecycle Stage</TableHead>
              <TableHead className="text-right">Contacts</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map(stage => (
              <TableRow key={stage}>
                <TableCell className="font-medium">{stage}</TableCell>
                <TableCell className="text-right">{stageGroups[stage].length}</TableCell>
                <TableCell className="text-right">{getPercentage(stageGroups[stage].length)}%</TableCell>
              </TableRow>
            ))}
            {stages.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No lifecycle stage data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Show sample contacts for each stage */}
        {stages.length > 0 && (
          <div className="mt-8 space-y-6">
            {stages.map(stage => (
              <div key={stage} className="border rounded-md">
                <div className="bg-muted/50 px-4 py-2 font-medium">{stage} ({stageGroups[stage].length})</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stageGroups[stage].slice(0, 3).map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.company}</TableCell>
                      </TableRow>
                    ))}
                    {stageGroups[stage].length > 3 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                          + {stageGroups[stage].length - 3} more contacts
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LifecycleStageBreakdown;
