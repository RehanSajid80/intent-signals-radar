
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/HubspotContext";
import { Loader2, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "./FileUpload";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const HubspotConnect = () => {
  const { isConnecting, connectToHubspot, isAuthenticated, isProcessing } = useHubspot();
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("connect");
  const { toast } = useToast();

  const handleConnect = () => {
    // Check for API key
    const savedApiKey = localStorage.getItem("hubspot_api_key");
    if (!savedApiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your HubSpot API key in settings first",
      });
      return;
    }
    
    connectToHubspot();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="connect" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="connect">Connect API</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 512 512"
                  className="text-hubspot"
                  fill="currentColor"
                >
                  <path d="M84.5 267.9a31.35 31.35 0 0 0 31.3 31.3h91.6V208.2h-91.6a31.35 31.35 0 0 0-31.3 31.3v28.4zm91.6-91.7h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9A18.8 18.8 0 0 0 89.7 130c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14zm80.6 123h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v13.1zm158.8-119.6a31.35 31.35 0 0 0-31.3-31.3h-91.6v91.6h91.6a31.35 31.35 0 0 0 31.3-31.3v-29zm35.1 77.5h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14h33.8v-32.5c0-17.5-14.1-31.6-31.6-31.6l-.6-.9zm-220.1-25.3a22.1 22.1 0 1 0 0-44.2 22.1 22.1 0 0 0 0 44.2zm0 35.2a57.3 57.3 0 1 1 0-114.6 57.3 57.3 0 0 1 0 114.6z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-center">Connect to HubSpot</CardTitle>
              <CardDescription className="text-center">
                Link your HubSpot account to import your contacts, deals, and activity data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showDetails ? (
                <div className="space-y-4 text-sm">
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-2">Data we'll import:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Contacts and companies</li>
                      <li>Deals and pipelines</li>
                      <li>User activities and engagements</li>
                      <li>Email and meeting data</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-2">Required permissions:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Read access to contacts</li>
                      <li>Read access to companies</li>
                      <li>Read access to deals</li>
                      <li>Read access to engagements</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center mb-4">
                  We'll analyze your HubSpot data to prioritize leads and identify buying signals.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-hubspot hover:bg-hubspot/90"
                onClick={handleConnect}
                disabled={isConnecting || isProcessing}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Data...
                  </>
                ) : isAuthenticated ? (
                  "Connected to HubSpot"
                ) : (
                  "Connect to HubSpot"
                )}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  className="text-sm w-full"
                  asChild
                >
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure API Key in Settings
                  </Link>
                </Button>
              )}
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide details" : "Show details"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload">
          <FileUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HubspotConnect;
