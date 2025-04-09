
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, Account } from "@/context/HubspotContext";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Building, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom color scale based on penetration score
const getPenetrationColor = (score: number) => {
  if (score >= 75) return "#36B37E"; // High penetration
  if (score >= 50) return "#00B8D9"; // Medium-high penetration
  if (score >= 25) return "#6554C0"; // Medium-low penetration
  return "#FFAB00"; // Low penetration
};

const AccountPenetrationAnalysis = () => {
  const { accounts, contacts } = useHubspot();
  const [displayCount, setDisplayCount] = useState(10);
  const [sortField, setSortField] = useState<'penetrationScore' | 'contacts' | 'activeDeals'>('penetrationScore');
  
  // Calculate additional stats for accounts
  const enhancedAccounts = accounts.map(account => {
    // Calculate number of MQLs (contacts in qualification stage)
    const mqls = contacts.filter(c => 
      c.company === account.name && c.priorityLevel === "medium"
    ).length;
    
    // Calculate number of new leads (contacts in awareness stage)
    const newLeads = contacts.filter(c => 
      c.company === account.name && 
      new Date(c.lastActivity).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length;
    
    return {
      ...account,
      mqls,
      newLeads,
      totalContacts: account.contacts.length
    };
  });
  
  // Sort accounts based on selected criteria
  const sortedAccounts = [...enhancedAccounts].sort((a, b) => {
    if (sortField === 'penetrationScore') return b.penetrationScore - a.penetrationScore;
    if (sortField === 'contacts') return b.contacts.length - a.contacts.length;
    return b.activeDeals - a.activeDeals;
  }).slice(0, displayCount);
  
  // Prepare data for bar chart
  const chartData = sortedAccounts.map(account => ({
    name: account.name,
    penetration: account.penetrationScore,
    contacts: account.contacts.length,
    mqls: account.mqls,
    newLeads: account.newLeads,
    color: getPenetrationColor(account.penetrationScore)
  }));
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Building className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Account Penetration</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => setSortField('penetrationScore')}
          >
            Sort by Penetration
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => setSortField('contacts')}
          >
            Sort by Contacts
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Top
            <select 
              className="ml-1 bg-transparent border-none outline-none"
              value={displayCount}
              onChange={(e) => setDisplayCount(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 120 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis label={{ value: 'Penetration Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'penetration') return [`${value}%`, 'Penetration Score'];
                      return [value, name === 'mqls' ? 'MQLs' : name === 'newLeads' ? 'New Leads' : 'Total Contacts'];
                    }}
                  />
                  <Bar dataKey="penetration" name="penetration">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#36B37E" }}></div>
                <span className="text-xs">High (75-100%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#00B8D9" }}></div>
                <span className="text-xs">Medium-High (50-74%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#6554C0" }}></div>
                <span className="text-xs">Medium-Low (25-49%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#FFAB00" }}></div>
                <span className="text-xs">Low (0-24%)</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Total Contacts</TableHead>
                  <TableHead className="text-right">MQLs</TableHead>
                  <TableHead className="text-right">New Leads</TableHead>
                  <TableHead className="text-right">Active Deals</TableHead>
                  <TableHead className="text-right">Penetration Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAccounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      <a href={`/accounts/${account.id}`} className="hover:underline">
                        {account.name}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{account.contacts.length}</TableCell>
                    <TableCell className="text-right">{account.mqls}</TableCell>
                    <TableCell className="text-right">{account.newLeads}</TableCell>
                    <TableCell className="text-right">{account.activeDeals}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${account.penetrationScore}%`,
                              backgroundColor: getPenetrationColor(account.penetrationScore)
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{account.penetrationScore}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountPenetrationAnalysis;
