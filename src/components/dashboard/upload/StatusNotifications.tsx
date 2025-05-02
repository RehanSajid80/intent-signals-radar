
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatusNotificationsProps {
  error: string | null;
  uploadSuccess: boolean;
}

const StatusNotifications: React.FC<StatusNotificationsProps> = ({ 
  error, 
  uploadSuccess 
}) => {
  return (
    <>
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {uploadSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            File uploaded successfully! Intent data processed.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusNotifications;
