import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/types/hubspot";
import { useHubspot } from "@/context/hubspot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactRoleMappingProps {
  accountId: string;
}

const ContactRoleMapping: React.FC<ContactRoleMappingProps> = ({ accountId }) => {
  const { accounts, contacts } = useHubspot();
  const account = accounts.find(acc => acc.id === accountId);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  if (!account) {
    return <Card>
      <CardHeader>
        <CardTitle>Contact Role Mapping</CardTitle>
      </CardHeader>
      <CardContent>Account not found.</CardContent>
    </Card>;
  }

  const accountContacts = contacts.filter(contact => contact.company === account.name);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Role Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contacts">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts">
            <div className="grid gap-4">
              {accountContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{contact.firstName} {contact.lastName}</span>
                  <Badge variant="secondary">{contact.title}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="roles">
            <div className="grid gap-4">
              <Button onClick={() => handleRoleSelect('Decision Maker')}>Decision Maker</Button>
              <Button onClick={() => handleRoleSelect('Influencer')}>Influencer</Button>
              <Button onClick={() => handleRoleSelect('End User')}>End User</Button>
              {selectedRole && <p>Selected Role: {selectedRole}</p>}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactRoleMapping;
