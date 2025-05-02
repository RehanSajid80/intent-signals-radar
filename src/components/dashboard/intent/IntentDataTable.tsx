
import React, { useState } from "react";
import { IntentData } from "../IntentUpload";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Search, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IntentDataTableProps {
  data: IntentData[];
}

type SortField = "companyName" | "topic" | "category" | "score" | "date";
type SortDirection = "asc" | "desc";

const IntentDataTable: React.FC<IntentDataTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // Filter and sort data
  const processedData = React.useMemo(() => {
    // First, filter out invalid scores and apply search filter
    const filtered = data.filter(item => {
      const isValidScore = !isNaN(item.score) && item.score !== null;
      
      // If there's a search term, check if it matches any field
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          isValidScore && 
          (item.companyName?.toLowerCase().includes(searchLower) ||
           item.topic?.toLowerCase().includes(searchLower) ||
           item.category?.toLowerCase().includes(searchLower) ||
           String(item.score).includes(searchLower))
        );
      }
      
      return isValidScore;
    });
    
    // Then sort the filtered data
    return [...filtered].sort((a, b) => {
      // Handle sorting for each field type
      if (sortField === "score") {
        return sortDirection === "asc" ? a.score - b.score : b.score - a.score;
      } else if (sortField === "date") {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Text-based sorting
        const valueA = String(a[sortField] || "").toLowerCase();
        const valueB = String(b[sortField] || "").toLowerCase();
        return sortDirection === "asc" 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
  }, [data, sortField, sortDirection, searchTerm]);

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new field
    }
  };

  // Toggle row expansion
  const toggleExpand = (index: number) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Invalid date";
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? format(date, 'MM/dd/yyyy') : "Invalid date";
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get score color class based on score value
  const getScoreColorClass = (score: number) => {
    return score >= 90 ? "bg-purple-100 text-purple-800" :
           score >= 80 ? "bg-blue-100 text-blue-800" :
           score >= 70 ? "bg-green-100 text-green-800" :
           score >= 60 ? "bg-yellow-100 text-yellow-800" :
           "bg-orange-100 text-orange-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <h2 className="text-lg font-semibold">Intent Signals</h2>
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
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[180px] cursor-pointer hover:bg-muted/60"
                  onClick={() => handleSort("companyName")}
                >
                  <div className="flex items-center">
                    Company
                    {sortField === "companyName" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleSort("topic")}
                >
                  <div className="flex items-center">
                    Topic
                    {sortField === "topic" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === "category" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center">
                    Score
                    {sortField === "score" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "date" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow 
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      expanded[index] && "bg-muted/30"
                    )}
                  >
                    <TableCell className="font-medium">{item.companyName}</TableCell>
                    <TableCell>{item.topic}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          getScoreColorClass(item.score)
                        )}
                      >
                        {item.score}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>
                      <button 
                        onClick={() => toggleExpand(index)}
                        className="p-1 rounded-full hover:bg-muted"
                      >
                        {expanded[index] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                  
                  {expanded[index] && (
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={6} className="py-3">
                        <div className="grid sm:grid-cols-2 gap-4 px-2">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Company Details</h4>
                            <div className="bg-white p-3 rounded border text-sm">
                              <p><span className="font-medium">Company:</span> {item.companyName}</p>
                              <p><span className="font-medium">Intent Score:</span> {item.score}</p>
                              <p><span className="font-medium">Topic:</span> {item.topic}</p>
                              <p><span className="font-medium">Category:</span> {item.category}</p>
                              <p><span className="font-medium">Date:</span> {formatDate(item.date)}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Intent Analysis</h4>
                            <div className="bg-white p-3 rounded border text-sm">
                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground mb-1">Intent Strength</p>
                                <div className="h-2 w-full bg-gray-200 rounded-full">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      item.score >= 90 ? "bg-purple-500" :
                                      item.score >= 80 ? "bg-blue-500" :
                                      item.score >= 70 ? "bg-green-500" :
                                      item.score >= 60 ? "bg-yellow-500" :
                                      "bg-orange-500"
                                    )}
                                    style={{ width: `${item.score}%` }}
                                  ></div>
                                </div>
                              </div>
                              <p>
                                <span className="font-medium">Recommendation:</span>{' '}
                                {item.score >= 90 ? "Immediate follow-up recommended" :
                                 item.score >= 80 ? "High priority follow-up" :
                                 item.score >= 70 ? "Schedule follow-up" :
                                 item.score >= 60 ? "Monitor interest" :
                                 "Low priority"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
              
              {processedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? (
                      <div className="text-muted-foreground">
                        No results found for "{searchTerm}"
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No valid score data available
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Showing {processedData.length} of {data.length} records
        {data.length - processedData.length > 0 && ` (${data.length - processedData.length} invalid records filtered out)`}
      </div>
    </div>
  );
};

export default IntentDataTable;
