
import { IntentData } from "../../types/intentTypes";
import { toast } from "@/hooks/use-toast";

/**
 * Export intent data to a CSV file
 */
export const downloadIntentData = (intentData: IntentData[]) => {
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

/**
 * Validate if a file is valid CSV format
 */
export const isValidCSVFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.csv');
};
