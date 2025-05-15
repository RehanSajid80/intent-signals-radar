
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  loading: boolean;
  hasStoredKey: boolean;
  onSaveApiKey: () => void;
  onTestConnection: () => void;
};

export default function ActionButtons({
  loading,
  hasStoredKey,
  onSaveApiKey,
  onTestConnection
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button 
        onClick={onSaveApiKey} 
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save API Key
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onTestConnection}
        disabled={loading || !hasStoredKey}
      >
        Test Connection
      </Button>
    </div>
  );
}
