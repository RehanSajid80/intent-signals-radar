import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2 } from "lucide-react";
import { format } from "date-fns";
import { useHubspot } from "@/context/hubspot";

interface LeadCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  score: number;
  priorityLevel: "high" | "medium" | "low";
  lastActivity: string;
}

const LeadCard: React.FC<LeadCardProps> = ({
  id,
  firstName,
  lastName,
  email,
  company,
  title,
  phone,
  score,
  priorityLevel,
  lastActivity
}) => {
  const { markNotificationAsRead } = useHubspot();
  const lastActivityDate = format(new Date(lastActivity), "MMM d, yyyy");
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">{firstName} {lastName}</CardTitle>
              <p className="text-xs text-muted-foreground">{title} at {company}</p>
            </div>
          </div>
          <Badge 
            className={`text-xs px-2 py-1 ${
              priorityLevel === "high" ? "bg-alert-500" :
              priorityLevel === "medium" ? "bg-warning-500" :
              "bg-success-500"
            }`}
          >
            {priorityLevel} priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-2 text-sm">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
            {email}
          </a>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{company}</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Last Activity: {lastActivityDate}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
