
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ChartPreviewProps {
  title: string;
  icon: React.ReactNode;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ title, icon }) => {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-3">{title}</h4>
        <div className="h-40 w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            {icon}
            <p>Connect to view {title.toLowerCase()} data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartPreview;
