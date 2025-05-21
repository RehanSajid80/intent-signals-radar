
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import LeadCard from "@/components/ui/LeadCard";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";
import { useState } from "react";

const PriorityLeads = () => {
  const { priorityContacts, refreshData } = useHubspot();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Priority Leads</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[600px] pb-6">
        <div className="space-y-4">
          {priorityContacts.length > 0 ? (
            priorityContacts.map((contact) => (
              <LeadCard key={contact.id} contact={contact} showDetails={true} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No priority leads found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityLeads;
