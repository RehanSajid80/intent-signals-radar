
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Cloud, CheckCircle2, XCircle, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type AnalyzedAccount = {
  id: string;
  name: string;
  url: string;
  cloudProviders: {
    aws: boolean;
    azure: boolean;
    googleCloud: boolean;
    oracle: boolean;
  }
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
      // For demo purposes, we'll simulate the lookup with random results
      // In a real application, this would make an API call to analyze the website
      const mockResult: AnalyzedAccount = {
        id: Date.now().toString(), // Generate a unique ID
        name,
        url,
        cloudProviders: {
          aws: Math.random() > 0.5,
          azure: Math.random() > 0.5,
          googleCloud: Math.random() > 0.5,
          oracle: Math.random() > 0.5,
        }
      };

      // Add the analyzed account to our local state
      setAnalyzedAccounts(prev => [mockResult, ...prev]);

      toast({
        title: "Success",
        description: "Cloud providers detected for " + name,
      });

      // Log for debugging
      console.log("Cloud provider analysis result:", mockResult);
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

  // Combine analyzed accounts with accounts from context that have cloudProviders data
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
                      {account.cloudProviders?.aws ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.cloudProviders?.azure ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.cloudProviders?.googleCloud ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.cloudProviders?.oracle ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
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
