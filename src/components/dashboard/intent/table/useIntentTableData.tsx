
import { useState, useMemo } from "react";
import { IntentData } from "../../types/intentTypes";

type SortField = "companyName" | "topic" | "category" | "score" | "date";
type SortDirection = "asc" | "desc";

export const useIntentTableData = (data: IntentData[]) => {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // Filter and sort data
  const processedData = useMemo(() => {
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

  return {
    processedData,
    sortField,
    sortDirection,
    searchTerm,
    expanded,
    handleSort,
    setSearchTerm,
    toggleExpand,
    originalDataLength: data.length
  };
};
