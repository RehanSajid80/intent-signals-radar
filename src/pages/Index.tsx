
import { useHubspot } from "@/context/HubspotContext";
import HubspotConnect from "@/components/hubspot/HubspotConnect";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated } = useHubspot();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-500">
                Lead Priority Radar
              </h1>
            </div>
            <div>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <a 
                  href="https://app.hubspot.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Go to HubSpot
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Connect to HubSpot Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Connect Your HubSpot Account
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Unlock powerful lead prioritization and intent detection by connecting your HubSpot account.
                </p>
              </div>
              
              <HubspotConnect />
            </div>
            
            {/* Dashboard Preview Section */}
            <div className="mt-16">
              <h3 className="text-xl font-semibold text-center mb-8">Dashboard Preview</h3>
              
              <div className="bg-muted/30 rounded-lg p-6 border border-dashed border-muted-foreground/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Sample Data Cards */}
                  <Card className="bg-card/60">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground">last 30 days</span>
                        </div>
                        <h4 className="text-sm font-medium">High Priority Leads</h4>
                        <div className="text-2xl font-bold text-foreground/80">--</div>
                        <div className="text-xs text-muted-foreground">Connect to view data</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/60">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground">current</span>
                        </div>
                        <h4 className="text-sm font-medium">Active Deals</h4>
                        <div className="text-2xl font-bold text-foreground/80">--</div>
                        <div className="text-xs text-muted-foreground">Connect to view data</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/60">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground">average</span>
                        </div>
                        <h4 className="text-sm font-medium">Account Penetration</h4>
                        <div className="text-2xl font-bold text-foreground/80">--%</div>
                        <div className="text-xs text-muted-foreground">Connect to view data</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/60">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground">last 7 days</span>
                        </div>
                        <h4 className="text-sm font-medium">Intent Signals</h4>
                        <div className="text-2xl font-bold text-foreground/80">--</div>
                        <div className="text-xs text-muted-foreground">Connect to view data</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Chart Previews */}
                  <Card className="bg-card/60 col-span-2">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3">Sales Funnel</h4>
                      <div className="h-40 w-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p>Connect to view sales funnel data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/60">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3">Priority Leads</h4>
                      <div className="h-40 w-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p>Connect to view lead data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Lead Prioritization</h3>
                <p className="text-sm text-muted-foreground">
                  Identify your most valuable leads with our weighted scoring model that analyzes engagement, company details, and more.
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Account Penetration</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your penetration level within target accounts and identify opportunities for deeper engagement.
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Intent Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Detect buying signals based on website behavior, content engagement, and other key indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-neutral-50 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Lead Priority Radar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
