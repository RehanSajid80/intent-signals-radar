
import { useParams, useNavigate } from "react-router-dom";
import { useHubspot, IntentSignal } from "@/context/hubspot";
import Sidebar from "@/components/Sidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  ArrowLeft,
  Clock,
  BarChart,
  FileBarChart,
  MousePointer,
  CreditCard,
  FileText,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useEffect } from "react";

const SignalIcon = ({ type }: { type: IntentSignal["type"] }) => {
  switch (type) {
    case "email_open":
      return <Mail className="h-4 w-4" />;
    case "website_visit":
      return <MousePointer className="h-4 w-4" />;
    case "form_submission":
      return <FileText className="h-4 w-4" />;
    case "content_download":
      return <Download className="h-4 w-4" />;
    case "pricing_visit":
      return <CreditCard className="h-4 w-4" />;
    case "demo_request":
      return <Calendar className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const ContactDetails = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const { contacts, isAuthenticated } = useHubspot();
  const navigate = useNavigate();
  
  const contact = contacts.find(c => c.id === contactId);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !contact) {
    return null;
  }
  
  const goBack = () => {
    navigate(-1);
  };
  
  const lastActivityDate = format(new Date(contact.lastActivity), "MMM d, yyyy");
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  
  // Mock engagement data for the chart
  const engagementData = [
    { date: "Apr 1", score: Math.floor(Math.random() * 20) + 20 },
    { date: "Apr 2", score: Math.floor(Math.random() * 20) + 25 },
    { date: "Apr 3", score: Math.floor(Math.random() * 20) + 30 },
    { date: "Apr 4", score: Math.floor(Math.random() * 20) + 35 },
    { date: "Apr 5", score: Math.floor(Math.random() * 20) + 40 },
    { date: "Apr 6", score: Math.floor(Math.random() * 20) + 45 },
    { date: "Apr 7", score: Math.floor(Math.random() * 20) + 50 },
    { date: "Apr 8", score: contact.engagementLevel },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="container mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <Avatar className="h-14 w-14 mr-4">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {contact.firstName} {contact.lastName}
                  </h1>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    {contact.company} · {contact.title}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`text-sm px-3 py-1 ${
                    contact.priorityLevel === "high" ? "bg-alert-500" :
                    contact.priorityLevel === "medium" ? "bg-warning-500" :
                    "bg-success-500"
                  }`}
                >
                  {contact.priorityLevel} priority
                </Badge>
                <Badge className="text-sm px-3 py-1 bg-primary">
                  Score: {contact.score}
                </Badge>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="font-medium">{contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-medium">{contact.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Last Activity</dt>
                    <dd className="font-medium">{lastActivityDate}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <FileBarChart className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Engagement Score</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-full bg-muted rounded-full h-3 mr-2">
                    <div 
                      className={`h-3 rounded-full ${
                        contact.engagementLevel >= 80 ? "bg-alert-500" :
                        contact.engagementLevel >= 60 ? "bg-warning-500" :
                        "bg-success-500"
                      }`}
                      style={{ width: `${contact.engagementLevel}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{contact.engagementLevel}%</span>
                </div>
                
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        width={25}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#0091ae" 
                        strokeWidth={2}
                        dot={{ r: 0 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Priority Factors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Recent Engagement</dt>
                    <dd>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-teal-500 h-2 rounded-full" 
                          style={{ width: `${70 + Math.random() * 30}%` }}
                        ></div>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Account Importance</dt>
                    <dd>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-teal-500 h-2 rounded-full" 
                          style={{ width: `${60 + Math.random() * 40}%` }}
                        ></div>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Buying Intent</dt>
                    <dd>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-teal-500 h-2 rounded-full" 
                          style={{ width: `${50 + Math.random() * 50}%` }}
                        ></div>
                      </div>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="signals">
            <TabsList>
              <TabsTrigger value="signals">
                <FileBarChart className="h-4 w-4 mr-2" />
                Intent Signals
              </TabsTrigger>
              <TabsTrigger value="activities">
                <Clock className="h-4 w-4 mr-2" />
                Recent Activities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Buying Intent Signals</CardTitle>
                  <CardDescription>
                    Recent actions that indicate buying interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contact.intentSignals.length > 0 ? (
                    <div className="space-y-4">
                      {contact.intentSignals.map((signal) => (
                        <div key={signal.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`p-2 rounded-full ${
                            signal.strength >= 90 ? "bg-alert-100 text-alert-600" :
                            signal.strength >= 70 ? "bg-warning-100 text-warning-600" :
                            "bg-neutral-100 text-neutral-600"
                          }`}>
                            <SignalIcon type={signal.type} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">
                                {signal.type.split("_").map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(" ")}
                              </h4>
                              <Badge variant="outline" className="ml-2">
                                {signal.strength}% strength
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {signal.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {format(new Date(signal.timestamp), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No intent signals recorded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Timeline of all interactions with this contact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative pl-6 pb-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="mb-1">
                        <h4 className="font-medium text-sm">Email Opened</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(contact.lastActivity), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">Opened email "April Product Updates"</p>
                    </div>
                    
                    <div className="relative pl-6 pb-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-muted"></div>
                      <div className="mb-1">
                        <h4 className="font-medium text-sm">Website Visit</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(new Date(contact.lastActivity).getTime() - 86400000), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">Visited pricing page and features comparison</p>
                    </div>
                    
                    <div className="relative pl-6 pb-6 border-l border-muted">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-muted"></div>
                      <div className="mb-1">
                        <h4 className="font-medium text-sm">Meeting</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(new Date(contact.lastActivity).getTime() - 172800000), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">Initial discovery call with sales rep</p>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-muted"></div>
                      <div className="mb-1">
                        <h4 className="font-medium text-sm">Added to CRM</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(new Date(contact.lastActivity).getTime() - 604800000), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">Contact created in HubSpot CRM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ContactDetails;
