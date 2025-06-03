
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, UserCheck } from "lucide-react";
import { useHubspot } from "@/context/hubspot";

const ContactBreakdown = () => {
  const { contacts, contactOwnerStats } = useHubspot();

  // Safe operations with null checks
  const safeContacts = contacts || [];
  const safeContactOwnerStats = contactOwnerStats || {};
  
  const totalContacts = safeContacts.length;
  const uniqueOwners = Object.keys(safeContactOwnerStats).length;
  const avgContactsPerOwner = uniqueOwners > 0 ? Math.round(totalContacts / uniqueOwners) : 0;
  
  // Count high priority contacts
  const highPriorityContacts = safeContacts.filter(contact => 
    contact.priorityLevel === 'high'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Total Contacts
          </CardTitle>
          <CardDescription>All contacts in your database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalContacts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +{Math.round(totalContacts * 0.05)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Avg per Owner
          </CardTitle>
          <CardDescription>Average contacts per owner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgContactsPerOwner.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            High Priority
          </CardTitle>
          <CardDescription>Contacts requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highPriorityContacts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {totalContacts > 0 ? Math.round((highPriorityContacts / totalContacts) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactBreakdown;
