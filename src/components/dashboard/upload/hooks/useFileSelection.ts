
import { useState } from "react";
import { IntentData } from "../../types/intentTypes";
import { isValidCSVFile } from "../utils/fileOperations";
import { createCSVPreview } from "../utils/csvParser";

export const useFileSelection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<IntentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreviewData([]);
    
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

  return {
    selectedFile,
    previewData,
    error,
    setError,
    handleFileChange,
  };
};
