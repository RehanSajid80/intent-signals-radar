
import { Save, RefreshCw, Link, Unlink, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  loading: boolean;
  hasStoredKey: boolean;
  isConnected: boolean;
  apiCallsPaused?: boolean;
  onSaveApiKey: () => void;
  onTestConnection: () => void;
  onRefreshData?: () => void;
  onDisconnect?: () => void;
};

export default function ActionButtons({
  loading,
  hasStoredKey,
  isConnected,
  apiCallsPaused = false,
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
        disabled={loading || !hasStoredKey || apiCallsPaused}
      >
        {apiCallsPaused ? (
          <>
            <WifiOff className="mr-2 h-4 w-4 text-amber-500" />
            API Calls Paused
          </>
        ) : (
          <>
            <Link className="mr-2 h-4 w-4" />
            Test Connection
          </>
        )}
      </Button>

      {isConnected && onRefreshData && (
        <Button
          variant="outline"
          onClick={onRefreshData}
          disabled={loading || apiCallsPaused}
          className={apiCallsPaused 
            ? "bg-amber-50 border-amber-200 text-amber-700" 
            : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"}
        >
          {apiCallsPaused ? (
            <>
              <WifiOff className="mr-2 h-4 w-4" />
              API Calls Paused
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>
      )}
    </div>
  );
}
