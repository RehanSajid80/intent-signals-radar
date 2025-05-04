import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";
import IntentUpload from "@/components/dashboard/IntentUpload";
import { sampleIntentData } from "@/data/sampleIntentData";
import { supabase } from "@/integrations/supabase/client";
import { IntentData, DbIntentData } from "@/components/dashboard/types/intentTypes";

const IntentPage = () => {
  const [activeTab, setActiveTab] = useState("database");
  const [databaseData, setDatabaseData] = useState<IntentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchIntentData = async () => {
      try {
        const { data, error } = await supabase
          .from('intent_data')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error("Error fetching intent data:", error);
          return;
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
          
          setDatabaseData(convertedData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIntentData();
  }, []);
  
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
              Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
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
                  <CardTitle className="text-lg">Intent Data from Database</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This data is stored in your Supabase database. It shows real intent signals 
                    from various companies, indicating their interest in specific topics.
                  </p>
                </CardContent>
              </Card>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
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
