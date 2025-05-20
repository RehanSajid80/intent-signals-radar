
import { useState, useCallback } from "react";
import { IntentData } from "../../types/intentTypes";
import { downloadIntentData } from "../utils/fileOperations";
import { useToast } from "@/hooks/use-toast";

export const useAnalysisView = (intentData: IntentData[]) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [lastDownloadError, setLastDownloadError] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleAnalysis = useCallback(() => {
    setShowAnalysis(!showAnalysis);
  }, [showAnalysis]);

  const downloadData = useCallback(() => {
    try {
      if (intentData.length === 0) {
        toast({
          title: "No Data",
          description: "There is no data to download",
          variant: "default",
        });
        return;
      }
      
      downloadIntentData(intentData);
      
      toast({
        title: "Download Started",
        description: "Your data is being downloaded",
        variant: "default",
      });
      
      // Reset error state on success
      setLastDownloadError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Only show error toast if we haven't shown this exact error before
      if (lastDownloadError !== errorMessage) {
        console.error("Error downloading data:", error);
        toast({
          title: "Download Failed",
          description: "Failed to download data",
          variant: "destructive",
        });
        setLastDownloadError(errorMessage);
      }
    }
  }, [intentData, toast, lastDownloadError]);

  return {
    showAnalysis,
    toggleAnalysis,
    downloadData
  };
};
