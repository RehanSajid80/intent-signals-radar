import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IntentData } from "../types/intentTypes";
import { Target, TrendingUp, Building2, Star, ArrowRight, Brain, Loader2, Eye } from "lucide-react";

interface ZyterOpportunityAnalysisProps {
  data: IntentData[];
}

const ZyterOpportunityAnalysis: React.FC<ZyterOpportunityAnalysisProps> = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Define Zyter's relevant categories and topics based on their healthcare technology focus
  const zyterRelevantCategories = [
    'HOSPITAL & HEALTH CARE',
    'HOSPITAL HEALTH CARE', 
    'INSURANCE',
    'HEALTH CARE PLANS',
    'MEDICAL DEVICES',
    'PHARMACEUTICALS',
    'BIOTECHNOLOGY',
    'HEALTH INFORMATION TECHNOLOGY'
  ];

  const zyterRelevantTopics = [
    'healthcare technology',
    'population health',
    'care management', 
    'managed care',
    'healthcare analytics',
    'patient engagement',
    'healthcare automation',
    'AI in healthcare',
    'digital health',
    'healthcare outcomes',
    'care coordination',
    'health data',
    'telehealth',
    'remote patient monitoring',
    'clinical workflows',
    'healthcare integration',
    'value-based care',
    'health information systems'
  ];

  // Filter and score companies based on relevance to Zyter
  const analyzeOpportunities = () => {
    const companyScores = data.reduce((acc, item) => {
      const companyName = item.companyName;
      
      if (!acc[companyName]) {
        acc[companyName] = {
          company: companyName,
          totalScore: 0,
          relevantSignals: 0,
          categories: new Set(),
          topics: new Set(),
          avgScore: 0,
          maxScore: 0,
          zyterRelevanceScore: 0
        };
      }

      const company = acc[companyName];
      company.totalScore += item.score;
      company.relevantSignals += 1;
      company.categories.add(item.category);
      company.topics.add(item.topic);
      company.maxScore = Math.max(company.maxScore, item.score);

      // Calculate Zyter relevance score
      let relevanceMultiplier = 1;
      
      // Higher multiplier for healthcare-related categories
      if (zyterRelevantCategories.some(cat => 
        item.category.toUpperCase().includes(cat.toUpperCase()) ||
        cat.toUpperCase().includes(item.category.toUpperCase())
      )) {
        relevanceMultiplier += 2;
      }

      // Higher multiplier for relevant topics
      if (zyterRelevantTopics.some(topic => 
        item.topic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(item.topic.toLowerCase())
      )) {
        relevanceMultiplier += 1.5;
      }

      company.zyterRelevanceScore += item.score * relevanceMultiplier;

      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and sort by Zyter relevance
    const opportunities = Object.values(companyScores).map((company: any) => ({
      ...company,
      avgScore: company.totalScore / company.relevantSignals,
      categories: Array.from(company.categories),
      topics: Array.from(company.topics),
      zyterRelevanceScore: company.zyterRelevanceScore / company.relevantSignals
    }));

    return opportunities
      .filter(opp => opp.zyterRelevanceScore > opp.avgScore) // Only show companies with above-average relevance
      .sort((a, b) => b.zyterRelevanceScore - a.zyterRelevanceScore);
  };

  const opportunities = analyzeOpportunities();
  const displayedOpportunities = showAll ? opportunities : opportunities.slice(0, 10);

  const getRelevanceLevel = (score: number) => {
    if (score >= 150) return { level: 'Excellent', color: 'bg-green-500' };
    if (score >= 100) return { level: 'High', color: 'bg-blue-500' };
    if (score >= 70) return { level: 'Good', color: 'bg-yellow-500' };
    return { level: 'Moderate', color: 'bg-gray-500' };
  };

  const getZyterAdvantage = (categories: string[], topics: string[]) => {
    const advantages = [];

    if (categories.some(cat => cat.toUpperCase().includes('HOSPITAL') || cat.toUpperCase().includes('HEALTH'))) {
      advantages.push('Healthcare expertise & TruCare platform');
    }
    if (categories.some(cat => cat.toUpperCase().includes('INSURANCE'))) {
      advantages.push('Managed care solutions & cost reduction');
    }
    if (topics.some(topic => topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('automation'))) {
      advantages.push('AI Orchestration & workflow automation');
    }
    if (topics.some(topic => topic.toLowerCase().includes('analytics') || topic.toLowerCase().includes('data'))) {
      advantages.push('Digital platform & data integration');
    }
    if (topics.some(topic => topic.toLowerCase().includes('population') || topic.toLowerCase().includes('outcomes'))) {
      advantages.push('Outcomes Orchestrator™ for population health');
    }

    return advantages.length > 0 ? advantages : ['Digital transformation & expert services'];
  };

  const handleDeepDive = (opportunity: any) => {
    setSelectedCompany(opportunity);
    setIsDeepDiveOpen(true);
    setAnalysis('');
  };

  const analyzeZyterOpportunity = async () => {
    if (!selectedCompany) return;

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const companyData = data.filter(item => item.companyName === selectedCompany.company);
      
      const analysisPayload = {
        company: selectedCompany.company,
        zyterRelevanceScore: selectedCompany.zyterRelevanceScore,
        relevantSignals: selectedCompany.relevantSignals,
        avgScore: selectedCompany.avgScore,
        categories: selectedCompany.categories,
        topics: selectedCompany.topics,
        advantages: getZyterAdvantage(selectedCompany.categories, selectedCompany.topics),
        relevanceLevel: getRelevanceLevel(selectedCompany.zyterRelevanceScore).level,
        companyIntentData: companyData,
        zyterFocus: 'healthcare technology, AI orchestration, managed care solutions, population health'
      };

      const response = await fetch('https://hqyrwktqdzmdgzpyxpya.functions.supabase.co/company-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyData: analysisPayload,
          analysisType: 'zyter-opportunity'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze Zyter opportunity');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing Zyter opportunity:', error);
      setAnalysis('Failed to generate analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Zyter Sales Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No high-relevance opportunities found in current intent data. Upload more healthcare-focused intent data to see targeted recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Zyter Sales Opportunities
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Companies showing intent signals that align with Zyter's healthcare technology, AI orchestration, and managed care solutions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedOpportunities.map((opportunity, index) => {
            const relevance = getRelevanceLevel(opportunity.zyterRelevanceScore);
            const advantages = getZyterAdvantage(opportunity.categories, opportunity.topics);

            return (
              <div key={opportunity.company} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </Badge>
                    <div>
                      <h3 className="font-semibold text-lg">{opportunity.company}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${relevance.color} text-white text-xs`}>
                          {relevance.level} Fit
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {opportunity.relevantSignals} signals • Avg Score: {opportunity.avgScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{opportunity.zyterRelevanceScore.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Relevance Score</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Zyter's Competitive Advantages:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {advantages.map((advantage, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {advantage}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">INTENT CATEGORIES:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.categories.slice(0, 3).map((cat: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                      {opportunity.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{opportunity.categories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">TOP INTENT TOPICS:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.topics.slice(0, 2).map((topic: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {opportunity.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{opportunity.topics.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deep Dive Button */}
                <div className="flex justify-end pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeepDive(opportunity)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Zyter Deep Dive
                  </Button>
                </div>
              </div>
            );
          })}

          {opportunities.length > 10 && (
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2"
              >
                {showAll ? (
                  <>Show Top 10</>
                ) : (
                  <>
                    Show All {opportunities.length} Opportunities
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Next Steps for Sales Team:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Focus on companies with "Excellent" or "High" fit scores first</li>
              <li>• Lead with Zyter's TruCare platform for healthcare organizations</li>
              <li>• Emphasize AI Orchestration for companies showing automation intent</li>
              <li>• Position Outcomes Orchestrator™ for managed care cost reduction needs</li>
              <li>• Leverage expert services for digital transformation initiatives</li>
            </ul>
          </div>
        </div>

        {/* Zyter Deep Dive Modal */}
        <Dialog open={isDeepDiveOpen} onOpenChange={setIsDeepDiveOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Zyter Deep Dive Analysis: {selectedCompany?.company}
              </DialogTitle>
              <DialogDescription>
                AI-powered analysis of how Zyter.com can showcase information and leverage this opportunity
              </DialogDescription>
            </DialogHeader>
            
            {selectedCompany && (
              <div className="space-y-6">
                {/* Company Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Relevance Score</p>
                    <p className="font-bold text-lg text-primary">{selectedCompany.zyterRelevanceScore.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fit Level</p>
                    <p className="font-medium">{getRelevanceLevel(selectedCompany.zyterRelevanceScore).level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Signals</p>
                    <p className="font-medium">{selectedCompany.relevantSignals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="font-medium">{selectedCompany.avgScore.toFixed(1)}</p>
                  </div>
                </div>

                {/* Intent Categories & Topics */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Intent Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.categories.map((cat: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Intent Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.topics.map((topic: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Zyter Advantages */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Zyter's Competitive Advantages for this Opportunity
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getZyterAdvantage(selectedCompany.categories, selectedCompany.topics).map((advantage: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {advantage}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">AI Analysis: Zyter Opportunity Strategy</h4>
                    <Button 
                      onClick={analyzeZyterOpportunity}
                      disabled={isAnalyzing}
                      size="sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate Strategy
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Generating Zyter-specific opportunity analysis...</span>
                    </div>
                  ) : analysis ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/30 p-4 rounded border">{analysis}</pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Click "Generate Strategy" to get AI-powered insights on how Zyter.com can leverage this opportunity, 
                      including specific positioning, messaging, and showcase strategies.
                    </p>
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

export default ZyterOpportunityAnalysis;