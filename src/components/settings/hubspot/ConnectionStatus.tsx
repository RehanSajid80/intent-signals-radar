
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ConnectionStatusProps = {
  status: "connected" | "disconnected" | "unknown" | "connecting" | "error";
  errorMessage?: string;
};

export default function ConnectionStatus({ status, errorMessage }: ConnectionStatusProps) {
  if (status === "unknown") {
    return null;
  }

  if (status === "connecting") {
    return (
      <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
        <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
        <span>Connecting...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span>Connection Issue</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{errorMessage || "There was an issue connecting to HubSpot. This may be due to browser security limitations."}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return status === "connected" ? (
    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
      <CheckCircle className="h-4 w-4" />
      <span>Connected</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full">
      <XCircle className="h-4 w-4" />
      <span>Disconnected</span>
    </div>
  );
}
