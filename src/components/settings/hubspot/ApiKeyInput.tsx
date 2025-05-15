
import { Eye, EyeOff, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ApiKeyInputProps = {
  apiKey: string;
  showKey: boolean;
  hasStoredKey: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShowKey: () => void;
};

export default function ApiKeyInput({
  apiKey,
  showKey,
  hasStoredKey,
  onInputChange,
  onToggleShowKey
}: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="api-key" className="text-base font-medium">API Key</Label>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            id="api-key"
            value={apiKey}
            onChange={onInputChange}
            type={showKey ? "text" : "password"}
            placeholder={hasStoredKey ? "API key stored securely" : "Enter your HubSpot API key"}
            className="flex-1 pr-10"
          />
          {hasStoredKey && !showKey && (
            <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleShowKey}
          className="ml-2"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Your API key will be securely stored in the database and masked for security.
      </p>
      <p className="text-sm text-muted-foreground">
        <a 
          href="https://app.hubspot.com/api-key"
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Get your HubSpot API key here
        </a>
      </p>
    </div>
  );
}
