
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountPenetrationChart from "./AccountPenetrationChart";
import AccountPenetrationTable from "./AccountPenetrationTable";
import { useAccountPenetrationData } from "./useAccountPenetrationData";

interface AccountPenetrationProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccountPenetration = ({ className, ...props }: AccountPenetrationProps) => {
  const [sortField, setSortField] = useState<'penetration' | 'contacts' | 'mqls' | 'sqls'>('penetration');
  const [displayCount, setDisplayCount] = useState(10);
  
  const companiesArray = useAccountPenetrationData();

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
            <AccountPenetrationChart chartData={chartData} />
          </TabsContent>
          
          <TabsContent value="table">
            <AccountPenetrationTable 
              sortedCompanies={sortedCompanies} 
              sortField={sortField} 
              setSortField={setSortField} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccountPenetration;
