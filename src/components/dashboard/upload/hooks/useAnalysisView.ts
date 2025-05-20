
import { useState } from "react";
import { IntentData } from "../../types/intentTypes";
import { downloadIntentData } from "../utils/fileOperations";

export const useAnalysisView = (intentData: IntentData[]) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const downloadData = () => {
    downloadIntentData(intentData);
  };

  return {
    showAnalysis,
    toggleAnalysis,
    downloadData
  };
};
