import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Mail, Phone, Building2 } from "lucide-react";
import { Contact } from "@/types/hubspot";

export interface LeadCardProps {
  contact: Contact;
  showDetails?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ contact, showDetails = false }) => {
  const [expanded, setExpanded] = useState(showDetails);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getBadgeVariant = (priorityLevel: string) => {
    switch (priorityLevel?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="mb-3 overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
              <Badge variant={getBadgeVariant(contact.priorityLevel)}>{contact.priorityLevel}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{contact.title}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpanded}>
            {expanded ? 
              <ChevronUp className="h-4 w-4" /> :
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="p-4 pt-2">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-primary">{contact.email}</a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="text-primary">{contact.phone}</a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{contact.company}</span>
            </div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between items-center mt-1">
                <span>Score:</span>
                <span className="font-medium">{contact.score}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>Last Activity:</span>
                <span className="font-medium">{new Date(contact.lastActivity).toLocaleDateString()}</span>
              </div>
              {contact.lifecycleStage && (
                <div className="flex justify-between items-center mt-1">
                  <span>Stage:</span>
                  <span className="font-medium">{contact.lifecycleStage}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LeadCard;
