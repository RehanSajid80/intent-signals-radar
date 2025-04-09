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
  return null;
};

export default SalesFunnel;
