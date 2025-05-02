
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface IntentTableSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const IntentTableSearch: React.FC<IntentTableSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search data..."
        className="w-full pl-9"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default IntentTableSearch;
