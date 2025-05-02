
import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IntentAnalysis from "@/components/dashboard/IntentAnalysis";
import IntentUpload from "@/components/dashboard/IntentUpload";
import { sampleIntentData } from "@/data/sampleIntentData";

const IntentPage = () => {
  const [activeTab, setActiveTab] = useState("sample");
  
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
          <Tabs defaultValue="sample" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="sample">Sample Data</TabsTrigger>
              <TabsTrigger value="upload">Upload Your Data</TabsTrigger>
            </TabsList>
            
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
