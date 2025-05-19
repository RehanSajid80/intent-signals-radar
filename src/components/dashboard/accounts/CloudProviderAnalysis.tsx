import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";
import { Cloud } from "lucide-react";
import { CloudProviderLookupForm } from "./CloudProviderLookupForm";
import { CloudProviderTable } from "./CloudProviderTable";
import { AnalyzedAccount } from "@/types/cloudProviders";

const CloudProviderAnalysis = () => {
  const { accounts } = useHubspot();
  const [analyzedAccounts, setAnalyzedAccounts] = useState<AnalyzedAccount[]>([]);

  const handleAnalysisComplete = (newAccount: AnalyzedAccount) => {
    setAnalyzedAccounts(prev => [newAccount, ...prev]);
  };

  const displayAccounts = [
    ...analyzedAccounts,
    ...accounts.filter(account => account.cloudProviders)
  ] as AnalyzedAccount[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Provider Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CloudProviderLookupForm onAnalysisComplete={handleAnalysisComplete} />
        <CloudProviderTable accounts={displayAccounts} />
      </CardContent>
    </Card>
  );
};

export default CloudProviderAnalysis;
