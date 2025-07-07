
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Upload, ChevronDown } from "lucide-react";
import IntentUpload from "./IntentUpload";
import IntentAnalysis from "./intent/IntentAnalysis";
import { sampleIntentData } from "@/data/sampleIntentData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const IntentSignals = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle>Intent Signals</CardTitle>
            <CardDescription>
              Track intent signals across accounts to identify buying behavior
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Learn More
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Intent Signals</DialogTitle>
                  <DialogDescription>
                    Intent signals help you identify which companies are actively researching topics related to your products or services. Higher intent scores indicate stronger buying signals.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <p>Intent data is collected from:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Content downloads and engagement</li>
                    <li>Website visits and page views</li>
                    <li>Search behavior and keyword analysis</li>
                    <li>Third-party intent data providers</li>
                    <li>Event and webinar participation</li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => {
                setShowUpload(!showUpload);
                setShowSampleData(false);
              }}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload Intent Data
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                setShowSampleData(!showSampleData);
                setShowUpload(false);
              }}
            >
              <BarChart className="h-4 w-4 mr-1" />
              {showSampleData ? "Hide Sample Data" : "View Sample Data"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {showUpload && <IntentUpload />}
        {showSampleData && <IntentAnalysis data={sampleIntentData} />}
        
        {!showUpload && !showSampleData && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <BarChart className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Intent Data Available</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Intent data helps you identify which companies are actively researching topics related to your products or services.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={() => {
                  setShowSampleData(true);
                  setShowUpload(false);
                }}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <BarChart className="h-4 w-4 mr-2" />
                View Sample Data
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowUpload(true);
                  setShowSampleData(false);
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Intent Data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntentSignals;
