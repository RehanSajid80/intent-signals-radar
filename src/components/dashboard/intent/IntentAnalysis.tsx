
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { IntentData } from "../types/intentTypes";
import CompanyAnalysisModal from "./CompanyAnalysisModal";

import TopCompaniesChart from "./TopCompaniesChart";
import TopCompaniesTable from "./TopCompaniesTable";
import TopicsAnalysisChart from "./TopicsAnalysisChart";
import CategoryDistributionChart from "./CategoryDistributionChart";
import IntentDataTable from "./IntentDataTable";

interface IntentAnalysisProps {
  data: IntentData[];
}

const IntentAnalysis: React.FC<IntentAnalysisProps> = ({ data }) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCompanyAnalysis = (companyName: string) => {
    setSelectedCompany(companyName);
    setIsModalOpen(true);
  };

  const selectedCompanyData = selectedCompany 
    ? data.filter(item => item.companyName === selectedCompany)
    : [];

  return (
    <>
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Intent Analysis</CardTitle>
        <CardDescription>
          Analysis based on {data.length} intent data records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="companies">
          <TabsList className="mb-4">
            <TabsTrigger value="companies">Top Companies</TabsTrigger>
            <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companies">
            <div className="space-y-4">
              <div className="h-[400px]">
                <h3 className="text-sm font-medium mb-2">Companies by Average Score</h3>
                <TopCompaniesChart data={data} />
              </div>
              
              <TopCompaniesTable data={data} />
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="space-y-4">
              <div className="h-[400px]">
                <h3 className="text-sm font-medium mb-2">Top Topics by Number of Signals</h3>
                <TopicsAnalysisChart data={data} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="h-[400px]">
              <h3 className="text-sm font-medium mb-2">Category Distribution</h3>
              <CategoryDistributionChart data={data} />
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <IntentDataTable data={data} onCompanyAnalysis={handleCompanyAnalysis} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <CompanyAnalysisModal
      company={selectedCompany}
      companyData={selectedCompanyData}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
};

export default IntentAnalysis;
