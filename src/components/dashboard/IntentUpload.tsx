
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Database, Upload } from "lucide-react";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";
import FileUploadZone from "./upload/FileUploadZone";
import StatusNotifications from "./upload/StatusNotifications";
import IntentDataPreview from "./upload/IntentDataPreview";
import CsvFormatHelp from "./upload/CsvFormatHelp";
import { useIntentUpload } from "./upload/useIntentUpload";
import { IntentData } from "./types/intentTypes";

const IntentUpload: React.FC = () => {
  const {
    selectedFile,
    uploadSuccess,
    error,
    isProcessing,
    previewData,
    intentData,
    showAnalysis,
    handleFileChange,
    handleUpload,
    toggleAnalysis,
    fetchSupabaseData
  } = useIntentUpload();

  useEffect(() => {
    // Load intent data from Supabase when component mounts
    const loadData = async () => {
      await fetchSupabaseData();
    };
    
    loadData();
  }, []);

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
            <FileUploadZone 
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              label="Upload Intent CSV"
              sublabel="Required fields: Date, Company Name, Topic, Category, Score"
            />
            
            <StatusNotifications 
              error={error}
              uploadSuccess={uploadSuccess}
            />
            
            <IntentDataPreview previewData={previewData} />
            
            <div className="flex justify-between items-center">
              <CsvFormatHelp />
              
              <div className="flex space-x-2">
                {intentData.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={toggleAnalysis}
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
            
            {intentData.length > 0 && (
              <div className="mt-4 text-sm flex items-center text-muted-foreground">
                <Database className="h-4 w-4 mr-1" />
                {intentData.length} records in database
              </div>
            )}
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
export type { IntentData };
