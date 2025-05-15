
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

const GeneralSettings = () => {
  const [displayName, setDisplayName] = useState("Sales Analytics Dashboard");
  const [email, setEmail] = useState("user@example.com");
  const [timezone, setTimezone] = useState("UTC-5");
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // Save general settings logic would go here
    console.log("Saving general settings:", { displayName, email, timezone, darkMode });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and application settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input 
            id="name" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Notification Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Time Zone</Label>
          <select 
            id="timezone" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-7">Mountain Time (UTC-7)</option>
            <option value="UTC-6">Central Time (UTC-6)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">UTC</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable dark mode for the application
            </p>
          </div>
          <Switch 
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode} 
          />
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

export default GeneralSettings;
