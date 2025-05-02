
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const CsvFormatHelp: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="flex items-center text-xs px-0">
          <HelpCircle className="h-3 w-3 mr-1" />
          Required CSV format
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Required CSV Format for Intent Data</DialogTitle>
          <DialogDescription>
            Your CSV file should have the following column headers:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          <ul className="text-xs space-y-1">
            <li>Intent ID</li>
            <li>Date</li>
            <li>Company Name</li>
            <li>Topic</li>
            <li>Category</li>
            <li>Score</li>
            <li>Company ID</li>
            <li>Website</li>
            <li>Founded Year</li>
            <li>Company HQ Phone</li>
            <li>Revenue (in 000s USD)</li>
            <li>Primary Industry</li>
            <li>Primary Sub-Industry</li>
            <li>All Industries</li>
            <li>All Sub-Industries</li>
            <li>Industry Hierarchical Category</li>
            <li>Secondary Industry Hierarchical Category</li>
            <li>Alexa Rank</li>
            <li>Employees</li>
            <li>LinkedIn Company Profile URL</li>
            <li>Facebook Company Profile URL</li>
            <li>Twitter Company Profile URL</li>
            <li>Certified Active Company</li>
            <li>Certification Date</li>
            <li>Total Funding Amount (in 000s USD)</li>
            <li>Recent Funding Amount (in 000s USD)</li>
            <li>Recent Funding Round</li>
            <li>Recent Funding Date</li>
            <li>Recent Investors</li>
            <li>All Investors</li>
            <li>Company Street Address</li>
            <li>Company City</li>
            <li>Company State</li>
            <li>Company Zip Code</li>
            <li>Company Country</li>
            <li>Full Address</li>
            <li>Number of Locations</li>
            <li>Query Name</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvFormatHelp;
