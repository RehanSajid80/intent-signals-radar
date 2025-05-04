
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusNotificationsProps {
  error: string | null;
  uploadSuccess: boolean;
  onDownload?: () => void;
}

const StatusNotifications: React.FC<StatusNotificationsProps> = ({
  error,
  uploadSuccess,
  onDownload
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="border-red-400 bg-red-50 text-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (uploadSuccess) {
    return (
      <Alert className="border-green-400 bg-green-50 text-green-800">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5" />
            <div>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                File processed successfully! You can now view the analysis.
              </AlertDescription>
            </div>
          </div>
          
          {onDownload && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-green-600 text-green-700 hover:bg-green-50"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Save Data
            </Button>
          )}
        </div>
      </Alert>
    );
  }

  return null;
};

export default StatusNotifications;
