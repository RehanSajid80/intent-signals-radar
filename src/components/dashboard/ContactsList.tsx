
import React from 'react';
import { useHubspot } from "@/context/HubspotContext";
import { Card, CardContent } from "@/components/ui/card";

const ContactsList = () => {
  const { contacts } = useHubspot();
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-4">All Contacts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map(contact => (
          <div key={contact.id} className="card-interactive">
            <a href={`/contacts/${contact.id}`}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.firstName} {contact.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{contact.title}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Priority Score</span>
                      <span className="text-xs font-medium">{contact.score}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${contact.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div className="text-xs text-muted-foreground">{contact.company}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      contact.priorityLevel === "high" ? "bg-alert-100 text-alert-600" :
                      contact.priorityLevel === "medium" ? "bg-warning-100 text-warning-600" :
                      "bg-success-100 text-success-600"
                    }`}>
                      {contact.priorityLevel}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
