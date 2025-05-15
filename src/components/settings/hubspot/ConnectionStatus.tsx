
import { CheckCircle, XCircle } from "lucide-react";

type ConnectionStatusProps = {
  status: "connected" | "disconnected" | "unknown";
};

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === "unknown") {
    return null;
  }

  return status === "connected" ? (
    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
      <CheckCircle className="h-4 w-4" />
      <span>Connected</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full">
      <XCircle className="h-4 w-4" />
      <span>Disconnected</span>
    </div>
  );
}
