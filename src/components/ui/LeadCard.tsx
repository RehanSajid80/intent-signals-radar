
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact, IntentSignal } from "@/context/HubspotContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  MousePointer, 
  FileText, 
  Download, 
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface LeadCardProps {
  contact: Contact;
  showDetails?: boolean;
  className?: string;
}

const IntentSignalBadge = ({ signal }: { signal: IntentSignal }) => {
  const getIcon = () => {
    switch (signal.type) {
      case "email_open":
        return <Mail className="h-3 w-3" />;
      case "website_visit":
        return <MousePointer className="h-3 w-3" />;
      case "form_submission":
        return <FileText className="h-3 w-3" />;
      case "content_download":
        return <Download className="h-3 w-3" />;
      case "pricing_visit":
        return <CreditCard className="h-3 w-3" />;
      case "demo_request":
        return <Calendar className="h-3 w-3" />;
      default:
        return <ArrowUpRight className="h-3 w-3" />;
    }
  };

  const getStyle = () => {
    if (signal.strength >= 90) return "bg-alert-50 text-alert-600 border-alert-200";
    if (signal.strength >= 70) return "bg-warning-50 text-warning-600 border-warning-200";
    return "bg-neutral-50 text-neutral-600 border-neutral-200";
  };

  return (
    <div className={cn("text-xs flex items-center gap-1 px-2 py-1 rounded border", getStyle())}>
      {getIcon()}
      <span className="truncate">{signal.description}</span>
    </div>
  );
};

const LeadCard = ({ contact, showDetails = false, className }: LeadCardProps) => {
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const lastActivityDate = format(new Date(contact.lastActivity), "MMM d");
  
  return (
    <Link to={`/contacts/${contact.id}`}>
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{contact.email}</span>
                </div>
              </div>
            </div>
            <Badge 
              className={cn(
                "ml-auto",
                contact.priorityLevel === "high" && "bg-alert-500",
                contact.priorityLevel === "medium" && "bg-warning-500",
                contact.priorityLevel === "low" && "bg-success-500",
              )}
            >
              {contact.priorityLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{contact.company}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{contact.phone}</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-medium">Score:</span>
              <div className="bg-neutral-100 rounded-full h-2 w-16 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    contact.score >= 80 ? "bg-alert-500" : 
                    contact.score >= 60 ? "bg-warning-500" : 
                    "bg-success-500"
                  )}
                  style={{ width: `${contact.score}%` }}
                />
              </div>
              <span className="font-semibold">{contact.score}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Last: {lastActivityDate}</span>
            </div>
          </div>
          
          {showDetails && contact.intentSignals.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium">Recent Signals:</p>
              <div className="flex flex-col gap-2">
                {contact.intentSignals.map(signal => (
                  <IntentSignalBadge key={signal.id} signal={signal} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default LeadCard;
