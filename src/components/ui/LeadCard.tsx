import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/context/hubspot";

interface LeadCardProps {
  contact: Contact;
}

const LeadCard: React.FC<LeadCardProps> = ({ contact }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{contact.firstName} {contact.lastName}</CardTitle>
        <CardDescription>{contact.title}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span>Email:</span>
          <span className="text-sm text-gray-600">{contact.email}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Phone:</span>
          <span className="text-sm text-gray-600">{contact.phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Lifecycle Stage:</span>
          <Badge variant="secondary">{contact.lifecycleStage}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
