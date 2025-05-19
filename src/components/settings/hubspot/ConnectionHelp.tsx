
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";

export default function ConnectionHelp() {
  return (
    <Alert className="mt-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Browser Security Notice</AlertTitle>
      <AlertDescription className="text-blue-700">
        <p className="mb-2">
          Due to browser security restrictions (CORS), direct API access to HubSpot may be limited. 
          If you're experiencing connection issues, your API key might still be valid.
        </p>
        <p className="flex items-center gap-1">
          <a 
            href="https://developers.hubspot.com/docs/api/private-apps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            Learn more about HubSpot API access
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </p>
      </AlertDescription>
    </Alert>
  );
}
