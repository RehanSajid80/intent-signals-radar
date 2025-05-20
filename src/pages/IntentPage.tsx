import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";
import IntentUpload from "@/components/dashboard/IntentUpload";
import { sampleIntentData } from "@/data/sampleIntentData";
import { IntentData } from "@/components/dashboard/types/intentTypes";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  fetchAvailableWeeks, 
  fetchSupabaseData 
} from '@/components/dashboard/upload/utils/supabase';
import { WeekSelector } from '@/components/dashboard/upload/WeekSelector';

const IntentPage = () => {
  const [activeTab, setActiveTab] = useState("database");
  const [databaseData, setDatabaseData] = useState<IntentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  
  // Format current date for display
  const currentDate = format(new Date(), "MMMM d, yyyy");
  
  useEffect(() => {
    // Only fetch data once on initial load
    if (!initialDataFetched) {
      const fetchIntentData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch available weeks first
          const weeks = await fetchAvailableWeeks();
          setAvailableWeeks(weeks);
          
          // If there are weeks available, fetch data for the most recent week
          if (weeks.length > 0) {
            setSelectedWeek(weeks[0]);
            const data = await fetchSupabaseData(undefined, weeks[0]);
            setDatabaseData(data);
          } else {
            // Otherwise fetch all data
            const data = await fetchSupabaseData();
            setDatabaseData(data);
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setIsLoading(false);
          setInitialDataFetched(true);
        }
      };
      
      fetchIntentData();
    }
  }, [initialDataFetched]);

  const handleWeekChange = async (week: string) => {
    if (week === selectedWeek) return; // Don't fetch if same week is selected
    
    setSelectedWeek(week);
    setIsLoading(true);
    
    try {
      const data = await fetchSupabaseData(undefined, week);
      setDatabaseData(data);
    } catch (err) {
      console.error("Error fetching data for week:", week, err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://www.zyter.com/wp-content/uploads/2023/04/ZTC_LOGO_FINAL1.png" 
                alt="Zyter Logo" 
                className="h-8 md:h-10" 
              />
              <h1 className="text-2xl font-bold">Intent Signals</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentDate}
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-6">
          <Tabs defaultValue="database" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="database">Database Data</TabsTrigger>
              <TabsTrigger value="sample">Sample Data</TabsTrigger>
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="mt-4">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between">
                    <span>Intent Data from Database</span>
                    {availableWeeks.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-normal text-muted-foreground">Week:</span>
                        <div className="w-[240px]">
                          <WeekSelector
                            value={selectedWeek}
                            onChange={handleWeekChange}
                            availableWeeks={availableWeeks}
                          />
                        </div>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This data is stored in your Supabase database. It shows real intent signals 
                    from various companies, indicating their interest in specific topics.
                    {selectedWeek && (
                      <span className="font-medium"> Currently viewing: <span className="text-primary">{selectedWeek}</span></span>
                    )}
                  </p>
                </CardContent>
              </Card>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-[300px]" />
                    <Skeleton className="h-[300px]" />
                  </div>
                </div>
              ) : databaseData.length > 0 ? (
                <IntentAnalysis data={databaseData} />
              ) : (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <p className="mb-4 text-muted-foreground">No intent data found in the database.</p>
                    <p className="text-sm">
                      Use the "Upload Data" tab to add intent data to your database.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="sample" className="mt-4">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sample Intent Data</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This is sample intent data showing signals from various companies. Intent signals help you identify which 
                    companies are actively researching topics related to your products or services.
                  </p>
                </CardContent>
              </Card>
              
              <IntentAnalysis data={sampleIntentData} />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4">
              <IntentUpload />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default IntentPage;
