
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../types/intentTypes";
import { processCSVData, createCSVPreview } from "./utils/csvParser";
import { saveToSupabase, fetchSupabaseData } from "./utils/supabaseOperations";
import { downloadIntentData, isValidCSVFile } from "./utils/fileOperations";
import { supabase } from "@/integrations/supabase/client";

export const useIntentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<IntentData[]>([]);
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [savedToSupabase, setSavedToSupabase] = useState(false);
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Check if user is authenticated with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session);
        }
      );
      
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    };
    
    checkAuth();
  }, []);

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
          
          // Save to Supabase if option is selected and user is authenticated
          if (saveToDatabase && isAuthenticated) {
            const { data: saveData, error: saveError } = await saveToSupabase(processedData);
            
            if (saveError) {
              console.error("Error saving to Supabase:", saveError);
              toast({
                title: "Processing Successful",
                description: `Processed ${processedData.length} records. Data loaded for visualization but could not be saved to database: ${saveError.message}`,
                variant: "destructive",
              });
            } else {
              setSavedToSupabase(true);
              toast({
                title: "Processing Successful",
                description: `Processed and saved ${processedData.length} intent records from ${selectedFile.name}.`,
                variant: "default",
              });
            }
          } else if (!saveToDatabase) {
            toast({
              title: "Processing Successful",
              description: `Processed ${processedData.length} records. Data loaded for visualization only (not saved to database).`,
              variant: "default",
            });
          } else if (!isAuthenticated) {
            toast({
              title: "Login Required",
              description: `Processed ${processedData.length} records. Please login to save data to the database.`,
              variant: "default", // Changed from "warning" to "default"
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

  // Enhanced fetch function with date filtering
  const fetchFilteredData = async (date?: string) => {
    try {
      const data = await fetchSupabaseData(date);
      if (data && data.length > 0) {
        setIntentData(data);
        setUploadSuccess(true);
        setShowAnalysis(true);
        return data;
      } else {
        toast({
          title: "No Data Found",
          description: date ? `No data found for ${date}` : "No data found in the database",
          variant: "default", // Changed from "warning" to "default"
        });
        return [];
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "Error Loading Data",
        description: "Could not load data from database",
        variant: "destructive",
      });
      return [];
    }
  };

  const downloadData = () => {
    downloadIntentData(intentData);
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const toggleSaveOption = () => {
    setSaveToDatabase(!saveToDatabase);
  };

  const handleDateFilterChange = (date: string | null) => {
    setDateFilter(date);
    if (date) {
      fetchFilteredData(date);
    }
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
    saveToDatabase,
    isAuthenticated,
    dateFilter,
    handleFileChange,
    handleUpload,
    toggleAnalysis,
    fetchFilteredData,
    downloadData,
    toggleSaveOption,
    handleDateFilterChange
  };
};
