
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../types/intentTypes";
import { processCSVData, createCSVPreview } from "./utils/csvParser";
import { saveToSupabase, fetchSupabaseData } from "./utils/supabaseOperations";
import { downloadIntentData, isValidCSVFile } from "./utils/fileOperations";

export const useIntentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<IntentData[]>([]);
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [savedToSupabase, setSavedToSupabase] = useState(false);
  
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreviewData([]);
    setSavedToSupabase(false);
    
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!isValidCSVFile(file)) {
        setError("Please upload a CSV file");
        return;
      }
      
      setSelectedFile(file);
      
      // Preview the file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const previewRows = createCSVPreview(text);
          setPreviewData(previewRows);
        } catch (err: any) {
          console.error("Error parsing CSV:", err);
          setError(err.message || "Failed to parse CSV. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSavedToSupabase(false);
    
    try {
      // Process the file data
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const processedData = processCSVData(text);
          
          if (processedData.length === 0) {
            throw new Error("No valid data found in the file");
          }
          
          // Set the data for visualization
          setIntentData(processedData);
          setUploadSuccess(true);
          setShowAnalysis(true);
          
          // Try to save to Supabase
          const { data: saveData, error: saveError } = await saveToSupabase(processedData);
          
          if (saveError) {
            console.error("Error saving to Supabase:", saveError);
            toast({
              title: "Processing Successful",
              description: `Processed ${processedData.length} records. Data loaded for visualization but could not be saved to database: ${saveError.message}`,
            });
          } else {
            setSavedToSupabase(true);
            toast({
              title: "Processing Successful",
              description: `Processed and saved ${processedData.length} intent records from ${selectedFile.name}.`,
              variant: "default",
            });
          }
        } catch (err: any) {
          console.error("Error processing file:", err);
          setError(err.message || "Failed to process the file. Please check the format.");
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the file");
        setIsProcessing(false);
      };
      
      reader.readAsText(selectedFile);
      
    } catch (err: any) {
      console.error("Error in upload:", err);
      setError(err.message || "Failed to process the file. Please try again.");
      setIsProcessing(false);
    }
  };

  const downloadData = () => {
    downloadIntentData(intentData);
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  return {
    selectedFile,
    uploadSuccess,
    error,
    isProcessing,
    previewData,
    intentData,
    showAnalysis,
    savedToSupabase,
    handleFileChange,
    handleUpload,
    toggleAnalysis,
    fetchSupabaseData,
    downloadData
  };
};
