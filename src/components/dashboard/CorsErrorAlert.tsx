
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectionHelp from "@/components/settings/hubspot/ConnectionHelp";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CorsErrorAlertProps {
  enableDemoData: () => void;
  pauseApiCalls: boolean;
  togglePauseApiCalls: () => void;
}

const CorsErrorAlert: React.FC<CorsErrorAlertProps> = ({ 
  enableDemoData,
  pauseApiCalls,
  togglePauseApiCalls
}) => {
  return (
    <div className="space-y-4 mb-6">
      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">Data Connection Issue</AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mb-2">
            We're having trouble retrieving your HubSpot data due to browser security limitations (CORS).
            Your API key may still be valid, but direct access is restricted in the browser.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-amber-100 hover:bg-amber-200 text-amber-800"
              onClick={enableDemoData}
            >
              Show Sample Data
            </Button>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="pause-api"
                checked={pauseApiCalls}
                onCheckedChange={togglePauseApiCalls}
              />
              <Label htmlFor="pause-api" className="text-amber-800 cursor-pointer flex items-center">
                <WifiOff className={`h-4 w-4 mr-1.5 ${pauseApiCalls ? 'text-amber-600' : 'text-amber-400'}`} />
                {pauseApiCalls ? 'API calls paused' : 'Pause API calls'}
              </Label>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      <ConnectionHelp />
    </div>
  );
};

export default CorsErrorAlert;
