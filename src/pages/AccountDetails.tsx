import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHubspot } from "@/context/hubspot";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Users, Mail, Phone, Globe, Calendar, Target, TrendingUp, MapPin, Briefcase, BarChart3, Clock, FileBarChart } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ContactRoleMapping from "@/components/dashboard/accounts/ContactRoleMapping";
import CloudProviderAnalysis from "@/components/dashboard/accounts/CloudProviderAnalysis";
import LeadCard from "@/components/ui/LeadCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Account } from "@/context/hubspot";

const stageBadgeStyles: Record<Account['stage'], string> = {
  awareness: "bg-neutral-100 text-neutral-700",
  prospecting: "bg-neutral-100 text-neutral-700",
  qualification: "bg-blue-100 text-blue-700",
  demo: "bg-blue-100 text-blue-700",
  proposal: "bg-warning-100 text-warning-700",
  negotiation: "bg-warning-100 text-warning-700",
  closed_won: "bg-success-100 text-success-700",
  closed_lost: "bg-alert-100 text-alert-700"
};

const AccountDetails = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts, isAuthenticated, isConnecting } = useHubspot();
  const navigate = useNavigate();
  
  // Memoize account lookup for performance
  const account = useMemo(() => {
    return accounts.find(a => a.id === accountId);
  }, [accounts, accountId]);
  
  useEffect(() => {
    if (!isConnecting && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isConnecting, navigate]);
  
  const goBack = () => {
    navigate(-1);
  };
  
  // Show loading state
  if (isConnecting) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  // Show not found state
  if (!isAuthenticated || !account) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Account Not Found</CardTitle>
              <CardDescription>
                The requested account could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
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
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{account.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 mr-1" />
                  <a 
                    href={`https://${account.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {account.website}
                  </a>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <Badge className={`text-xs px-3 py-1 rounded-full uppercase ${stageBadgeStyles[account.stage]}`}>
                  {account.stage.replace("_", " ")}
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
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Company Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Industry</dt>
                    <dd className="font-medium">{account.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Company Size</dt>
                    <dd className="font-medium">{account.size}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total Revenue</dt>
                    <dd className="font-medium">${account.totalRevenue.toLocaleString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <FileBarChart className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Engagement Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Penetration Score</dt>
                    <dd>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${account.penetrationScore}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{account.penetrationScore}%</span>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Active Deals</dt>
                    <dd className="font-medium">{account.activeDeals}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Total Deals</dt>
                    <dd className="font-medium">{account.totalDeals}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">Stage changed to {account.stage.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Users className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm">New contact added</p>
                      <p className="text-xs text-muted-foreground">5 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="contacts">
            <TabsList>
              <TabsTrigger value="contacts">
                <Users className="h-4 w-4 mr-2" />
                Contacts ({account.contacts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="deals">
                <FileBarChart className="h-4 w-4 mr-2" />
                Deals ({account.activeDeals || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts" className="mt-6">
              {account.contacts && account.contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {account.contacts.map(contact => (
                    <LeadCard key={contact.id} contact={contact} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No contacts found for this account</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="deals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deals</CardTitle>
                  <CardDescription>
                    Current deals in progress with {account.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {account.activeDeals > 0 ? (
                    <div className="space-y-4">
                      {[...Array(account.activeDeals)].map((_, i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Deal #{i + 1}</h4>
                            <span className="text-sm text-muted-foreground">${(account.totalRevenue / account.activeDeals).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Enterprise Package</p>
                          <div className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${Math.random() * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{account.stage.replace("_", " ")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No active deals</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AccountDetails;
