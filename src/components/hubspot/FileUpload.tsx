import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileIcon, HelpCircle, Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHubspot } from "@/context/hubspot";

const FileUpload = () => {
  const { processFileUpload, isProcessing } = useHubspot();
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
    contacts: null,
    accounts: null,
    deals: null,
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError("Please upload a CSV file");
        return;
      }
      
      setSelectedFiles({
        ...selectedFiles,
        [fileType]: file,
      });
      
      console.log(`Selected ${fileType} file:`, file.name, file.size);
    }
  };

  const handleUpload = async () => {
    setError(null);
    const filesToUpload = Object.entries(selectedFiles)
      .filter(([_, file]) => file !== null)
      .map(([type, file]) => ({ type, file: file as File }));
    
    if (filesToUpload.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }
    
    console.log("Uploading files:", filesToUpload.map(f => `${f.type}: ${f.file.name}`));
    
    try {
      await processFileUpload(filesToUpload);
      setUploadSuccess(true);
      
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFiles({
          contacts: null,
          accounts: null,
          deals: null,
        });
      }, 3000);
    } catch (err) {
      console.error("Error in upload:", err);
      setError("Failed to process files. Check console for details.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Upload className="h-10 w-10 text-teal-500" />
        </div>
        <CardTitle className="text-2xl text-center">Upload HubSpot Data</CardTitle>
        <CardDescription className="text-center">
          Import your HubSpot data by uploading CSV files exported from HubSpot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contacts" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFiles.contacts ? (
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-8 w-8 text-teal-500" />
                  <div>
                    <p className="font-medium">{selectedFiles.contacts.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFiles.contacts.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    id="contacts-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'contacts')}
                  />
                  <label
                    htmlFor="contacts-file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload Contacts CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse
                    </p>
                  </label>
                </>
              )}
            </div>
            
            <RequiredColumnsDialog type="contacts" />
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFiles.accounts ? (
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-8 w-8 text-teal-500" />
                  <div>
                    <p className="font-medium">{selectedFiles.accounts.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFiles.accounts.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    id="accounts-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'accounts')}
                  />
                  <label
                    htmlFor="accounts-file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload Accounts CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse
                    </p>
                  </label>
                </>
              )}
            </div>
            
            <RequiredColumnsDialog type="accounts" />
          </TabsContent>
          
          <TabsContent value="deals" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {selectedFiles.deals ? (
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-8 w-8 text-teal-500" />
                  <div>
                    <p className="font-medium">{selectedFiles.deals.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFiles.deals.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    id="deals-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'deals')}
                  />
                  <label
                    htmlFor="deals-file"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload Deals CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse
                    </p>
                  </label>
                </>
              )}
            </div>
            
            <RequiredColumnsDialog type="deals" />
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert className="mt-4 bg-red-50 border-red-200">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {uploadSuccess && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              Files uploaded successfully! Processing your data...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full bg-teal-500 hover:bg-teal-600"
          onClick={handleUpload}
          disabled={isProcessing || Object.values(selectedFiles).every(file => file === null)}
        >
          {isProcessing ? "Processing..." : "Upload Files"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const RequiredColumnsDialog = ({ type }: { type: string }) => {
  const requiredColumns: Record<string, string[]> = {
    contacts: [
      "Record ID - Contact",
      "First Name", 
      "Last Name", 
      "Email", 
      "Phone Number", 
      "Contact owner", 
      "Last Activity Date",
      "Lead Status",
      "Marketing contact status",
      "Create Date",
      "HubSpot Score",
      "Recent Sales Email Clicked Date",
      "Marketing emails clicked",
      "Last Engagement Date",
      "Next Activity Date",
      "Number of times contacted",
      "Job Title",
      "Lifecycle Stage",
      "Company name",
      "City",
      "Country/Region"
    ],
    accounts: [
      "Record ID - Company",
      "Company name", 
      "Industry", 
      "Website", 
      "Company Size", 
      "Lifecycle Stage", 
      "Annual Revenue",
      "Company owner",
      "City",
      "Country/Region"
    ],
    deals: [
      "Deal Name", 
      "Deal Stage", 
      "Amount", 
      "Close Date", 
      "Associated Company", 
      "Deal Owner"
    ]
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="flex items-center text-xs">
          <HelpCircle className="h-3 w-3 mr-1" />
          Required columns for {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Required Columns for {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
          <DialogDescription>
            Your CSV file should contain the following columns for proper data import:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ul className="list-disc pl-5 space-y-1">
            {requiredColumns[type].map((column, index) => (
              <li key={index} className="text-sm">{column}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Columns should match exactly as shown above. Additional columns will be ignored.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUpload;
