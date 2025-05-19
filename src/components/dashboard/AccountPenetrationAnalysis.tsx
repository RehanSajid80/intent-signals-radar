
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, Account } from "@/context/hubspot";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Building, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [sortField, setSortField] = useState<'penetrationScore' | 'contacts' | 'activeDeals' | 'mqls' | 'sqls'>('contacts');
  const [showEmptyAccounts, setShowEmptyAccounts] = useState(false);
  
  // Prepare company data by analyzing contacts
  const companyData = contacts.reduce((acc, contact) => {
    const companyName = contact.company || 'Unknown';
    
    if (!acc[companyName]) {
      acc[companyName] = {
        name: companyName,
        contacts: 0,
        mqls: 0,
        sqls: 0
      };
    }
    
    // Increment total contacts
    acc[companyName].contacts++;
    
    // Check for MQLs - contacts in qualification stage
    if (contact.lifecycleStage === 'Marketing Qualified Lead' || 
        contact.lifecycleStage === 'MQL' ||
        contact.priorityLevel === 'medium') {
      acc[companyName].mqls++;
    }
    
    // Check for SQLs - contacts in sales qualification or demo stage
    if (contact.lifecycleStage === 'Sales Qualified Lead' || 
        contact.lifecycleStage === 'SQL' ||
        contact.priorityLevel === 'high') {
      acc[companyName].sqls++;
    }
    
    return acc;
  }, {} as Record<string, { name: string; contacts: number; mqls: number; sqls: number }>);
  
  // Convert to array and filter out empty accounts if needed
  let companiesArray = Object.values(companyData);
  
  if (!showEmptyAccounts) {
    companiesArray = companiesArray.filter(company => company.contacts > 0);
  }
  
  // Sort by selected field
  const sortedCompanies = [...companiesArray].sort((a, b) => {
    if (sortField === 'contacts') return b.contacts - a.contacts;
    if (sortField === 'mqls') return b.mqls - a.mqls;
    if (sortField === 'sqls') return b.sqls - a.sqls;
    
    // Default fallback to contacts
    return b.contacts - a.contacts;
  }).slice(0, displayCount);
  
  // Calculate conversion rates
  const companyAnalytics = sortedCompanies.map(company => {
    const mqlRate = company.contacts > 0 ? Math.round((company.mqls / company.contacts) * 100) : 0;
    const sqlRate = company.mqls > 0 ? Math.round((company.sqls / company.mqls) * 100) : 0;
    
    return {
      ...company,
      mqlRate,
      sqlRate
    };
  });
  
  // Prepare data for chart visualization
  const chartData = companyAnalytics.map(company => ({
    name: company.name,
    contacts: company.contacts,
    mqls: company.mqls,
    sqls: company.sqls
  }));
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Building className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-lg">Account Penetration Analysis</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showEmpty" 
              checked={showEmptyAccounts}
              onCheckedChange={(checked) => setShowEmptyAccounts(checked === true)}
            />
            <label htmlFor="showEmpty" className="text-sm">
              Show Empty Accounts
            </label>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => setSortField('contacts')}
          >
            Sort by Contacts
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => setSortField('mqls')}
          >
            Sort by MQLs
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => setSortField('sqls')}
          >
            Sort by SQLs
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
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead className="text-right">Total Contacts</TableHead>
                  <TableHead className="text-right">MQLs</TableHead>
                  <TableHead className="text-right">SQLs</TableHead>
                  <TableHead className="text-right">MQL Rate</TableHead>
                  <TableHead className="text-right">SQL Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyAnalytics.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Collapsible>
                        <CollapsibleTrigger className="hover:underline cursor-pointer flex items-center">
                          {company.name}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 ml-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>
                                {company.contacts} total contacts ({company.mqls} MQLs, {company.sqls} SQLs)
                              </span>
                            </div>
                            <div className="mt-1">
                              Contact to MQL: {company.mqlRate}% • MQL to SQL: {company.sqlRate}%
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </TableCell>
                    <TableCell className="text-right">{company.contacts}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span>{company.mqls}</span>
                        <div className="w-16 ml-2 bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${company.mqlRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span>{company.sqls}</span>
                        <div className="w-16 ml-2 bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${company.sqlRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{company.mqlRate}%</TableCell>
                    <TableCell className="text-right">{company.sqlRate}%</TableCell>
                  </TableRow>
                ))}
                {companyAnalytics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No company data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
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
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="contacts" name="Total Contacts" fill="#94A3B8" />
                  <Bar dataKey="mqls" name="MQLs" fill="#3B82F6" />
                  <Bar dataKey="sqls" name="SQLs" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1 bg-slate-400"></div>
                <span className="text-xs">Total Contacts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1 bg-blue-500"></div>
                <span className="text-xs">Marketing Qualified Leads (MQLs)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1 bg-green-500"></div>
                <span className="text-xs">Sales Qualified Leads (SQLs)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountPenetrationAnalysis;
