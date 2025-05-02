
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData } from "../types/intentTypes";

export const useIntentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<IntentData[]>([]);
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const { toast } = useToast();

  const transformRowToIntentData = (row: Record<string, string>): IntentData => {
    return {
      intentId: row['Intent ID'] || '',
      date: row['Date'] || '',
      companyName: row['Company Name'] || '',
      topic: row['Topic'] || '',
      category: row['Category'] || '',
      score: parseInt(row['Score'] || '0'),
      companyId: row['Company ID'] || '',
      website: row['Website'] || '',
      foundedYear: row['Founded Year'] || '',
      companyHQPhone: row['Company HQ Phone'] || '',
      revenue: row['Revenue (in 000s USD)'] || '',
      primaryIndustry: row['Primary Industry'] || '',
      primarySubIndustry: row['Primary Sub-Industry'] || '',
      allIndustries: row['All Industries'] || '',
      allSubIndustries: row['All Sub-Industries'] || '',
      industryHierarchicalCategory: row['Industry Hierarchical Category'] || '',
      secondaryIndustryHierarchicalCategory: row['Secondary Industry Hierarchical Category'] || '',
      alexaRank: row['Alexa Rank'] || '',
      employees: row['Employees'] || '',
      linkedInUrl: row['LinkedIn Company Profile URL'] || '',
      facebookUrl: row['Facebook Company Profile URL'] || '',
      twitterUrl: row['Twitter Company Profile URL'] || '',
      certifiedActiveCompany: row['Certified Active Company'] || '',
      certificationDate: row['Certification Date'] || '',
      totalFundingAmount: row['Total Funding Amount (in 000s USD)'] || '',
      recentFundingAmount: row['Recent Funding Amount (in 000s USD)'] || '',
      recentFundingRound: row['Recent Funding Round'] || '',
      recentFundingDate: row['Recent Funding Date'] || '',
      recentInvestors: row['Recent Investors'] || '',
      allInvestors: row['All Investors'] || '',
      companyStreetAddress: row['Company Street Address'] || '',
      companyCity: row['Company City'] || '',
      companyState: row['Company State'] || '',
      companyZipCode: row['Company Zip Code'] || '',
      companyCountry: row['Company Country'] || '',
      fullAddress: row['Full Address'] || '',
      numberOfLocations: row['Number of Locations'] || '',
      queryName: row['Query Name'] || '',
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreviewData([]);
    
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError("Please upload a CSV file");
        return;
      }
      
      setSelectedFile(file);
      
      // Preview the file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          
          // Get headers
          const headers = rows[0].split(',');
          
          // Process a few rows for preview
          const previewRows = rows.slice(1, 4).map(row => {
            const values = row.split(',');
            const rowData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              rowData[header.trim()] = values[index]?.trim() || '';
            });
            
            return transformRowToIntentData(rowData);
          });
          
          setPreviewData(previewRows);
        } catch (err) {
          console.error("Error parsing CSV:", err);
          setError("Failed to parse CSV. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };
  
  const processCSVData = (text: string): IntentData[] => {
    try {
      const rows = text.split('\n');
      
      // Get headers
      const headers = rows[0].split(',');
      
      // Process all rows for full analysis
      const processedData = rows.slice(1).map(row => {
        if (!row.trim()) return null;
        
        const values = row.split(',');
        const rowData: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index]?.trim() || '';
        });
        
        return transformRowToIntentData(rowData);
      }).filter(Boolean) as IntentData[];
      
      return processedData;
    } catch (err) {
      console.error("Error parsing CSV:", err);
      return [];
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Process the file data
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const processedData = processCSVData(text);
          
          if (processedData.length === 0) {
            throw new Error("No valid data found in the file");
          }
          
          setIntentData(processedData);
          setUploadSuccess(true);
          setShowAnalysis(true);
          
          toast({
            title: "Upload Successful",
            description: `Processed ${processedData.length} intent records from ${selectedFile.name}.`,
          });
        } catch (err) {
          console.error("Error processing file:", err);
          setError("Failed to process the file. Please check the format.");
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the file");
        setIsProcessing(false);
      };
      
      reader.readAsText(selectedFile);
      
    } catch (err) {
      console.error("Error in upload:", err);
      setError("Failed to process the file. Please try again.");
      setIsProcessing(false);
    }
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
    handleFileChange,
    handleUpload,
    toggleAnalysis
  };
};
