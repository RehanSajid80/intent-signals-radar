
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalyzedAccount, ELEVANCE_DATA } from "@/types/cloudProviders";

interface CloudProviderLookupFormProps {
  onAnalysisComplete: (account: AnalyzedAccount) => void;
}

export const CloudProviderLookupForm = ({ onAnalysisComplete }: CloudProviderLookupFormProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      onAnalysisComplete(mockResult);

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

  return (
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
  );
};
