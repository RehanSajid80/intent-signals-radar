
import React, { useState, useEffect, useMemo } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Filter } from "lucide-react";

interface IntentAnalysisProps {
  data: IntentData[];
}

const IntentAnalysis: React.FC<IntentAnalysisProps> = ({ data }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicSelectMode, setTopicSelectMode] = useState<"multi" | "single">("multi");

  // Extract unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    data.forEach(item => {
      if (item.topic) {
        topics.add(item.topic);
      }
    });
    return Array.from(topics).sort();
  }, [data]);

  // Filter data based on selected topics
  const filteredData = useMemo(() => {
    if (selectedTopics.length === 0) {
      return data;
    }
    return data.filter(item => selectedTopics.includes(item.topic));
  }, [data, selectedTopics]);

  // Handle topic selection
  const handleTopicToggle = (topic: string) => {
    if (topicSelectMode === "single") {
      setSelectedTopics([topic]);
      return;
    }

    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedTopics.length === allTopics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics([...allTopics]);
    }
  };

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
          {/* Topic Selection */}
          <div className="mb-6 border rounded-md p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <h3 className="text-base font-semibold">Filter by Topics</h3>
              <div className="flex items-center gap-2">
                <Select 
                  value={topicSelectMode} 
                  onValueChange={(value) => setTopicSelectMode(value as "multi" | "single")}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Selection Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multi">Multi-select</SelectItem>
                    <SelectItem value="single">Single-select</SelectItem>
                  </SelectContent>
                </Select>
                <button 
                  onClick={handleSelectAll}
                  className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  {selectedTopics.length === allTopics.length ? "Clear All" : "Select All"}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 transition-colors ${
                    selectedTopics.includes(topic) 
                      ? "bg-teal-100 border-teal-300 text-teal-800" 
                      : "bg-white border text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {selectedTopics.includes(topic) && <Check className="h-3 w-3" />}
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Add Score Stats Card */}
          <ScoreStatsCard data={filteredData} />
          
          {/* Companies Detail moved to the top */}
          <Card className="mt-6 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Companies Detail</CardTitle>
              <CardDescription className="text-sm">
                Top 10 Companies by Intent Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopCompaniesTable data={filteredData} />
            </CardContent>
          </Card>
          
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
                    <TopCompaniesChart data={filteredData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ScoreDistributionChart data={filteredData} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Topics Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <TopicsAnalysisChart data={filteredData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <CategoryDistributionChart data={filteredData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <IntentDataTable data={filteredData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentAnalysis;
