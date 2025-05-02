
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  timeframe: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, timeframe }) => {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              {icon}
            </div>
            <span className="text-xs text-muted-foreground">{timeframe}</span>
          </div>
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="text-2xl font-bold text-foreground/80">--</div>
          <div className="text-xs text-muted-foreground">Connect to view data</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
