
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const NotificationSettings = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [notifTypes, setNotifTypes] = useState({
    highPriority: true,
    stageChanges: true,
    intentSignals: true,
    newContact: false
  });

  const handleSave = () => {
    // Save notification settings logic would go here
    console.log("Saving notification settings:", { 
      emailNotifs, 
      pushNotifs, 
      notifTypes 
    });
  };

  const toggleNotifType = (type) => {
    setNotifTypes({
      ...notifTypes,
      [type]: !notifTypes[type]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure when and how you receive alerts and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in browser
            </p>
          </div>
          <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Notification Types</h3>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm">High priority lead alerts</span>
            </div>
            <Switch 
              checked={notifTypes.highPriority} 
              onCheckedChange={() => toggleNotifType('highPriority')} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm">Account stage changes</span>
            </div>
            <Switch 
              checked={notifTypes.stageChanges} 
              onCheckedChange={() => toggleNotifType('stageChanges')} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm">Strong intent signals</span>
            </div>
            <Switch 
              checked={notifTypes.intentSignals} 
              onCheckedChange={() => toggleNotifType('intentSignals')} 
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm">New contact added</span>
            </div>
            <Switch 
              checked={notifTypes.newContact} 
              onCheckedChange={() => toggleNotifType('newContact')} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
