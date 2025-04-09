
import { useHubspot } from "@/context/HubspotContext";
import Sidebar from "@/components/Sidebar";
import PriorityLeads from "@/components/dashboard/PriorityLeads";
import AccountPenetration from "@/components/dashboard/AccountPenetration";
import SalesFunnel from "@/components/dashboard/SalesFunnel";
import IntentSignals from "@/components/dashboard/IntentSignals";
import Notifications from "@/components/dashboard/Notifications";
import DataCard from "@/components/ui/DataCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HubspotConnect from "@/components/hubspot/HubspotConnect";

const Dashboard = () => {
  const { isAuthenticated, contacts, accounts, isConnecting, connectToHubspot } = useHubspot();
  const navigate = useNavigate();
  
  // Calculate summary metrics if authenticated
  const highPriorityCount = isAuthenticated ? contacts.filter(c => c.priorityLevel === "high").length : 0;
  const highPriorityPercent = isAuthenticated && contacts.length > 0 
    ? Math.round((highPriorityCount / contacts.length) * 100) 
    : 0;
  
  const activeDealsCount = isAuthenticated ? accounts.reduce((sum, account) => sum + account.activeDeals, 0) : 0;
  const averagePenetration = isAuthenticated && accounts.length > 0
    ? Math.round(accounts.reduce((sum, account) => sum + account.penetrationScore, 0) / accounts.length)
    : 0;
    
  const recentSignalsCount = isAuthenticated ? contacts.flatMap(c => 
    c.intentSignals.filter(s => 
      new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
  ).length : 0;
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              {isAuthenticated ? (
                <>Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</>
              ) : (
                <>Not connected to HubSpot</>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6">
          {!isAuthenticated ? (
            <div className="max-w-2xl mx-auto my-8">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Connect to HubSpot</h2>
                    <p className="text-muted-foreground">
                      Connect your HubSpot account to see your leads, accounts, and intent signals.
                    </p>
                  </div>
                  <HubspotConnect />
                </CardContent>
              </Card>
              
              <div className="mt-8 bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Dashboard Preview</h3>
                <p className="text-muted-foreground mb-4">
                  Once connected, you'll see data for:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-card p-4 rounded-md border">
                    <h4 className="font-medium">Priority Leads</h4>
                    <p className="text-sm text-muted-foreground">See your highest priority contacts</p>
                  </div>
                  <div className="bg-card p-4 rounded-md border">
                    <h4 className="font-medium">Account Penetration</h4>
                    <p className="text-sm text-muted-foreground">Analyze your account engagement levels</p>
                  </div>
                  <div className="bg-card p-4 rounded-md border">
                    <h4 className="font-medium">Sales Funnel</h4>
                    <p className="text-sm text-muted-foreground">Track your deals through the pipeline</p>
                  </div>
                  <div className="bg-card p-4 rounded-md border">
                    <h4 className="font-medium">Intent Signals</h4>
                    <p className="text-sm text-muted-foreground">Detect buying signals from your contacts</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <DataCard
                  title="High Priority Leads"
                  value={highPriorityCount}
                  description={`${highPriorityPercent}% of total contacts`}
                  icon="chart"
                  trend={5}
                />
                <DataCard
                  title="Active Deals"
                  value={activeDealsCount}
                  description="Across all accounts"
                  icon="activity"
                  trend={3}
                />
                <DataCard
                  title="Avg. Account Penetration"
                  value={`${averagePenetration}%`}
                  description="Opportunity score"
                  icon="trending-up"
                  trend={2}
                />
                <DataCard
                  title="Recent Intent Signals"
                  value={recentSignalsCount}
                  description="Last 7 days"
                  icon="trending-up"
                  trend={12}
                />
              </div>
              
              <Tabs defaultValue="overview" className="mb-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AccountPenetration />
                        <SalesFunnel />
                      </div>
                      <IntentSignals />
                    </div>
                    <div className="space-y-6">
                      <PriorityLeads />
                      <Notifications />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map(contact => (
                      <div key={contact.id} className="card-interactive">
                        <a href={`/contacts/${contact.id}`}>
                          <Card className="h-full">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                                  <p className="text-sm text-muted-foreground">{contact.title}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">Priority Score</span>
                                  <span className="text-xs font-medium">{contact.score}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full" 
                                    style={{ width: `${contact.score}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="mt-3 flex justify-between">
                                <div className="text-xs text-muted-foreground">{contact.company}</div>
                                <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  contact.priorityLevel === "high" ? "bg-alert-100 text-alert-600" :
                                  contact.priorityLevel === "medium" ? "bg-warning-100 text-warning-600" :
                                  "bg-success-100 text-success-600"
                                }`}>
                                  {contact.priorityLevel}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="accounts" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map(account => (
                      <div key={account.id} className="card-interactive">
                        <a href={`/accounts/${account.id}`}>
                          <Card className="h-full">
                            <CardContent className="p-4">
                              <h3 className="text-lg font-medium mb-2">{account.name}</h3>
                              <div className="flex justify-between mb-3">
                                <div className="text-sm">{account.industry}</div>
                                <div className="text-sm text-muted-foreground">{account.size}</div>
                              </div>
                              <div className="mb-3">
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">Penetration</span>
                                  <span className="text-xs font-medium">{account.penetrationScore}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full" 
                                    style={{ width: `${account.penetrationScore}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Contacts</span>
                                  <span className="font-medium">{account.contacts.length}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Deals</span>
                                  <span className="font-medium">{account.activeDeals}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Stage</span>
                                  <span className={`text-xs px-2 py-0.5 mt-0.5 rounded-full capitalize ${
                                    account.stage === "closed_won" ? "bg-success-100 text-success-600" :
                                    account.stage === "negotiation" ? "bg-warning-100 text-warning-600" :
                                    "bg-neutral-100 text-neutral-600"
                                  }`}>
                                    {account.stage.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
