
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useHubspot } from "@/context/HubspotContext";

const IntegrationSettings = () => {
  const { disconnectFromHubspot } = useHubspot();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>
            Manage connections to external services and data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-hubspot text-white rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M84.5 267.9a31.35 31.35 0 0 0 31.3 31.3h91.6V208.2h-91.6a31.35 31.35 0 0 0-31.3 31.3v28.4zm91.6-91.7h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9A18.8 18.8 0 0 0 89.7 130c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14zm80.6 123h33.8v-32.5a31.6 31.6 0 0 0-31.6-31.6h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v13.1zm158.8-119.6a31.35 31.35 0 0 0-31.3-31.3h-91.6v91.6h91.6a31.35 31.35 0 0 0 31.3-31.3v-29zm35.1 77.5h-69.9a18.8 18.8 0 0 0-18.8 18.8c0 10.3 8.4 18.8 18.8 18.8h69.9c7.4 0 13.4 6 13.4 13.4v14h33.8v-32.5c0-17.5-14.1-31.6-31.6-31.6l-.6-.9zm-220.1-25.3a22.1 22.1 0 1 0 0-44.2 22.1 22.1 0 0 0 0 44.2zm0 35.2a57.3 57.3 0 1 1 0-114.6 57.3 57.3 0 0 1 0 114.6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">HubSpot</h3>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>
            <Button variant="outline" onClick={disconnectFromHubspot}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Outlook</h3>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">
              Connect
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Google Calendar</h3>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
