
import React, { useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IntentData } from "./IntentUpload";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  PieChart, 
  Pie 
} from "recharts";

interface IntentAnalysisProps {
  data: IntentData[];
}

const IntentAnalysis: React.FC<IntentAnalysisProps> = ({ data }) => {
  const topCompanies = useMemo(() => {
    // Group by company and calculate average scores
    const companyScores = data.reduce((acc, item) => {
      if (!acc[item.companyName]) {
        acc[item.companyName] = {
          count: 0,
          totalScore: 0,
          topics: new Set(),
          categories: new Set()
        };
      }
      
      acc[item.companyName].count += 1;
      acc[item.companyName].totalScore += item.score;
      acc[item.companyName].topics.add(item.topic);
      acc[item.companyName].categories.add(item.category);
      
      return acc;
    }, {} as Record<string, { count: number, totalScore: number, topics: Set<string>, categories: Set<string> }>);
    
    // Convert to array and sort by average score
    return Object.entries(companyScores)
      .map(([company, stats]) => ({
        company,
        avgScore: Math.round(stats.totalScore / stats.count),
        count: stats.count,
        topics: Array.from(stats.topics),
        categories: Array.from(stats.categories)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  }, [data]);
  
  const topicAnalysis = useMemo(() => {
    // Group by topic and calculate counts and average scores
    const topicStats = data.reduce((acc, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = {
          count: 0,
          totalScore: 0,
        };
      }
      
      acc[item.topic].count += 1;
      acc[item.topic].totalScore += item.score;
      
      return acc;
    }, {} as Record<string, { count: number, totalScore: number }>);
    
    // Convert to array and sort by count
    return Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count)
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);
  
  const categoryDistribution = useMemo(() => {
    // Group by category
    const categoryStats = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array for chart
    return Object.entries(categoryStats)
      .map(([name, value]) => ({ name, value }));
  }, [data]);
  
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"];

  return (
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
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={topCompanies}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" tick={{fontSize: 12}} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}`, 'Average Score']} />
                    <Bar dataKey="avgScore" name="Average Score">
                      {topCompanies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Top 10 Companies by Intent</h3>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Company</th>
                        <th className="p-2 text-left font-medium">Avg. Score</th>
                        <th className="p-2 text-left font-medium">Signals</th>
                        <th className="p-2 text-left font-medium">Topics</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCompanies.map((company, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{company.company}</td>
                          <td className="p-2">
                            <span 
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                company.avgScore > 80 ? "bg-green-100 text-green-800" :
                                company.avgScore > 60 ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {company.avgScore}
                            </span>
                          </td>
                          <td className="p-2">{company.count}</td>
                          <td className="p-2 max-w-xs truncate">
                            {company.topics.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="space-y-4">
              <div className="h-[400px]">
                <h3 className="text-sm font-medium mb-2">Top Topics by Number of Signals</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={topicAnalysis.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" tick={{fontSize: 12}} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Signal Count" fill="#0088FE" />
                    <Bar dataKey="avgScore" name="Average Score" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="h-[400px]">
              <h3 className="text-sm font-medium mb-2">Category Distribution</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} signals`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="rounded-md border overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 sticky top-0">
                    <th className="p-2 text-left font-medium">Company</th>
                    <th className="p-2 text-left font-medium">Topic</th>
                    <th className="p-2 text-left font-medium">Category</th>
                    <th className="p-2 text-left font-medium">Score</th>
                    <th className="p-2 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sort((a, b) => b.score - a.score).map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.companyName}</td>
                      <td className="p-2">{item.topic}</td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">
                        <span 
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            item.score > 80 ? "bg-green-100 text-green-800" :
                            item.score > 60 ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.score}
                        </span>
                      </td>
                      <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntentAnalysis;
