
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: "chart" | "activity" | "trending-up" | "trending-down";
  trend?: number;
  className?: string;
}

const DataCard = ({
  title,
  value,
  description,
  icon = "chart",
  trend,
  className,
}: DataCardProps) => {
  const iconMap = {
    "chart": <BarChart className="h-5 w-5" />,
    "activity": <Activity className="h-5 w-5" />,
    "trending-up": <TrendingUp className="h-5 w-5" />,
    "trending-down": <TrendingDown className="h-5 w-5" />,
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "p-1.5 rounded-full",
          icon === "chart" && "bg-blue-100 text-blue-600",
          icon === "activity" && "bg-purple-100 text-purple-600",
          icon === "trending-up" && "bg-success-100 text-success-600",
          icon === "trending-down" && "bg-alert-100 text-alert-600",
        )}>
          {iconMap[icon]}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center">
          {trend !== undefined && (
            <span className={cn(
              "font-medium inline-flex items-center mr-1",
              trend > 0 ? "text-success-600" : "text-alert-600"
            )}>
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
          {description}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
