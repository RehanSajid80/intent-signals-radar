
import { useEffect } from "react";
import { IntentData } from "../types/intentTypes";
import { useFileSelection } from "./hooks/useFileSelection";
import { useDataProcessing } from "./hooks/useDataProcessing";
import { useWeekManagement } from "./hooks/useWeekManagement";
import { useDataFiltering } from "./hooks/useDataFiltering";
import { useAnalysisView } from "./hooks/useAnalysisView";

export const useIntentUpload = () => {
  // Combine all the smaller hooks
  const {
    selectedFile,
    previewData,
    error,
    setError,
    handleFileChange
  } = useFileSelection();

  const {
    intentData,
    setIntentData,
    isProcessing,
    uploadSuccess,
    savedToSupabase,
    saveToDatabase,
    processFile,
    toggleSaveOption
  } = useDataProcessing();

  const {
    weekLabel,
    availableWeeks,
    weekFilter,
    handleWeekLabelChange,
    handleWeekFilterChange,
    refreshAvailableWeeks
  } = useWeekManagement();

  const {
    dateFilter,
    handleDateFilterChange,
    fetchFilteredData
  } = useDataFiltering(setIntentData);

  const {
    showAnalysis,
    toggleAnalysis,
    downloadData
  } = useAnalysisView(intentData);

  // Load initial data when component mounts
  useEffect(() => {
    fetchFilteredData();
  }, []);

  // Handle the upload operation
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    setError(null);
    
    const success = await processFile(selectedFile, weekLabel);
    
    if (success) {
      // Update available weeks after successful upload to database
      await refreshAvailableWeeks();
    }
  };

  return {
    // File selection
    selectedFile,
    previewData,
    error,
    handleFileChange,
    
    // Data processing
    intentData,
    isProcessing,
    uploadSuccess,
    savedToSupabase,
    saveToDatabase,
    
    // Week management
    weekLabel,
    availableWeeks,
    weekFilter,
    
    // Data filtering
    dateFilter,
    
    // View control
    showAnalysis,
    
    // Action handlers
    handleUpload,
    toggleAnalysis,
    fetchFilteredData,
    downloadData,
    toggleSaveOption,
    handleDateFilterChange,
    handleWeekLabelChange,
    handleWeekFilterChange,
    
    // For backward compatibility
    isAuthenticated: true, // Always return true to skip authentication checks in UI
  };
};
