import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, AlertCircle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const CompanyDataFetcher = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();

  const handleFetchData = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter your n8n webhook URL",
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

      const data: ApiResponse[] = await response.json();
      
      // Extract companies from the first response object
      if (data && data.length > 0 && data[0].companies) {
        setCompanies(data[0].companies);
        toast({
          title: "Success",
          description: `Fetched ${data[0].companies.length} companies from n8n`,
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

  const getLifecycleStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'opportunity':
        return 'bg-blue-100 text-blue-800';
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp || timestamp === 'N/A') return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>Company Intelligence Fetcher</CardTitle>
        </div>
        <CardDescription>
          Fetch enriched company data with intent signals from your n8n workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="webhook-url">n8n Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-n8n-instance.com/webhook/your-endpoint"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleFetchData} 
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Fetch Data
                </>
              )}
            </Button>
          </div>
        </div>

        {companies.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Companies ({companies.length})
              </h3>
              <Badge variant="outline">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Lifecycle Stage</TableHead>
                    <TableHead>Page Views</TableHead>
                    <TableHead>Intent Score</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>
                        {company.domain && company.domain !== 'N/A' ? (
                          <a 
                            href={`https://${company.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.domain}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {company.industry !== 'N/A' ? company.industry.replace(/_/g, ' ') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLifecycleStageColor(company.lifecycleStage)}>
                          {company.lifecycleStage}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.pageViews}</TableCell>
                      <TableCell>
                        {company.intentScore > 0 ? (
                          <Badge variant="secondary">{company.intentScore}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(company.createdDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {companies.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No company data fetched yet. Enter your webhook URL and click "Fetch Data".</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDataFetcher;