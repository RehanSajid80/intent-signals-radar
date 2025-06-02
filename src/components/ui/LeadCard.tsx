
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/types/hubspot";
import { User, Mail, Building, Phone, Calendar } from "lucide-react";

interface LeadCardProps {
  contact: Contact;
}

const LeadCard = ({ contact }: LeadCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">
              {contact.firstName} {contact.lastName}
            </h3>
          </div>
          <Badge className={`text-xs ${getPriorityColor(contact.priorityLevel)}`}>
            {contact.priorityLevel}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>{contact.email}</span>
            </div>
          )}
          
          {contact.company && (
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3" />
              <span>{contact.company}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {contact.lastActivity && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Last activity: {new Date(contact.lastActivity).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span>Engagement Score</span>
            <span className="font-medium">{contact.engagementLevel}/10</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
            <div 
              className="bg-primary h-1.5 rounded-full" 
              style={{ width: `${contact.engagementLevel * 10}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
