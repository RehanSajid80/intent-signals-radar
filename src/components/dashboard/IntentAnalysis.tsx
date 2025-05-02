
import React from "react";
import { IntentData } from "./types/intentTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopCompaniesChart from "./intent/TopCompaniesChart";
import TopCompaniesTable from "./intent/TopCompaniesTable";
import TopicsAnalysisChart from "./intent/TopicsAnalysisChart";
import CategoryDistributionChart from "./intent/CategoryDistributionChart";
import IntentDataTable from "./intent/IntentDataTable";
import ScoreDistributionChart from "./intent/ScoreDistributionChart";
import ScoreStatsCard from "./intent/ScoreStatsCard";

interface IntentAnalysisProps {
  data: IntentData[];
}

const IntentAnalysis: React.FC<IntentAnalysisProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Intent Analysis</CardTitle>
          <CardDescription>
            Analyze buyer intent signals across accounts and topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add Score Stats Card at the top */}
          <ScoreStatsCard data={data} />
          
          <Tabs defaultValue="charts" className="mt-6 mb-4">
            <TabsList>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="data">Data Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Companies by Intent</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <TopCompaniesChart data={data} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ScoreDistributionChart data={data} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Topics Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <TopicsAnalysisChart data={data} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <CategoryDistributionChart data={data} />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Companies Detail</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopCompaniesTable data={data} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data">
              <IntentDataTable data={data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentAnalysis;
