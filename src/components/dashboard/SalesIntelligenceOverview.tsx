import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Loader2, AlertCircle, Building2, TrendingUp, Eye, Calendar, Users, Target, Zap, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  name: string;
  domain: string;
  industry: string;
  lifecycleStage: string;
  createdDate: string;
  ownerId: string;
  pageViews: number;
  intentScore: number;
  intentSegments: string[];
  buyingStage: string;
  qaStart: string;
  qaEnd: string;
  qaAge: string;
  is6QA: boolean;
}

interface ApiResponse {
  companies: Company[];
}

const SalesIntelligenceOverview = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebhookUrl();
  }, []);

  const fetchWebhookUrl = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let data, error;
      
      if (user) {
        // User is logged in, get their specific setting
        const result = await supabase
          .from('user_settings')
          .select('setting_value')
          .eq('user_id', user.id)
          .eq('setting_key', 'n8n_webhook_url')
          .single();
        data = result.data;
        error = result.error;
      } else {
        // No user logged in, get the global setting (user_id = null)
        const result = await supabase
          .from('user_settings')
          .select('setting_value')
          .eq('setting_key', 'n8n_webhook_url')
          .is('user_id', null)
          .single();
        data = result.data;
        error = result.error;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching webhook URL:', error);
        return;
      }

      if (data?.setting_value) {
        setWebhookUrl(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching webhook URL:', error);
    }
  };

  const handleFetchData = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please configure your n8n webhook URL in Settings first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'lovable-dashboard'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data from webhook:', data);
      
      let companies: Company[] = [];
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // Check if it's an array of companies directly
        if (data.length > 0 && data[0].name) {
          companies = data;
        }
        // Check if it's wrapped in an array with companies property
        else if (data.length > 0 && data[0].companies) {
          companies = data[0].companies;
        }
      } else if (data && data.companies) {
        // Single object with companies property
        companies = data.companies;
      }
      
      if (companies.length > 0) {
        // Sort by priority: high page views, intent score, and recent activity
        const sortedCompanies = companies.sort((a, b) => {
          const scoreA = a.pageViews + (a.intentScore * 10);
          const scoreB = b.pageViews + (b.intentScore * 10);
          return scoreB - scoreA;
        });
        
        setCompanies(sortedCompanies);
        toast({
          title: "Success",
          description: `Fetched ${sortedCompanies.length} companies from n8n`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from n8n webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityLevel = (company: Company) => {
    const score = company.pageViews + (company.intentScore * 10);
    if (score > 100 || company.lifecycleStage === 'opportunity') return 'high';
    if (score > 20 || company.lifecycleStage === 'lead') return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getLifecycleStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'customer': return 'bg-green-500';
      case 'opportunity': return 'bg-blue-500';
      case 'lead': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp || timestamp === 'N/A') return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  const analyzeCompany = async (company: Company) => {
    setSelectedCompany(company);
    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const response = await fetch('https://hqyrwktqdzmdgzpyxpya.functions.supabase.co/company-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyData: company })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze company');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing company:', error);
      toast({
        title: "Error",
        description: "Failed to analyze company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Sales Intelligence Overview</CardTitle>
        </div>
        <CardDescription>
          Your prioritized account pipeline - focus on the companies that matter most
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button 
            onClick={handleFetchData} 
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Refresh Pipeline
              </>
            )}
          </Button>
        </div>

        {companies.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Active Pipeline ({companies.length} companies)
              </h3>
              <Badge variant="outline" className="bg-blue-50">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.slice(0, 12).map((company, index) => {
                const priority = getPriorityLevel(company);
                return (
                  <Card 
                    key={index} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                    style={{ borderLeftColor: getLifecycleStageColor(company.lifecycleStage).replace('bg-', '#') }}
                    onClick={() => analyzeCompany(company)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium leading-tight">
                            {company.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {company.domain && company.domain !== 'N/A' ? company.domain : 'No website'}
                          </p>
                        </div>
                        <Badge className={`${getPriorityColor(priority)} text-xs ml-2`}>
                          {priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span>{company.industry !== 'N/A' ? company.industry.replace(/_/g, ' ') : 'Unknown'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          <span>{company.pageViews} page views</span>
                        </div>
                        
                        {company.intentScore > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <Zap className="h-3 w-3 text-orange-500" />
                            <span className="text-orange-600">Intent Score: {company.intentScore}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="text-xs">
                            {company.lifecycleStage}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              analyzeCompany(company);
                            }}
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {companies.length > 12 && (
              <div className="text-center pt-2">
                <Badge variant="outline">
                  +{companies.length - 12} more companies available
                </Badge>
              </div>
            )}
          </div>
        )}

        {companies.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No companies in your pipeline yet.</p>
            <p className="text-sm">Connect your n8n webhook to start seeing intelligence.</p>
          </div>
        )}

        {/* Company Analysis Dialog */}
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Sales Intelligence: {selectedCompany?.name}
              </DialogTitle>
              <DialogDescription>
                AI-powered analysis and recommendations for this account
              </DialogDescription>
            </DialogHeader>
            
            {selectedCompany && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{selectedCompany.industry.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <p className="font-medium">{selectedCompany.lifecycleStage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="font-medium">{selectedCompany.pageViews}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intent Score</p>
                    <p className="font-medium">{selectedCompany.intentScore}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">AI Analysis & Recommendations</h4>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Analyzing company data...</span>
                    </div>
                  ) : analysis ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm">{analysis}</pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Click "Analyze" to get AI-powered insights.</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SalesIntelligenceOverview;