import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Upload, HelpCircle, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";

// Define the structure for intent data
export interface IntentData {
  intentId: string;
  date: string;
  companyName: string;
  topic: string;
  category: string;
  score: number;
  companyId: string;
  website: string;
  foundedYear: string;
  companyHQPhone: string;
  revenue: string;
  primaryIndustry: string;
  primarySubIndustry: string;
  allIndustries: string;
  allSubIndustries: string;
  industryHierarchicalCategory: string;
  secondaryIndustryHierarchicalCategory: string;
  alexaRank: string;
  employees: string;
  linkedInUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  certifiedActiveCompany: string;
  certificationDate: string;
  totalFundingAmount: string;
  recentFundingAmount: string;
  recentFundingRound: string;
  recentFundingDate: string;
  recentInvestors: string;
  allInvestors: string;
  companyStreetAddress: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  companyCountry: string;
  fullAddress: string;
  numberOfLocations: string;
  queryName: string;
}

const IntentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<IntentData[]>([]);
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const { toast } = useToast();

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

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Upload className="h-5 w-5 mr-2 text-teal-500" />
            Upload Intent Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFile ? (
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-teal-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    id="intent-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="intent-file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload Intent CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse
                    </p>
                  </label>
                </>
              )}
            </div>
            
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {uploadSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">
                  File uploaded successfully! Intent data processed.
                </AlertDescription>
              </Alert>
            )}
            
            {previewData.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Intent ID</th>
                        <th className="p-2 text-left">Company</th>
                        <th className="p-2 text-left">Topic</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{row.intentId}</td>
                          <td className="p-2">{row.companyName}</td>
                          <td className="p-2">{row.topic}</td>
                          <td className="p-2">{row.category}</td>
                          <td className="p-2">{row.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing first 3 rows of data
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="flex items-center text-xs px-0">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Required CSV format
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Required CSV Format for Intent Data</DialogTitle>
                    <DialogDescription>
                      Your CSV file should have the following column headers:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 max-h-[400px] overflow-y-auto">
                    <ul className="text-xs space-y-1">
                      <li>Intent ID</li>
                      <li>Date</li>
                      <li>Company Name</li>
                      <li>Topic</li>
                      <li>Category</li>
                      <li>Score</li>
                      <li>Company ID</li>
                      <li>Website</li>
                      <li>Founded Year</li>
                      <li>Company HQ Phone</li>
                      <li>Revenue (in 000s USD)</li>
                      <li>Primary Industry</li>
                      <li>Primary Sub-Industry</li>
                      <li>All Industries</li>
                      <li>All Sub-Industries</li>
                      <li>Industry Hierarchical Category</li>
                      <li>Secondary Industry Hierarchical Category</li>
                      <li>Alexa Rank</li>
                      <li>Employees</li>
                      <li>LinkedIn Company Profile URL</li>
                      <li>Facebook Company Profile URL</li>
                      <li>Twitter Company Profile URL</li>
                      <li>Certified Active Company</li>
                      <li>Certification Date</li>
                      <li>Total Funding Amount (in 000s USD)</li>
                      <li>Recent Funding Amount (in 000s USD)</li>
                      <li>Recent Funding Round</li>
                      <li>Recent Funding Date</li>
                      <li>Recent Investors</li>
                      <li>All Investors</li>
                      <li>Company Street Address</li>
                      <li>Company City</li>
                      <li>Company State</li>
                      <li>Company Zip Code</li>
                      <li>Company Country</li>
                      <li>Full Address</li>
                      <li>Number of Locations</li>
                      <li>Query Name</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="flex space-x-2">
                {intentData.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => setShowAnalysis(!showAnalysis)}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    {showAnalysis ? "Hide Analysis" : "Show Analysis"}
                  </Button>
                )}
                
                <Button 
                  className="bg-teal-500 hover:bg-teal-600"
                  onClick={handleUpload}
                  disabled={isProcessing || !selectedFile}
                >
                  {isProcessing ? "Processing..." : "Process Intent Data"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showAnalysis && intentData.length > 0 && (
        <IntentAnalysis data={intentData} />
      )}
    </>
  );
};

export default IntentUpload;
