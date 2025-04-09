
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHubspot, Contact } from "@/context/HubspotContext";
import { Brain, Filter, Users, UserCheck, AlertTriangle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LeadCard from "@/components/ui/LeadCard";
import { Badge } from "@/components/ui/badge";

// Lead probability classification based on new thresholds
const PROBABILITY_LEVELS = {
  HIGH: { min: 25, label: "High", color: "bg-success-100 text-success-600" },
  MEDIUM: { min: 10, label: "Medium", color: "bg-warning-100 text-warning-600" },
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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use HubSpot Score directly
  const scoredContacts = contacts.map(contact => ({
    ...contact,
    aiScore: contact.score // Using HubSpot Score directly
  }));
  
  // Filter contacts by search query
  const filteredContacts = searchQuery 
    ? scoredContacts.filter(contact => 
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : scoredContacts;
  
  // Group by probability level and sort by score
  const sortedContacts = [...filteredContacts].sort((a, b) => b.aiScore - a.aiScore);
  
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

  // Calculate counts for each category
  const highCount = sortedContacts.filter(contact => contact.aiScore >= PROBABILITY_LEVELS.HIGH.min).length;
  const mediumCount = sortedContacts.filter(contact => contact.aiScore >= PROBABILITY_LEVELS.MEDIUM.min && 
                                                    contact.aiScore < PROBABILITY_LEVELS.HIGH.min).length;
  const lowCount = sortedContacts.filter(contact => contact.aiScore < PROBABILITY_LEVELS.MEDIUM.min).length;
  const totalCount = filteredContacts.length;

  const handleExportCsv = () => {
    // Create CSV content
    const headers = ["Name", "Company", "Title", "Email", "Score", "Priority"];
    const rows = sortedContacts.map(contact => [
      `${contact.firstName} ${contact.lastName}`,
      contact.company,
      contact.title,
      contact.email,
      contact.aiScore.toString(),
      getProbabilityLevel(contact.aiScore).label
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'hubspot_contacts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Lead Scoring</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="pl-2 pr-8 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={handleExportCsv}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
          <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-success-600 mr-2" />
              <div>
                <p className="font-medium">High Priority</p>
                <p className="text-xs text-muted-foreground">Score 25+</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-success-100 text-success-700">
              {highCount} contacts
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-warning-600 mr-2" />
              <div>
                <p className="font-medium">Medium Priority</p>
                <p className="text-xs text-muted-foreground">Score 10-24</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-warning-100 text-warning-700">
              {mediumCount} contacts
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-alert-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-alert-600 mr-2" />
              <div>
                <p className="font-medium">Low Priority</p>
                <p className="text-xs text-muted-foreground">Score &lt;10</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-alert-100 text-alert-700">
              {lowCount} contacts
            </Badge>
          </div>
        </div>
      
        <Tabs defaultValue="high" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="high" className="data-[state=active]:bg-success-50">
              High Priority ({highCount})
            </TabsTrigger>
            <TabsTrigger value="medium" className="data-[state=active]:bg-warning-50">
              Medium Priority ({mediumCount})
            </TabsTrigger>
            <TabsTrigger value="low" className="data-[state=active]:bg-alert-50">
              Low Priority ({lowCount})
            </TabsTrigger>
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
                  No high priority leads found
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
                  No medium priority leads found
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
                  No low priority leads found
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
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Priority</TableHead>
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
                      <TableCell>{contact.email}</TableCell>
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
            {sortedContacts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No contacts found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadScoring;
