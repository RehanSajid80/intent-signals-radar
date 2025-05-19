
import { Save, RefreshCw, Link, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  loading: boolean;
  hasStoredKey: boolean;
  isConnected: boolean;
  onSaveApiKey: () => void;
  onTestConnection: () => void;
  onRefreshData?: () => void;
  onDisconnect?: () => void;
};

export default function ActionButtons({
  loading,
  hasStoredKey,
  isConnected,
  onSaveApiKey,
  onTestConnection,
  onRefreshData,
  onDisconnect
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
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
        <Link className="mr-2 h-4 w-4" />
        Test Connection
      </Button>

      {isConnected && onRefreshData && (
        <Button
          variant="outline"
          onClick={onRefreshData}
          disabled={loading}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      )}
    </div>
  );
}
