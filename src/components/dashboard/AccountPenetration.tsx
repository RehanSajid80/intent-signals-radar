
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Building, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountPenetrationProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccountPenetration = ({ className, ...props }: AccountPenetrationProps) => {
  const { accounts, contacts } = useHubspot();
  const [sortField, setSortField] = useState<'penetration' | 'contacts' | 'mqls' | 'sqls'>('penetration');
  const [displayCount, setDisplayCount] = useState(10);

  // Group contacts by company
  const companyData = contacts.reduce((acc, contact) => {
    const companyName = contact.company || 'Unknown';
    
    if (!acc[companyName]) {
      acc[companyName] = {
        name: companyName,
        contacts: 0,
        mqls: 0,
        sqls: 0,
        penetration: 0
      };
    }
    
    // Increment total contacts
    acc[companyName].contacts++;
    
    // Check for MQLs
    if (contact.lifecycleStage === 'Marketing Qualified Lead' || 
        contact.lifecycleStage === 'MQL' ||
        contact.priorityLevel === 'medium') {
      acc[companyName].mqls++;
    }
    
    // Check for SQLs
    if (contact.lifecycleStage === 'Sales Qualified Lead' || 
        contact.lifecycleStage === 'SQL' ||
        contact.priorityLevel === 'high') {
      acc[companyName].sqls++;
    }
    
    return acc;
  }, {} as Record<string, { name: string; contacts: number; mqls: number; sqls: number; penetration: number }>);

  // Calculate penetration percentage (SQLs + MQLs) / total contacts * 100
  const companiesArray = Object.values(companyData).map(company => {
    const penetrationScore = company.contacts > 0 
      ? Math.round(((company.mqls + company.sqls) / company.contacts) * 100)
      : 0;
    
    return {
      ...company,
      penetration: penetrationScore
    };
  });

  // Sort companies based on selected field
  const sortedCompanies = [...companiesArray].sort((a, b) => {
    if (sortField === 'penetration') return b.penetration - a.penetration;
    if (sortField === 'contacts') return b.contacts - a.contacts;
    if (sortField === 'mqls') return b.mqls - a.mqls;
    if (sortField === 'sqls') return b.sqls - a.sqls;
    return 0;
  });
  
  // Only show selected number of companies for chart readability
  const chartData = sortedCompanies.slice(0, displayCount);

  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Building className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-lg">Account Penetration</CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select 
              value={sortField} 
              onValueChange={(value) => setSortField(value as any)}
            >
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penetration">Penetration %</SelectItem>
                <SelectItem value="contacts">Contacts</SelectItem>
                <SelectItem value="mqls">MQLs</SelectItem>
                <SelectItem value="sqls">SQLs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select 
              value={displayCount.toString()} 
              onValueChange={(value) => setDisplayCount(Number(value))}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="flex items-center justify-end space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>MQLs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>SQLs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span>Penetration %</span>
              </div>
            </div>
            
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                    barSize={20}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis yAxisId="left" orientation="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Penetration %', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'penetration') return [`${value}%`, 'Penetration'];
                      return [value, name];
                    }} />
                    <Bar yAxisId="left" dataKey="mqls" name="MQLs" fill="#3B82F6" />
                    <Bar yAxisId="left" dataKey="sqls" name="SQLs" fill="#10B981" />
                    <Bar yAxisId="right" dataKey="penetration" name="Penetration %" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No account data available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="rounded-md border">
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSortField('contacts')}
                          className={cn("p-0 h-auto font-medium", sortField === 'contacts' && "text-primary")}
                        >
                          Contacts
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSortField('mqls')}
                          className={cn("p-0 h-auto font-medium", sortField === 'mqls' && "text-primary")}
                        >
                          MQLs
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSortField('sqls')}
                          className={cn("p-0 h-auto font-medium", sortField === 'sqls' && "text-primary")}
                        >
                          SQLs
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSortField('penetration')}
                          className={cn("p-0 h-auto font-medium", sortField === 'penetration' && "text-primary")}
                        >
                          Penetration %
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompanies.map((company, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell className="text-right">{company.contacts}</TableCell>
                        <TableCell className="text-right">{company.mqls}</TableCell>
                        <TableCell className="text-right">{company.sqls}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span className="mr-2">{company.penetration}%</span>
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-purple-500"
                                style={{ width: `${company.penetration}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sortedCompanies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No company data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountPenetration;
