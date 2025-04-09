
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountPenetrationProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccountPenetration = ({ className, ...props }: AccountPenetrationProps) => {
  const { accounts } = useHubspot();

  const data = accounts.map(account => ({
    name: account.name,
    penetration: account.penetrationScore
  }));

  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardHeader className="flex flex-row items-center pb-2">
        <Building className="h-5 w-5 mr-2 text-primary" />
        <CardTitle className="text-lg">Account Penetration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {accounts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="penetration" fill="currentColor" className="text-primary fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No account data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountPenetration;
