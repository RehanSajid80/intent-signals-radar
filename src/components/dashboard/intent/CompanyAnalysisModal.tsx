import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, TrendingUp, Users, Target } from "lucide-react";
import { IntentData } from "../types/intentTypes";

interface CompanyAnalysisModalProps {
  company: string | null;
  companyData: IntentData[];
  isOpen: boolean;
  onClose: () => void;
}

const CompanyAnalysisModal: React.FC<CompanyAnalysisModalProps> = ({
  company,
  companyData,
  isOpen,
  onClose
}) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompany = async () => {
    if (!company || companyData.length === 0) return;

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      // Calculate company metrics
      const totalSignals = companyData.length;
      const avgScore = companyData.reduce((sum, item) => sum + item.score, 0) / totalSignals;
      const topTopics = companyData
        .reduce((acc, item) => {
          acc[item.topic] = (acc[item.topic] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const sortedTopics = Object.entries(topTopics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      const categories = [...new Set(companyData.map(item => item.category))];
      const highScoreSignals = companyData.filter(item => item.score >= 70).length;

      const companyAnalysisData = {
        company,
        totalSignals,
        avgScore: Math.round(avgScore * 10) / 10,
        topTopics: sortedTopics,
        categories,
        highScoreSignals,
        recentActivity: companyData.slice(-5)
      };

      const response = await fetch('https://hqyrwktqdzmdgzpyxpya.functions.supabase.co/company-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyData: companyAnalysisData,
          analysisType: 'intent'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze company');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing company:', error);
      setAnalysis('Failed to generate analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!company) return null;

  const totalSignals = companyData.length;
  const avgScore = totalSignals > 0 ? companyData.reduce((sum, item) => sum + item.score, 0) / totalSignals : 0;
  const highScoreSignals = companyData.filter(item => item.score >= 70).length;
  const categories = [...new Set(companyData.map(item => item.category))];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Intent Analysis: {company}
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of intent signals and recommendations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Signals</p>
              <p className="font-medium">{totalSignals}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="font-medium">{avgScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Score Signals</p>
              <p className="font-medium">{highScoreSignals}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="font-medium">{categories.length}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">AI Analysis & Recommendations</h4>
              <Button 
                onClick={analyzeCompany}
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
                    Analyze
                  </>
                )}
              </Button>
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Analyzing intent signals...</span>
              </div>
            ) : analysis ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{analysis}</pre>
              </div>
            ) : (
              <p className="text-muted-foreground">Click "Analyze" to get AI-powered insights on this company's intent signals.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyAnalysisModal;