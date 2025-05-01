
import React from 'react';
import { CheckCircle2, XCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CloudProviderStatusProps {
  isActive: boolean;
  detailText?: string;
}

export const CloudProviderStatus = ({ isActive, detailText }: CloudProviderStatusProps) => {
  return (
    <div className="flex items-center justify-center">
      {isActive ? (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          {detailText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{detailText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      ) : (
        <XCircle className="h-5 w-5 text-gray-300" />
      )}
    </div>
  );
};
