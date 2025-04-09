
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, FunnelStage } from "@/context/HubspotContext";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LabelList 
} from "recharts";
import { Activity } from "lucide-react";

const stageTitles: Record<FunnelStage, string> = {
  awareness: "Awareness",
  prospecting: "Prospecting",
  qualification: "Qualification",
  demo: "Demo",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost"
};

const stageColors: Record<FunnelStage, string> = {
  awareness: "#E4E7EB",
  prospecting: "#C1C7D0",
  qualification: "#98A5B3",
  demo: "#6B778C",
  proposal: "#5243AA",
  negotiation: "#0747A6",
  closed_won: "#36B37E",
  closed_lost: "#FF5630"
};

const SalesFunnel = () => {
  const { accounts } = useHubspot();
  
  const stageData = Object.entries(stageTitles).map(([key, label]) => {
    const stage = key as FunnelStage;
    const count = accounts.filter(account => account.stage === stage).length;
    const totalContacts = accounts
      .filter(account => account.stage === stage)
      .reduce((sum, account) => sum + account.contacts.length, 0);
    
    return {
      stage,
      label,
      count,
      contacts: totalContacts,
      color: stageColors[stage]
    };
  }).filter(item => item.stage !== "closed_lost");

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center pb-2">
        <Activity className="h-5 w-5 mr-2 text-teal-500" />
        <CardTitle className="text-lg">Sales Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {accounts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="label" 
                  width={100}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === "count") return [value, "Accounts"];
                    return [value, "Contacts"];
                  }}
                />
                <Bar dataKey="count" maxBarSize={50} radius={[0, 4, 4, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="count" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No funnel data available</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          {stageData.filter(item => item.count > 0).map((stage, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-full h-2 rounded"
                style={{ backgroundColor: stage.color }}
              />
              <div className="mt-2 text-sm font-medium">{stage.label}</div>
              <div className="text-xs text-muted-foreground">
                {stage.count} {stage.count === 1 ? 'account' : 'accounts'}
              </div>
              <div className="text-xs text-muted-foreground">
                {stage.contacts} {stage.contacts === 1 ? 'contact' : 'contacts'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;
