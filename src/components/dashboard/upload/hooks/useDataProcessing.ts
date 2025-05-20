
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../../types/intentTypes";
import { processCSVData } from "../utils/csvParser";
import { saveToSupabase } from "../utils/supabase";

export const useDataProcessing = () => {
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [savedToSupabase, setSavedToSupabase] = useState(false);
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const { toast } = useToast();

  const processFile = async (file: File, weekLabel: string): Promise<boolean> => {
    if (!file) return false;
    
    setIsProcessing(true);
    setSavedToSupabase(false);
    
    try {
      // Process the file data
      const reader = new FileReader();
      
      return new Promise<boolean>((resolve) => {
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
            
            // Save to Supabase if option is selected
            if (saveToDatabase) {
              const { data: saveData, error: saveError } = await saveToSupabase(processedData, weekLabel);
              
              if (saveError) {
                console.error("Error saving to Supabase:", saveError);
                toast({
                  title: "Processing Successful",
                  description: `Processed ${processedData.length} records. Data loaded for visualization but could not be saved to database: ${saveError.message}`,
                  variant: "destructive",
                });
                resolve(false);
              } else {
                setSavedToSupabase(true);
                
                toast({
                  title: "Processing Successful",
                  description: `Processed and saved ${processedData.length} intent records from ${file.name} for ${weekLabel}.`,
                  variant: "default",
                });
                resolve(true);
              }
            } else {
              toast({
                title: "Processing Successful",
                description: `Processed ${processedData.length} records. Data loaded for visualization only (not saved to database).`,
                variant: "default",
              });
              resolve(true);
            }
          } catch (err: any) {
            console.error("Error processing file:", err);
            toast({
              title: "Error Processing File",
              description: err.message || "Failed to process the file. Please check the format.",
              variant: "destructive",
            });
            resolve(false);
          } finally {
            setIsProcessing(false);
          }
        };
        
        reader.onerror = () => {
          toast({
            title: "Error Reading File",
            description: "Failed to read the file",
            variant: "destructive",
          });
          setIsProcessing(false);
          resolve(false);
        };
        
        reader.readAsText(file);
      });
    } catch (err: any) {
      console.error("Error in upload:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to process the file. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
  };

  const toggleSaveOption = () => {
    setSaveToDatabase(!saveToDatabase);
  };

  return {
    intentData,
    setIntentData,
    isProcessing,
    uploadSuccess,
    savedToSupabase,
    saveToDatabase,
    processFile,
    toggleSaveOption
  };
};
