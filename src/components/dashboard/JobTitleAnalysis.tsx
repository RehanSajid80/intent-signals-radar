
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";
import { Briefcase } from 'lucide-react';

const JobTitleAnalysis = () => {
  const { jobTitleStats } = useHubspot();
  
  // Transform and sort job title data
  const jobTitles = Object.entries(jobTitleStats)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Get top 10 job titles
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle className="text-md">Job Title Overview</CardTitle>
          </div>
        </div>
        <CardDescription>
          Most common job titles in your contact database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {jobTitles.length > 0 ? (
          <div className="space-y-3 mt-2">
            {jobTitles.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="text-sm font-medium truncate" title={item.title}>
                    {item.title === 'Unknown' ? 'Unknown Job Title' : item.title}
                  </div>
                  <div className="w-full mt-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(item.count / jobTitles[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm font-medium">{item.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No job title data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobTitleAnalysis;
