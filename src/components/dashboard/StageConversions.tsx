
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, FunnelStage } from "@/context/HubspotContext";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the stages we want to track conversions between
const TRACKED_STAGES = ["awareness", "qualification", "demo", "proposal", "negotiation", "closed_won"];
const STAGE_LABELS: Record<string, string> = {
  "awareness": "Leads",
  "qualification": "MQLs",
  "demo": "SQLs",
  "proposal": "Opportunities",
  "negotiation": "Deals",
  "closed_won": "Customers"
};

const StageConversions = () => {
  const { contacts, accounts } = useHubspot();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeframe, setTimeframe] = useState("month");
  
  // Navigate to previous/next month
  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };
  
  // Filter contacts by stage change within the selected month
  const getConversionData = () => {
    // In a real app, you'd have historical data
    // This is a simplified mock implementation
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Calculate conversions between each stage
    return TRACKED_STAGES.slice(0, -1).map((fromStage, index) => {
      const toStage = TRACKED_STAGES[index + 1];
      
      // Simulate conversion counts - in a real app would use actual conversion timestamps
      // Here we're using the day of the month modulo to create varied mock data
      const conversionCount = (monthStart.getDate() + index) % 7 + (contacts.length / 3);
      const conversionRate = ((conversionCount / (contacts.length || 1)) * 100).toFixed(1);
      
      return {
        fromStage,
        toStage,
        fromLabel: STAGE_LABELS[fromStage],
        toLabel: STAGE_LABELS[toStage],
        count: Math.floor(conversionCount),
        rate: `${conversionRate}%`
      };
    });
  };
  
  const conversionData = getConversionData();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Stage Conversions</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex">
            <button 
              onClick={prevMonth}
              className="h-8 w-8 rounded-l-md border flex items-center justify-center hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-8 px-2 border-t border-b flex items-center">
              {format(currentMonth, "MMM yyyy")}
            </div>
            <button 
              onClick={nextMonth}
              className="h-8 w-8 rounded-r-md border flex items-center justify-center hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From Stage</TableHead>
              <TableHead>To Stage</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversionData.map((conversion, i) => (
              <TableRow key={i}>
                <TableCell>{conversion.fromLabel}</TableCell>
                <TableCell>{conversion.toLabel}</TableCell>
                <TableCell className="text-right">{conversion.count}</TableCell>
                <TableCell className="text-right">
                  <span className={
                    parseFloat(conversion.rate) > 25 ? "text-success-600" :
                    parseFloat(conversion.rate) > 10 ? "text-warning-600" : 
                    "text-alert-600"
                  }>
                    {conversion.rate}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StageConversions;
