
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Database, Upload, Check, Download, Calendar } from "lucide-react";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";
import FileUploadZone from "./upload/FileUploadZone";
import StatusNotifications from "./upload/StatusNotifications";
import IntentDataPreview from "./upload/IntentDataPreview";
import CsvFormatHelp from "./upload/CsvFormatHelp";
import { useIntentUpload } from "./upload/useIntentUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./upload/DatePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekSelector } from "./upload/WeekSelector";
import { format, parseISO } from "date-fns";

const IntentUpload: React.FC = () => {
  const {
    selectedFile,
    uploadSuccess,
    error,
    isProcessing,
    previewData,
    intentData,
    showAnalysis,
    savedToSupabase,
    saveToDatabase,
    dateFilter,
    weekLabel,
    weekFilter,
    availableWeeks,
    handleFileChange,
    handleUpload,
    toggleAnalysis,
    fetchFilteredData,
    downloadData,
    toggleSaveOption,
    handleDateFilterChange,
    handleWeekLabelChange,
    handleWeekFilterChange
  } = useIntentUpload();

  useEffect(() => {
    // Load intent data from Supabase when component mounts
    const loadData = async () => {
      await fetchFilteredData();
    };
    
    loadData();
  }, []);

  // Format current date for display
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

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
              onDownload={intentData.length > 0 ? downloadData : undefined}
            />
            
            <IntentDataPreview previewData={previewData} />
            
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Assign to Week
              </h3>
              <div className="flex flex-col space-y-2">
                <WeekSelector 
                  value={weekLabel}
                  onChange={handleWeekLabelChange}
                  availableWeeks={availableWeeks}
                />
                <p className="text-xs text-muted-foreground">
                  Select which week these intent signals belong to
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <CsvFormatHelp />
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="save-to-database" 
                    checked={saveToDatabase} 
                    onCheckedChange={toggleSaveOption}
                  />
                  <Label htmlFor="save-to-database" className="text-sm">
                    Save to Database
                  </Label>
                </div>
              </div>
              
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
            
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Filter Saved Data
              </h3>
              
              <Tabs defaultValue="date" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="date">Filter by Date</TabsTrigger>
                  <TabsTrigger value="week">Filter by Week</TabsTrigger>
                </TabsList>
                
                <TabsContent value="date" className="pt-4">
                  <div className="flex items-center gap-4">
                    <DatePicker 
                      date={dateFilter ? parseISO(dateFilter) : undefined} 
                      onSelect={(date) => handleDateFilterChange(date ? format(date, 'yyyy-MM-dd') : null)} 
                    />
                    {dateFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDateFilterChange(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="week" className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-[240px]">
                      <WeekSelector
                        value={weekFilter || ""}
                        onChange={handleWeekFilterChange}
                        availableWeeks={availableWeeks}
                      />
                    </div>
                    {weekFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleWeekFilterChange(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="mt-4 text-sm flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Database className="h-4 w-4 mr-1" />
                {intentData.length > 0 && (
                  <span>{intentData.length} records loaded</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {intentData.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={downloadData}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Save Data
                  </Button>
                )}
                
                {savedToSupabase && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Data saved to database</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground">
              Current date: {formattedDate}
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
export type { IntentData };
