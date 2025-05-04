
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CsvFormatHelp: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs flex items-center text-muted-foreground">
          <HelpCircle className="h-3 w-3 mr-1" />
          CSV Format Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>CSV File Format</DialogTitle>
          <DialogDescription>
            Your CSV file should include the following columns with exactly these names:
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Required Columns:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code className="bg-muted p-1 rounded">Date</code> - Format: MM/DD/YYYY</li>
              <li><code className="bg-muted p-1 rounded">Company Name</code> - Company displaying intent</li>
              <li><code className="bg-muted p-1 rounded">Topic</code> - The specific topic of interest</li>
              <li><code className="bg-muted p-1 rounded">Category</code> - General category for the topic</li>
              <li><code className="bg-muted p-1 rounded">Score</code> - Intent score (0-100)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Optional Columns:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><code className="bg-muted p-1 rounded">Website</code> - Company website URL</li>
              <li><code className="bg-muted p-1 rounded">Secondary Industry Hierarchical Category</code> - Industry classification</li>
              <li><code className="bg-muted p-1 rounded">Alexa Rank</code> - Website popularity ranking</li>
              <li><code className="bg-muted p-1 rounded">Employees</code> - Company size by employee count</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Example:</h4>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              <code>
                Date,Company Name,Topic,Category,Score,Website,Secondary Industry Hierarchical Category,Alexa Rank,Employees{'\n'}
                4/26/2025,Principal,Applicant Tracking Systems,Talent Acquisition,70,www.principal.com,finance.investment,9050,19700{'\n'}
                4/26/2025,Voya Financial,Salesforce Marketing Cloud,Cloud,74,www.voya.com,finance.investment,11579,10000
              </code>
            </pre>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Make sure your CSV file is UTF-8 encoded and uses commas as separators.</p>
            <p className="mt-2">Additional columns beyond those listed will be ignored.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvFormatHelp;
