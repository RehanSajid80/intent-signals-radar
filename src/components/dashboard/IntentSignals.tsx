
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, IntentSignal } from "@/context/HubspotContext";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Signal } from "lucide-react";

type SignalType = IntentSignal["type"];

interface SignalTypeInfo {
  name: string;
  color: string;
}

const signalTypeInfo: Record<SignalType, SignalTypeInfo> = {
  email_open: { name: "Email Opens", color: "#E4E7EB" },
  website_visit: { name: "Website Visits", color: "#6B778C" },
  form_submission: { name: "Form Submissions", color: "#0747A6" },
  content_download: { name: "Content Downloads", color: "#5243AA" },
  pricing_visit: { name: "Pricing Page Views", color: "#FF5630" },
  demo_request: { name: "Demo Requests", color: "#36B37E" }
};

const IntentSignals = () => {
  const { contacts } = useHubspot();
  
  // Gather all signals from all contacts
  const allSignals = contacts.flatMap(contact => contact.intentSignals);
  
  // Count signals by type
  const signalsByType = allSignals.reduce((acc, signal) => {
    acc[signal.type] = (acc[signal.type] || 0) + 1;
    return acc;
  }, {} as Record<SignalType, number>);
  
  // Format data for chart
  const chartData = Object.entries(signalsByType).map(([type, count]) => ({
    type: type as SignalType,
    name: signalTypeInfo[type as SignalType].name,
    value: count,
    color: signalTypeInfo[type as SignalType].color
  }));
  
  // Find recent significant signals
  const recentSignificantSignals = [...allSignals]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter(signal => signal.strength >= 80)
    .slice(0, 5);
  
  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center pb-2">
        <Signal className="h-5 w-5 mr-2 text-teal-500" />
        <CardTitle className="text-lg">Intent Signals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={(entry) => entry.name}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} signals`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No signal data available</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3">Recent High-Intent Signals</h4>
          {recentSignificantSignals.length > 0 ? (
            <div className="space-y-3">
              {recentSignificantSignals.map((signal, index) => (
                <div key={index} className="flex items-start p-2 rounded-md bg-muted/50">
                  <div 
                    className="w-2 h-2 rounded-full mt-1.5 mr-2"
                    style={{ backgroundColor: signalTypeInfo[signal.type].color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{signal.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(signal.timestamp)}
                    </p>
                  </div>
                  <div 
                    className="text-xs font-medium px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: signal.strength >= 90 
                        ? "#ffe5df" 
                        : "#fff0d6",
                      color: signal.strength >= 90 
                        ? "#cc4526" 
                        : "#cc8900"
                    }}
                  >
                    {signal.strength}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No high intent signals found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentSignals;
