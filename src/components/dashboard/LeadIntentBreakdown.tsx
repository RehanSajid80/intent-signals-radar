
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LeadIntentBreakdown = () => {
  const { contacts } = useHubspot();
  
  // Categorize contacts by intent level based on lead score
  const intentCategories = {
    high: contacts.filter(c => c.score >= 20),
    medium: contacts.filter(c => c.score >= 10 && c.score < 20),
    low: contacts.filter(c => c.score < 10)
  };
  
  // Check the distribution with console logs
  console.log("Total contacts:", contacts.length);
  console.log("High intent contacts:", intentCategories.high.length);
  console.log("Medium intent contacts:", intentCategories.medium.length);
  console.log("Low intent contacts:", intentCategories.low.length);
  console.log("Sample scores:", contacts.slice(0, 5).map(c => c.score));
  
  const chartData = [
    { name: 'High Intent', value: intentCategories.high.length, color: '#ea384c' },
    { name: 'Medium Intent', value: intentCategories.medium.length, color: '#f97316' },
    { name: 'Low Intent', value: intentCategories.low.length, color: '#25c199' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Lead Intent Breakdown</CardTitle>
          </div>
        </div>
        <CardDescription>
          Categorized by lead score: High (20+), Medium (10-19), Low (&lt;10)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} contacts`, 'Count']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intent Level</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((category) => (
                  <TableRow key={category.name}>
                    <TableCell>
                      <Badge
                        className={cn(
                          category.name === 'High Intent' && "bg-red-500",
                          category.name === 'Medium Intent' && "bg-orange-500",
                          category.name === 'Low Intent' && "bg-green-500"
                        )}
                      >
                        {category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{category.value}</TableCell>
                    <TableCell className="text-right">
                      {contacts.length > 0 ? Math.round((category.value / contacts.length) * 100) : 0}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">High Intent Leads</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Lead Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intentCategories.high.slice(0, 5).map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell className="text-right font-bold">{contact.score}</TableCell>
                  </TableRow>
                ))}
                {intentCategories.high.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No high intent leads found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadIntentBreakdown;
