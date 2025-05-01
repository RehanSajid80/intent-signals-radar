
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Cloud, CheckCircle2, XCircle, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Updated CloudProviderDetails type to make it consistent
type CloudProviderDetails = {
  aws: string;
  azure: string;
  googleCloud: string;
  oracle: string;
};

// Updated CloudProviders type to include the optional details property
type CloudProviders = {
  aws?: boolean;
  azure?: boolean;
  googleCloud?: boolean;
  oracle?: boolean;
  details?: CloudProviderDetails;
};

type AnalyzedAccount = {
  id: string;
  name: string;
  url: string;
  cloudProviders: CloudProviders;
};

const ELEVANCE_DATA: CloudProviderDetails = {
  aws: "Infrastructure and data engineering for scalable, secure environments.",
  azure: "Hosting and network presence across geographical points-of-presence.",
  googleCloud: "Data engineering and analytics, integrated with Snowflake for data warehousing.",
  oracle: "Human Capital Management (HCM) for performance and goal management."
};

const CloudProviderAnalysis = () => {
  const { accounts } = useHubspot();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedAccounts, setAnalyzedAccounts] = useState<AnalyzedAccount[]>([]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) {
      toast({
        title: "Error",
        description: "Please enter both URL and account name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, showing Elevance Health data
      const mockResult: AnalyzedAccount = {
        id: Date.now().toString(),
        name,
        url,
        cloudProviders: {
          aws: true,
          azure: true,
          googleCloud: true,
          oracle: true,
          details: ELEVANCE_DATA
        }
      };

      setAnalyzedAccounts(prev => [mockResult, ...prev]);

      toast({
        title: "Success",
        description: "Cloud providers detected for " + name,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze cloud providers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUrl('');
      setName('');
    }
  };

  const displayAccounts = [
    ...analyzedAccounts,
    ...accounts.filter(account => account.cloudProviders)
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Provider Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLookup} className="flex gap-4 mb-6">
          <Input
            placeholder="Account name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            type="url"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Analyzing..."
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </form>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer Name</TableHead>
                <TableHead className="text-center">AWS Client</TableHead>
                <TableHead className="text-center">Azure</TableHead>
                <TableHead className="text-center">Google Cloud</TableHead>
                <TableHead className="text-center">Oracle Cloud</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayAccounts.length > 0 ? (
                displayAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {account.cloudProviders?.aws ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            {account.cloudProviders?.details && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{account.cloudProviders.details.aws}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </>
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {account.cloudProviders?.azure ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            {account.cloudProviders?.details && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{account.cloudProviders.details.azure}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </>
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {account.cloudProviders?.googleCloud ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            {account.cloudProviders?.details && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{account.cloudProviders.details.googleCloud}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </>
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {account.cloudProviders?.oracle ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            {account.cloudProviders?.details && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{account.cloudProviders.details.oracle}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </>
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No cloud provider analysis data yet. Enter an account name and URL to analyze.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudProviderAnalysis;
