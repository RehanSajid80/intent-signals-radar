
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHubspot, Contact } from "@/context/HubspotContext";
import { Brain, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LeadCard from "@/components/ui/LeadCard";

// Lead probability classification
const PROBABILITY_LEVELS = {
  HIGH: { min: 75, label: "High", color: "bg-success-100 text-success-600" },
  MEDIUM: { min: 40, label: "Medium", color: "bg-warning-100 text-warning-600" },
  LOW: { min: 0, label: "Low", color: "bg-alert-100 text-alert-600" }
};

const getProbabilityLevel = (score: number) => {
  if (score >= PROBABILITY_LEVELS.HIGH.min) return PROBABILITY_LEVELS.HIGH;
  if (score >= PROBABILITY_LEVELS.MEDIUM.min) return PROBABILITY_LEVELS.MEDIUM;
  return PROBABILITY_LEVELS.LOW;
};

const LeadScoring = () => {
  const { contacts } = useHubspot();
  const [displayCount, setDisplayCount] = useState(20);
  
  // Calculate scores based on intentSignals, priorityLevel, engagementLevel
  const calculateAIScore = (contact: Contact) => {
    // Simulating an AI scoring algorithm
    // In a real implementation, this would use much more sophisticated logic or an API call
    const intentWeight = 0.4;
    const engagementWeight = 0.35;
    const priorityWeight = 0.25;
    
    // Calculate intent score based on signals
    const intentSignalScore = contact.intentSignals.reduce((sum, signal) => 
      sum + (signal.strength / 10), 0) / (contact.intentSignals.length || 1);
    
    // Convert priority to numeric value
    const priorityScore = 
      contact.priorityLevel === "high" ? 10 : 
      contact.priorityLevel === "medium" ? 6 : 3;
    
    // Calculate final score
    const score = Math.min(99, Math.round(
      (intentSignalScore * intentWeight * 10) + 
      (contact.engagementLevel * engagementWeight / 10) +
      (priorityScore * priorityWeight)
    ));
    
    return score;
  };
  
  // Add AI score to each contact
  const scoredContacts = contacts.map(contact => ({
    ...contact,
    aiScore: calculateAIScore(contact)
  }));
  
  // Group by probability level and sort by score
  const sortedContacts = [...scoredContacts].sort((a, b) => b.aiScore - a.aiScore);
  
  const highProbabilityLeads = sortedContacts.filter(
    contact => contact.aiScore >= PROBABILITY_LEVELS.HIGH.min
  ).slice(0, displayCount);
  
  const mediumProbabilityLeads = sortedContacts.filter(
    contact => contact.aiScore >= PROBABILITY_LEVELS.MEDIUM.min && 
               contact.aiScore < PROBABILITY_LEVELS.HIGH.min
  ).slice(0, displayCount);
  
  const lowProbabilityLeads = sortedContacts.filter(
    contact => contact.aiScore < PROBABILITY_LEVELS.MEDIUM.min
  ).slice(0, displayCount);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Lead Scoring</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Top
            <select 
              className="ml-1 bg-transparent border-none outline-none"
              value={displayCount}
              onChange={(e) => setDisplayCount(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="high" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="high" className="data-[state=active]:bg-success-50">High Probability</TabsTrigger>
            <TabsTrigger value="medium" className="data-[state=active]:bg-warning-50">Medium Probability</TabsTrigger>
            <TabsTrigger value="low" className="data-[state=active]:bg-alert-50">Low Probability</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="high" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highProbabilityLeads.length > 0 ? (
                highProbabilityLeads.map(contact => (
                  <LeadCard 
                    key={contact.id} 
                    contact={{...contact, score: contact.aiScore}} 
                    showDetails={true} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No high probability leads found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="medium" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediumProbabilityLeads.length > 0 ? (
                mediumProbabilityLeads.map(contact => (
                  <LeadCard 
                    key={contact.id} 
                    contact={{...contact, score: contact.aiScore}} 
                    showDetails={true} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No medium probability leads found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="low" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowProbabilityLeads.length > 0 ? (
                lowProbabilityLeads.map(contact => (
                  <LeadCard 
                    key={contact.id} 
                    contact={{...contact, score: contact.aiScore}} 
                    showDetails={true} 
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No low probability leads found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">AI Score</TableHead>
                  <TableHead>Probability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContacts.slice(0, displayCount).map(contact => {
                  const probability = getProbabilityLevel(contact.aiScore);
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <a href={`/contacts/${contact.id}`} className="hover:underline">
                          {contact.firstName} {contact.lastName}
                        </a>
                      </TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.title}</TableCell>
                      <TableCell className="text-right font-mono">{contact.aiScore}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${probability.color}`}>
                          {probability.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadScoring;
