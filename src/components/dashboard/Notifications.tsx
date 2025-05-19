import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const { notifications, markNotificationAsRead } = useHubspot();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stage_change":
        return <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
          <Bell className="h-4 w-4" />
        </div>;
      case "intent_signal":
        return <div className="h-8 w-8 rounded-full bg-alert-100 text-alert-600 flex items-center justify-center">
          <Bell className="h-4 w-4" />
        </div>;
      case "priority_change":
        return <div className="h-8 w-8 rounded-full bg-warning-100 text-warning-600 flex items-center justify-center">
          <Bell className="h-4 w-4" />
        </div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
          <Bell className="h-4 w-4" />
        </div>;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-teal-500" />
          <CardTitle className="text-lg">Notifications</CardTitle>
        </div>
        {unreadNotifications.length > 0 && (
          <div className="rounded-full bg-alert-500 text-white text-xs px-2 py-0.5">
            {unreadNotifications.length} new
          </div>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {unreadNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-md bg-muted/50 animate-pulse-subtle">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {notifications
              .filter(n => n.read)
              .slice(0, 3)
              .map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 opacity-70">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center py-10">
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications;
