
import React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const getScoreColorClass = (score: number) => {
    return score >= 90 ? "bg-purple-100 text-purple-800" :
           score >= 80 ? "bg-blue-100 text-blue-800" :
           score >= 70 ? "bg-green-100 text-green-800" :
           score >= 60 ? "bg-yellow-100 text-yellow-800" :
           "bg-orange-100 text-orange-800";
  };

  return (
    <span 
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        getScoreColorClass(score)
      )}
    >
      {score}
    </span>
  );
};

export default ScoreBadge;
