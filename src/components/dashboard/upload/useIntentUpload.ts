import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IntentData, DbIntentData } from "../types/intentTypes";
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
  
  const { toast } = useToast();

  const transformRowToIntentData = (row: Record<string, string>): IntentData => {
    return {
      intentId: row['Intent ID'] || '',
      date: row['Date'] || '',
      companyName: row['Company Name'] || '',
      topic: row['Topic'] || '',
      category: row['Category'] || '',
      score: parseInt(row['Score'] || '0'),
      website: row['Website'] || '',
      secondaryIndustryHierarchicalCategory: row['Secondary Industry Hierarchical Category'] || '',
      alexaRank: row['Alexa Rank'] || '',
      employees: row['Employees'] || '',
      companyId: row['Company ID'] || '',
      foundedYear: row['Founded Year'] || '',
      companyHQPhone: row['Company HQ Phone'] || '',
      revenue: row['Revenue (in 000s USD)'] || '',
      primaryIndustry: row['Primary Industry'] || '',
      primarySubIndustry: row['Primary Sub-Industry'] || '',
      allIndustries: row['All Industries'] || '',
      allSubIndustries: row['All Sub-Industries'] || '',
      industryHierarchicalCategory: row['Industry Hierarchical Category'] || '',
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
    setSavedToSupabase(false);
    
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
          
          // First, try to detect the format of the CSV
          const rows = text.split('\n');
          if (rows.length < 2) {
            throw new Error("CSV file is empty or invalid");
          }
          
          // Get headers - check if they match expected format
          const headers = rows[0].split(',').map(h => h.trim());
          const requiredHeaders = ['Date', 'Company Name', 'Topic', 'Category', 'Score'];
          const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
          
          if (!hasRequiredHeaders) {
            console.log("Expected headers: ", requiredHeaders);
            console.log("Found headers: ", headers);
            setError("CSV file must contain these columns: Date, Company Name, Topic, Category, Score");
            return;
          }
          
          // Process a few rows for preview
          const previewRows = rows.slice(1, 4).map(row => {
            if (!row.trim()) return null; // Skip empty rows
            
            const values = row.split(',');
            const rowData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              rowData[header] = values[index]?.trim() || '';
            });
            
            // Map to our expected format
            return {
              intentId: '', // Generate later
              date: rowData['Date'] || '',
              companyName: rowData['Company Name'] || '',
              topic: rowData['Topic'] || '',
              category: rowData['Category'] || '',
              score: parseInt(rowData['Score'] || '0'),
              website: rowData['Website'] || '',
              secondaryIndustryHierarchicalCategory: rowData['Secondary Industry Hierarchical Category'] || '',
              alexaRank: rowData['Alexa Rank'] || '',
              employees: rowData['Employees'] || '',
              // Fill other fields as empty strings
              companyId: '',
              foundedYear: '',
              companyHQPhone: '',
              revenue: '',
              primaryIndustry: '',
              primarySubIndustry: '',
              allIndustries: '',
              allSubIndustries: '',
              industryHierarchicalCategory: '',
              linkedInUrl: '',
              facebookUrl: '',
              twitterUrl: '',
              certifiedActiveCompany: '',
              certificationDate: '',
              totalFundingAmount: '',
              recentFundingAmount: '',
              recentFundingRound: '',
              recentFundingDate: '',
              recentInvestors: '',
              allInvestors: '',
              companyStreetAddress: '',
              companyCity: '',
              companyState: '',
              companyZipCode: '',
              companyCountry: '',
              fullAddress: '',
              numberOfLocations: '',
              queryName: '',
            };
          }).filter(Boolean) as IntentData[];
          
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
      if (rows.length < 2) {
        throw new Error("CSV file is empty or invalid");
      }
      
      // Get headers
      const headers = rows[0].split(',').map(h => h.trim());
      const requiredHeaders = ['Date', 'Company Name', 'Topic', 'Category', 'Score'];
      const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
      
      if (!hasRequiredHeaders) {
        throw new Error("CSV file must contain these columns: Date, Company Name, Topic, Category, Score");
      }
      
      // Process all rows for full analysis
      const processedData = rows.slice(1).map(row => {
        if (!row.trim()) return null; // Skip empty rows
        
        const values = row.split(',');
        const rowData: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          rowData[header] = values[index]?.trim() || '';
        });
        
        // Map to our expected format
        return {
          intentId: '', // Generate later
          date: rowData['Date'] || '',
          companyName: rowData['Company Name'] || '',
          topic: rowData['Topic'] || '',
          category: rowData['Category'] || '',
          score: parseInt(rowData['Score'] || '0'),
          website: rowData['Website'] || '',
          secondaryIndustryHierarchicalCategory: rowData['Secondary Industry Hierarchical Category'] || '',
          alexaRank: rowData['Alexa Rank'] || '',
          employees: rowData['Employees'] || '',
          // Fill other fields as empty strings
          companyId: '',
          foundedYear: '',
          companyHQPhone: '',
          revenue: '',
          primaryIndustry: '',
          primarySubIndustry: '',
          allIndustries: '',
          allSubIndustries: '',
          industryHierarchicalCategory: '',
          linkedInUrl: '',
          facebookUrl: '',
          twitterUrl: '',
          certifiedActiveCompany: '',
          certificationDate: '',
          totalFundingAmount: '',
          recentFundingAmount: '',
          recentFundingRound: '',
          recentFundingDate: '',
          recentInvestors: '',
          allInvestors: '',
          companyStreetAddress: '',
          companyCity: '',
          companyState: '',
          companyZipCode: '',
          companyCountry: '',
          fullAddress: '',
          numberOfLocations: '',
          queryName: '',
        };
      }).filter(Boolean) as IntentData[];
      
      return processedData;
    } catch (err) {
      console.error("Error parsing CSV:", err);
      throw err;
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

  const saveToSupabase = async (intentDataArray: IntentData[]) => {
    try {
      // Get the user ID first, outside of the map function
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;
      
      // Convert to Supabase format - keeping only fields that exist in the database
      const supabaseRows = intentDataArray.map(item => ({
        date: item.date,
        company_name: item.companyName,
        topic: item.topic,
        category: item.category,
        score: item.score,
        // Use the userId variable we got above
        user_id: userId
      }));
      
      // Log what we're trying to insert to help with debugging
      console.log("Attempting to insert data:", supabaseRows[0]);
      
      // Insert data in batches to avoid request size limitations
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < supabaseRows.length; i += batchSize) {
        const batch = supabaseRows.slice(i, i + batchSize);
        batches.push(batch);
      }
      
      let errors = [];
      let totalInserted = 0;
      
      for (const batch of batches) {
        const { data, error } = await supabase
          .from('intent_data')
          .insert(batch)
          .select('id');
        
        if (error) {
          errors.push(error);
          console.error("Error inserting batch:", error);
        } else if (data) {
          totalInserted += data.length;
        }
      }
      
      if (errors.length > 0) {
        // If we had some successful inserts but some failed
        if (totalInserted > 0) {
          return { 
            data: { inserted: totalInserted }, 
            error: new Error(`${errors.length} batches failed to insert, but ${totalInserted} rows were saved.`) 
          };
        }
        return { data: null, error: new Error(`Failed to insert data: ${errors[0].message}`) };
      }
      
      return { data: { inserted: totalInserted }, error: null };
    } catch (err) {
      console.error("Error in saveToSupabase:", err);
      return { data: null, error: err as Error };
    }
  };

  const downloadData = () => {
    if (intentData.length === 0) {
      toast({
        title: "No data to download",
        description: "Please process some data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create CSV headers
      const headers = [
        "Date", 
        "Company Name", 
        "Topic", 
        "Category", 
        "Score",
        "Website",
        "Secondary Industry Hierarchical Category",
        "Alexa Rank",
        "Employees"
      ];

      // Convert data to CSV rows
      const rows = intentData.map(item => [
        item.date,
        item.companyName,
        item.topic,
        item.category,
        item.score.toString(),
        item.website,
        item.secondaryIndustryHierarchicalCategory,
        item.alexaRank,
        item.employees
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `intent_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Intent data saved as CSV file.`,
      });
    } catch (err) {
      console.error("Error downloading data:", err);
      toast({
        title: "Download Failed",
        description: "There was a problem creating the download file.",
        variant: "destructive",
      });
    }
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };
  
  const fetchSupabaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('intent_data')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Convert to our frontend format
        const convertedData: IntentData[] = data.map((item: DbIntentData) => ({
          intentId: item.id,
          date: item.date,
          companyName: item.company_name,
          topic: item.topic,
          category: item.category,
          score: item.score,
          website: item.website || '',
          secondaryIndustryHierarchicalCategory: item.secondary_industry_hierarchical_category || '',
          alexaRank: item.alexa_rank?.toString() || '',
          employees: item.employees?.toString() || '',
          // Fill other fields as empty strings
          companyId: '',
          foundedYear: '',
          companyHQPhone: '',
          revenue: '',
          primaryIndustry: '',
          primarySubIndustry: '',
          allIndustries: '',
          allSubIndustries: '',
          industryHierarchicalCategory: '',
          linkedInUrl: '',
          facebookUrl: '',
          twitterUrl: '',
          certifiedActiveCompany: '',
          certificationDate: '',
          totalFundingAmount: '',
          recentFundingAmount: '',
          recentFundingRound: '',
          recentFundingDate: '',
          recentInvestors: '',
          allInvestors: '',
          companyStreetAddress: '',
          companyCity: '',
          companyState: '',
          companyZipCode: '',
          companyCountry: '',
          fullAddress: '',
          numberOfLocations: '',
          queryName: '',
        }));
        
        setIntentData(convertedData);
        return convertedData;
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
      return [];
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
    handleFileChange,
    handleUpload,
    toggleAnalysis,
    fetchSupabaseData,
    downloadData // Make sure to export the downloadData function
  };
};
