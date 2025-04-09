
import Sidebar from "@/components/Sidebar";
import { useHubspot } from "@/context/HubspotContext";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Input 
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Switch 
} from "@/components/ui/switch";
import { Settings as SettingsIcon, LogOut, Save } from "lucide-react";
import { useEffect } from "react";

const Settings = () => {
  const { isAuthenticated, disconnectFromHubspot } = useHubspot();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-6">
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Model</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" defaultValue="Sales Analytics Dashboard" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Notification Email</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <select 
                      id="timezone" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5" selected>Eastern Time (UTC-5)</option>
                      <option value="UTC+0">UTC</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the application
                      </p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>
                    Manage connections to external services and data sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-hubspot text-white rounded-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M84.5 267.9a31.35 31.35 0 0 0 31.3 31.3h91.6V208.2h-91.6a31.35 31.35 0 0 0-31.3 31.3v28.4zm91.6-91.7h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9A18.8 18.8 0 0 0 89.7 130c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14zm80.6 123h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v13.1zm158.8-119.6a31.35 31.35 0 0 0-31.3-31.3h-91.6v91.6h91.6a31.35 31.35 0 0 0 31.3-31.3v-29zm35.1 77.5h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14h33.8v-32.5c0-17.5-14.1-31.6-31.6-31.6l-.6-.9zm-220.1-25.3a22.1 22.1 0 1 0 0-44.2 22.1 22.1 0 0 0 0 44.2zm0 35.2a57.3 57.3 0 1 1 0-114.6 57.3 57.3 0 0 1 0 114.6z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">HubSpot</h3>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={disconnectFromHubspot}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                          <rect width="20" height="16" x="2" y="4" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Outlook</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-600 text-white rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                          <line x1="16" x2="16" y1="2" y2="6"/>
                          <line x1="8" x2="8" y1="2" y2="6"/>
                          <line x1="3" x2="21" y1="10" y2="10"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Google Calendar</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure when and how you receive alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm">High priority lead alerts</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm">Account stage changes</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm">Strong intent signals</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-sm">New contact added</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="scoring">
              <Card>
                <CardHeader>
                  <CardTitle>Scoring Model Configuration</CardTitle>
                  <CardDescription>
                    Customize how lead scores are calculated based on your business needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Priority Weights</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust how different factors contribute to the overall priority score
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Recent Engagement</Label>
                          <span className="text-sm">40%</span>
                        </div>
                        <Input type="range" min="0" max="100" defaultValue="40" className="w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Account Importance</Label>
                          <span className="text-sm">30%</span>
                        </div>
                        <Input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Deal Stage</Label>
                          <span className="text-sm">20%</span>
                        </div>
                        <Input type="range" min="0" max="100" defaultValue="20" className="w-full" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Behavioral Intent</Label>
                          <span className="text-sm">10%</span>
                        </div>
                        <Input type="range" min="0" max="100" defaultValue="10" className="w-full" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-medium">Priority Thresholds</h3>
                    <p className="text-sm text-muted-foreground">
                      Set score thresholds for priority levels
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>High Priority Threshold</Label>
                        <Input type="number" defaultValue="80" min="0" max="100" />
                        <p className="text-xs text-muted-foreground">
                          Contacts with score above this value are high priority
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Medium Priority Threshold</Label>
                        <Input type="number" defaultValue="50" min="0" max="100" />
                        <p className="text-xs text-muted-foreground">
                          Contacts with score above this value are medium priority
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Scoring Model
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
