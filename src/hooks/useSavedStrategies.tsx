import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SavedStrategy {
  id: string;
  company_name: string;
  strategy_title: string;
  analysis_content: string;
  analysis_type: string;
  created_at: string;
  updated_at: string;
}

export const useSavedStrategies = () => {
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveStrategy = async (
    companyName: string,
    analysisContent: string,
    customTitle?: string
  ) => {
    try {
      setIsLoading(true);
      
      const title = customTitle || `${companyName} Strategy - ${new Date().toLocaleDateString()}`;
      
      const { data, error } = await supabase
        .from('saved_strategies')
        .insert({
          company_name: companyName,
          strategy_title: title,
          analysis_content: analysisContent,
          analysis_type: 'zyter-opportunity'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Strategy Saved",
        description: `Successfully saved strategy for ${companyName}`,
      });

      return data;
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast({
        title: "Error",
        description: "Failed to save strategy. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedStrategies = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('saved_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedStrategies(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching saved strategies:', error);
      toast({
        title: "Error",
        description: "Failed to load saved strategies.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStrategy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedStrategies(prev => prev.filter(strategy => strategy.id !== id));
      
      toast({
        title: "Strategy Deleted",
        description: "Successfully deleted the strategy.",
      });
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast({
        title: "Error",
        description: "Failed to delete strategy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    savedStrategies,
    isLoading,
    saveStrategy,
    fetchSavedStrategies,
    deleteStrategy
  };
};