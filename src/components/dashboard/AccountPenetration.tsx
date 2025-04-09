
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from "recharts";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getColor = (score: number) => {
  if (score >= 80) return "#36b37e";
  if (score >= 50) return "#ffab00";
  return "#ff5630";
};

const AccountPenetration = () => {
  const { accounts } = useHubspot();
  const [sortBy, setSortBy] = useState<"penetration" | "deals" | "revenue">("penetration");
  
  const sortedAccounts = [...accounts].sort((a, b) => {
    if (sortBy === "penetration") return b.penetrationScore - a.penetrationScore;
    if (sortBy === "deals") return b.activeDeals - a.activeDeals;
    return b.totalRevenue - a.totalRevenue;
  }).slice(0, 5);
  
  const chartData = sortedAccounts.map(account => ({
    name: account.name,
    penetration: account.penetrationScore,
    contacts: account.contacts.length,
    deals: account.activeDeals,
    revenue: account.totalRevenue,
  }));

  const handleSortChange = (value: string) => {
    setSortBy(value as "penetration" | "deals" | "revenue");
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Account Penetration</CardTitle>
        </div>
        <Select defaultValue={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="penetration">Penetration</SelectItem>
            <SelectItem value="deals">Active Deals</SelectItem>
            <SelectItem value="revenue">Total Revenue</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tickLine={false}
                  tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "penetration") return [`${value}%`, "Penetration"];
                    if (name === "contacts") return [value, "Active Contacts"];
                    if (name === "deals") return [value, "Active Deals"];
                    return [`$${value.toLocaleString()}`, "Total Revenue"];
                  }}
                />
                <Bar dataKey="penetration" fill="#0091ae" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.penetration)} />
                  ))}
                  <LabelList dataKey="penetration" position="right" formatter={(value: number) => `${value}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No account data available</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {chartData.map((account, index) => (
            <Card key={index} className="p-3 border border-muted">
              <div className="text-sm font-medium truncate">{account.name}</div>
              <div className="flex justify-between mt-2 text-xs">
                <div className="text-muted-foreground">Contacts</div>
                <div className="font-medium">{account.contacts}</div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <div className="text-muted-foreground">Deals</div>
                <div className="font-medium">{account.deals}</div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountPenetration;
