import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Filter, 
  Search, 
  Flame, 
  AlertTriangle,
  Building2,
  Calendar,
  Zap,
  Eye,
  MessageSquare,
  Star,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GTMAccount {
  // HubSpot Data
  id: string;
  name: string;
  domain: string;
  industry: string;
  lifecycleStage: string;
  ownerId: string;
  ownerName: string;
  pageViews: number;
  createdDate: string;
  
  // Intent Data Match
  intentMatch: boolean;
  intentScore: number;
  intentTopics: string[];
  intentCategories: string[];
  lastIntentSignal: string | null;
  
  // AI Analysis
  opportunityScore: 'High' | 'Medium' | 'Low';
  bestEntryPoint: string;
  messagingStrategy: string;
  marketingPersona: string;
  abmRecommendation: boolean;
  contentRecommendations: string[];
}

interface GTMFilters {
  owner: string;
  intentScore: string;
  opportunityScore: string;
  industry: string;
  lifecycleStage: string;
  searchTerm: string;
}

const GTMIntelligenceDashboard = () => {
  const [accounts, setAccounts] = useState<GTMAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<GTMAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GTMAccount | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'hot-accounts' | 'intent-signals' | 'high-opportunity' | 'accounts-insights'>('overview');
  const [filters, setFilters] = useState<GTMFilters>({
    owner: '',
    intentScore: '',
    opportunityScore: '',
    industry: '',
    lifecycleStage: '',
    searchTerm: ''
  });
  const { toast } = useToast();

  // Load HubSpot accounts and match with intent data
  const loadAccountIntelligence = async () => {
    setIsLoading(true);
    try {
      // Fetch HubSpot data from webhook URL stored in settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('setting_key', 'n8n_webhook_url')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!settingsData?.setting_value) {
        throw new Error('No webhook URL configured');
      }

      const hubspotResponse = await fetch(settingsData.setting_value, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'gtm-intelligence' })
      });

      const hubspotData = await hubspotResponse.json();
      const companies = Array.isArray(hubspotData) ? hubspotData : hubspotData.companies || [];
      
      console.log('Companies from n8n:', companies.length, companies.slice(0, 2));

      // Fetch intent data
      const { data: intentData } = await supabase
        .from('intent_data')
        .select('*')
        .order('date', { ascending: false });

      // Process and match data - Show ALL companies first, then enhance with intent data
      const processedAccounts: GTMAccount[] = companies
        .filter((company: any) => company.name) // Only include companies with names
        .map((company: any) => {
          // Find intent matches by domain or website (optional enhancement)
          const companyDomain = company.domain !== 'N/A' ? company.domain : company.website;
          const domainMatches = intentData?.filter(intent => 
            intent.website && companyDomain && companyDomain !== 'N/A' &&
            (intent.website.includes(companyDomain) || companyDomain.includes(intent.website))
          ) || [];

          const hasIntentMatch = domainMatches.length > 0;
          const avgIntentScore = hasIntentMatch ? 
            Math.round(domainMatches.reduce((sum, match) => sum + match.score, 0) / domainMatches.length) : 0;

          return {
            id: company.id || `company-${Math.random()}`,
            name: company.name,
            domain: company.domain !== 'N/A' ? company.domain : (company.website !== 'N/A' ? company.website : 'No domain'),
            industry: company.industry !== 'N/A' ? company.industry : 'Unknown',
            lifecycleStage: company.lifecycleStage || 'subscriber',
            ownerId: company.ownerId !== 'N/A' ? company.ownerId : 'unassigned',
            ownerName: getOwnerDisplayName(company.ownerId !== 'N/A' ? company.ownerId : null, company.ownerName),
            pageViews: typeof company.pageViews === 'number' ? company.pageViews : 0,
            createdDate: company.createdDate,
            intentMatch: hasIntentMatch,
            intentScore: avgIntentScore,
            intentTopics: [...new Set(domainMatches.map(m => m.topic))],
            intentCategories: [...new Set(domainMatches.map(m => m.category))],
            lastIntentSignal: hasIntentMatch ? domainMatches[0]?.date : null,
            // Default AI analysis values - these would be enhanced by AI
            opportunityScore: calculateOpportunityScore(company, avgIntentScore, hasIntentMatch),
            bestEntryPoint: 'Technical Decision Maker',
            messagingStrategy: 'Focus on operational efficiency and ROI',
            marketingPersona: 'IT Operations Manager',
            abmRecommendation: avgIntentScore > 70 || company.lifecycleStage === 'opportunity',
            contentRecommendations: ['Product Demo', 'ROI Calculator', 'Case Studies']
          };
        });

      // Sort by priority
      const sortedAccounts = processedAccounts.sort((a, b) => {
        const scoreA = (a.intentScore * 2) + a.pageViews + (a.lifecycleStage === 'opportunity' ? 100 : 0);
        const scoreB = (b.intentScore * 2) + b.pageViews + (b.lifecycleStage === 'opportunity' ? 100 : 0);
        return scoreB - scoreA;
      });

      setAccounts(sortedAccounts);
      setFilteredAccounts(sortedAccounts);
      
      toast({
        title: "Intelligence Loaded",
        description: `Loaded ${sortedAccounts.length} accounts (${sortedAccounts.filter(acc => acc.intentMatch).length} with intent signals)`,
      });
    } catch (error) {
      console.error('Error loading account intelligence:', error);
      toast({
        title: "Error",
        description: "Failed to load account intelligence",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOwnerDisplayName = (ownerId: string, ownerName?: string) => {
    if (ownerName) return ownerName;
    const ownerMap: { [key: string]: string } = {
      '76269911': 'Brian Roy',
      '680170754': 'David Hamilton',
    };
    return ownerMap[ownerId] || `Owner ${ownerId}`;
  };

  const calculateOpportunityScore = (company: any, intentScore: number, hasIntent: boolean): 'High' | 'Medium' | 'Low' => {
    const score = (intentScore * 2) + (company.pageViews || 0) + (hasIntent ? 50 : 0);
    if (score > 150 || company.lifecycleStage === 'opportunity') return 'High';
    if (score > 75 || company.lifecycleStage === 'lead') return 'Medium';
    return 'Low';
  };

  const enhanceWithAI = async (account: GTMAccount) => {
    setSelectedAccount(account);
    setIsAnalyzing(true);

    try {
      const response = await fetch('https://hqyrwktqdzmdgzpyxpya.functions.supabase.co/company-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          companyData: account,
          analysisType: 'gtm-intelligence'
        })
      });

      const data = await response.json();
      
      // Update account with AI insights
      const updatedAccount = {
        ...account,
        bestEntryPoint: data.bestEntryPoint || account.bestEntryPoint,
        messagingStrategy: data.messagingStrategy || account.messagingStrategy,
        marketingPersona: data.marketingPersona || account.marketingPersona,
        contentRecommendations: data.contentRecommendations || account.contentRecommendations
      };

      setSelectedAccount(updatedAccount);
    } catch (error) {
      console.error('Error enhancing with AI:', error);
      toast({
        title: "Error",
        description: "Failed to enhance account with AI insights",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = accounts;

    if (filters.searchTerm) {
      filtered = filtered.filter(account => 
        account.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        account.domain.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.owner) {
      filtered = filtered.filter(account => account.ownerName === filters.owner);
    }

    if (filters.intentScore) {
      if (filters.intentScore === 'high') filtered = filtered.filter(account => account.intentScore > 70);
      if (filters.intentScore === 'medium') filtered = filtered.filter(account => account.intentScore >= 30 && account.intentScore <= 70);
      if (filters.intentScore === 'low') filtered = filtered.filter(account => account.intentScore < 30);
      if (filters.intentScore === 'none') filtered = filtered.filter(account => !account.intentMatch);
    }

    if (filters.opportunityScore) {
      filtered = filtered.filter(account => account.opportunityScore === filters.opportunityScore);
    }

    if (filters.lifecycleStage) {
      filtered = filtered.filter(account => account.lifecycleStage === filters.lifecycleStage);
    }

    setFilteredAccounts(filtered);
  }, [accounts, filters]);

  const getScoreBadgeColor = (score: 'High' | 'Medium' | 'Low') => {
    switch (score) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getIntentBadgeColor = (score: number) => {
    if (score > 70) return 'bg-red-100 text-red-800';
    if (score > 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const hotAccounts = filteredAccounts.filter(acc => 
    acc.opportunityScore === 'High' && acc.intentMatch && acc.intentScore > 60
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              <div>
                <CardTitle>B2B GTM Intelligence</CardTitle>
                <CardDescription>
                  Prioritize accounts based on HubSpot data + intent signals for sales & marketing teams
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadAccountIntelligence} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh Intelligence'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveView('accounts-insights')}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                AI Targeting Insights
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveView('hot-accounts')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Flame className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{hotAccounts.length}</p>
                  <p className="text-xs text-muted-foreground">Hot Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveView('intent-signals')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {filteredAccounts.filter(acc => acc.intentMatch).length}
                  </p>
                  <p className="text-xs text-muted-foreground">With Intent Signals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveView('high-opportunity')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {filteredAccounts.filter(acc => acc.opportunityScore === 'High').length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Opportunity</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{filteredAccounts.length}</p>
                  <p className="text-xs text-muted-foreground">Total Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content - Different Views */}
      {accounts.length > 0 && (
        <>
          {activeView === 'overview' && (
            <>
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search accounts..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={filters.owner || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, owner: value === "all" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Owners</SelectItem>
                        <SelectItem value="Brian Roy">Brian Roy</SelectItem>
                        <SelectItem value="David Hamilton">David Hamilton</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.intentScore || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, intentScore: value === "all" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Intent Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Intent</SelectItem>
                        <SelectItem value="high">High (70+)</SelectItem>
                        <SelectItem value="medium">Medium (30-70)</SelectItem>
                        <SelectItem value="low">Low (&lt;30)</SelectItem>
                        <SelectItem value="none">No Intent</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.opportunityScore || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, opportunityScore: value === "all" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Opportunity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Opportunity</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.lifecycleStage || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, lifecycleStage: value === "all" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="opportunity">Opportunity</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="subscriber">Subscriber</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        owner: '', 
                        intentScore: '', 
                        opportunityScore: '', 
                        industry: '', 
                        lifecycleStage: '', 
                        searchTerm: ''
                      })}
                    >
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.slice(0, 20).map((account) => (
                  <Card 
                    key={account.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => enhanceWithAI(account)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium leading-tight flex items-center gap-2">
                            {account.name}
                            {account.intentMatch && account.intentScore > 60 && (
                              <Flame className="h-4 w-4 text-red-500" />
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{account.domain}</p>
                        </div>
                        <Badge className={getScoreBadgeColor(account.opportunityScore)}>
                          {account.opportunityScore}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-medium">{account.ownerName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Stage:</span>
                        <Badge variant="secondary" className="text-xs">
                          {account.lifecycleStage}
                        </Badge>
                      </div>
                      
                      {account.intentMatch ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Intent Score:</span>
                            <Badge className={getIntentBadgeColor(account.intentScore)}>
                              {account.intentScore}
                            </Badge>
                          </div>
                          
                          {account.intentTopics.length > 0 && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Topics: </span>
                              <span className="font-medium">
                                {account.intentTopics.slice(0, 2).join(', ')}
                                {account.intentTopics.length > 2 && ` +${account.intentTopics.length - 2} more`}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3 w-3" />
                          No intent signals
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {account.pageViews} views
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Hot Accounts View */}
          {activeView === 'hot-accounts' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-red-500" />
                    <div>
                      <CardTitle>Hot Accounts ({hotAccounts.length})</CardTitle>
                      <CardDescription>Accounts with high opportunity score + strong intent signals (60+)</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView('overview')}>
                    ← Back to Overview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => enhanceWithAI(account)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium flex items-center gap-2">
                            {account.name}
                            <Flame className="h-4 w-4 text-red-500" />
                          </h3>
                          <p className="text-sm text-muted-foreground">{account.domain} • {account.industry}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getIntentBadgeColor(account.intentScore)}>
                            Intent: {account.intentScore}
                          </Badge>
                          <Badge className={getScoreBadgeColor(account.opportunityScore)}>
                            {account.opportunityScore}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Topics: </span>
                        {account.intentTopics.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intent Signals View */}
          {activeView === 'intent-signals' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-orange-500" />
                    <div>
                      <CardTitle>Accounts with Intent Signals ({filteredAccounts.filter(acc => acc.intentMatch).length})</CardTitle>
                      <CardDescription>All accounts showing buying intent based on research behavior</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView('overview')}>
                    ← Back to Overview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAccounts.filter(acc => acc.intentMatch).map((account) => (
                    <div key={account.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => enhanceWithAI(account)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">{account.domain} • {account.industry}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getIntentBadgeColor(account.intentScore)}>
                            Score: {account.intentScore}
                          </Badge>
                          <Badge variant="secondary">{account.lifecycleStage}</Badge>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Intent Topics: </span>
                          {account.intentTopics.join(', ')}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Signal: </span>
                          {account.lastIntentSignal ? new Date(account.lastIntentSignal).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* High Opportunity View */}
          {activeView === 'high-opportunity' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle>High Opportunity Accounts ({filteredAccounts.filter(acc => acc.opportunityScore === 'High').length})</CardTitle>
                      <CardDescription>Accounts scored as high opportunity based on multiple signals</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView('overview')}>
                    ← Back to Overview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAccounts.filter(acc => acc.opportunityScore === 'High').map((account) => (
                    <div key={account.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => enhanceWithAI(account)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium flex items-center gap-2">
                            {account.name}
                            {account.intentMatch && <Zap className="h-4 w-4 text-orange-500" />}
                          </h3>
                          <p className="text-sm text-muted-foreground">{account.domain} • {account.industry}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getScoreBadgeColor(account.opportunityScore)}>
                            High Opportunity
                          </Badge>
                          {account.intentMatch && (
                            <Badge className={getIntentBadgeColor(account.intentScore)}>
                              Intent: {account.intentScore}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Owner: </span>
                          {account.ownerName}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stage: </span>
                          {account.lifecycleStage}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Page Views: </span>
                          {account.pageViews}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accounts AI Insights Tab */}
          {activeView === 'accounts-insights' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <div>
                      <CardTitle>Zyter AI Targeting Intelligence</CardTitle>
                      <CardDescription>AI-powered insights on how Zyter can target different account types</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView('overview')}>
                    ← Back to Overview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="healthcare">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                    <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                    <TabsTrigger value="technology">Technology</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="healthcare" className="space-y-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Healthcare Provider Targeting
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-medium text-blue-900">Primary Targets</h5>
                            <p className="text-blue-700">Large health systems (500+ beds) with existing digital transformation initiatives</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-900">Key Decision Makers</h5>
                            <p className="text-green-700">CIOs, CMIOs, VP of Clinical Operations, Population Health Directors</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h5 className="font-medium text-purple-900">Messaging Focus</h5>
                            <p className="text-purple-700">Patient engagement, care coordination, clinical workflow optimization, value-based care outcomes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="enterprise" className="space-y-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Enterprise Account Strategy
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="bg-red-50 p-3 rounded-lg">
                            <h5 className="font-medium text-red-900">High-Value Targets</h5>
                            <p className="text-red-700">Fortune 1000 companies with complex operational workflows and customer experience challenges</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <h5 className="font-medium text-yellow-900">Entry Points</h5>
                            <p className="text-yellow-700">Digital transformation initiatives, customer success teams, operations optimization projects</p>
                          </div>
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <h5 className="font-medium text-indigo-900">Value Proposition</h5>
                            <p className="text-indigo-700">AI-powered automation, scalable customer engagement, operational efficiency gains</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="technology" className="space-y-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Technology Integration Approach
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="bg-cyan-50 p-3 rounded-lg">
                            <h5 className="font-medium text-cyan-900">Technical Fit</h5>
                            <p className="text-cyan-700">Organizations with existing cloud infrastructure, API-first architecture, and data integration capabilities</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h5 className="font-medium text-orange-900">Integration Partners</h5>
                            <p className="text-orange-700">Salesforce, Microsoft, AWS, Google Cloud - leverage existing partnerships for warm introductions</p>
                          </div>
                          <div className="bg-teal-50 p-3 rounded-lg">
                            <h5 className="font-medium text-teal-900">Technical Value</h5>
                            <p className="text-teal-700">Low-code/no-code deployment, pre-built integrations, scalable AI infrastructure</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="strategy" className="space-y-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Account Prioritization Strategy
                        </h4>
                        <div className="space-y-4">
                          <div className="border-l-4 border-red-500 pl-4">
                            <h5 className="font-medium text-red-700">Tier 1: Hot Accounts (ABM Focus)</h5>
                            <p className="text-sm text-muted-foreground">High intent + high opportunity + active buying signals</p>
                            <p className="text-sm">Personalized outreach, executive engagement, custom demos</p>
                          </div>
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h5 className="font-medium text-orange-700">Tier 2: Intent Signals (Nurture)</h5>
                            <p className="text-sm text-muted-foreground">Active research but no clear buying timeline</p>
                            <p className="text-sm">Educational content, webinars, case studies, gentle follow-up</p>
                          </div>
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-blue-700">Tier 3: High Opportunity (Awareness)</h5>
                            <p className="text-sm text-muted-foreground">Good fit profile but no current intent signals</p>
                            <p className="text-sm">Thought leadership, industry events, referral programs</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Quick Navigation */}
          {activeView !== 'overview' && (
            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveView('accounts-insights')}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    AI Targeting Insights
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveView('hot-accounts')}
                    className="flex items-center gap-2"
                  >
                    <Flame className="h-4 w-4" />
                    Hot Accounts ({hotAccounts.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveView('intent-signals')}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Intent Signals ({filteredAccounts.filter(acc => acc.intentMatch).length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* AI Analysis Modal */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              GTM Intelligence: {selectedAccount?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-6">
              {/* Account Overview */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Account Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Domain:</span>
                        <span>{selectedAccount.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry:</span>
                        <span>{selectedAccount.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stage:</span>
                        <Badge variant="secondary">{selectedAccount.lifecycleStage}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Owner:</span>
                        <span>{selectedAccount.ownerName}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Intent Intelligence</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Intent Score:</span>
                        <Badge className={getIntentBadgeColor(selectedAccount.intentScore)}>
                          {selectedAccount.intentScore || 'No Signal'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Topics:</span>
                        <span>{selectedAccount.intentTopics.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Signal:</span>
                        <span>{selectedAccount.lastIntentSignal ? new Date(selectedAccount.lastIntentSignal).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Tabs defaultValue="sales">
                <TabsList>
                  <TabsTrigger value="sales">Sales Strategy</TabsTrigger>
                  <TabsTrigger value="marketing">Marketing Strategy</TabsTrigger>
                  <TabsTrigger value="content">Content Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="space-y-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Best Entry Point
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedAccount.bestEntryPoint}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Messaging Strategy
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedAccount.messagingStrategy}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="marketing" className="space-y-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Target Persona
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedAccount.marketingPersona}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        ABM Recommendation
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedAccount.abmRecommendation ? "default" : "secondary"}>
                          {selectedAccount.abmRecommendation ? "Run ABM Campaign" : "Standard Marketing"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {selectedAccount.abmRecommendation ? "High value account" : "Include in broader campaigns"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="content">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-3">Recommended Content by Role</h4>
                      <div className="space-y-2">
                        {selectedAccount.contentRecommendations.map((content, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            {content}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GTMIntelligenceDashboard;