
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface StatusNotificationsProps {
  error: string | null;
  uploadSuccess: boolean;
}

const StatusNotifications: React.FC<StatusNotificationsProps> = ({
  error,
  uploadSuccess
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
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          File processed successfully! You can now view the analysis.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default StatusNotifications;
