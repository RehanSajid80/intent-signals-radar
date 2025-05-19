import React from 'react';
import { useHubspot } from "@/context/hubspot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldX, MessagesSquare, Crown, Users, CalendarClock } from "lucide-react";

type ContactRole = 'champion' | 'blocker' | 'influencer' | 'decision-maker' | 'user' | 'new-contact';

interface ContactRoleMappingProps {
  accountId: string;
}

// Helper function to determine contact role based on their data
const determineContactRole = (contact: Contact): ContactRole => {
  // For this demo, we'll use some heuristics to determine roles
  // In a real app, this would come from CRM data
  
  if (contact.priorityLevel === 'high' && contact.title?.toLowerCase().includes('director')) {
    return 'decision-maker';
  }
  
  if (contact.priorityLevel === 'high' && contact.engagementLevel >= 8) {
    return 'champion';
  }
  
  if (contact.priorityLevel === 'low' && contact.intentSignals.length === 0) {
    return 'blocker';
  }
  
  if (contact.title?.toLowerCase().includes('manager')) {
    return 'influencer';
  }
  
  // If last activity is less than 30 days
  const lastActivity = new Date(contact.lastActivity);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (lastActivity > thirtyDaysAgo) {
    return 'new-contact';
  }
  
  return 'user';
};

// Get the appropriate icon for each role
const getRoleIcon = (role: ContactRole) => {
  switch (role) {
    case 'champion':
      return <Crown className="h-5 w-5 text-green-500" />;
    case 'blocker':
      return <ShieldX className="h-5 w-5 text-red-500" />;
    case 'influencer':
      return <MessagesSquare className="h-5 w-5 text-blue-500" />;
    case 'decision-maker':
      return <Crown className="h-5 w-5 text-purple-500" />;
    case 'user':
      return <User className="h-5 w-5 text-gray-500" />;
    case 'new-contact':
      return <CalendarClock className="h-5 w-5 text-orange-500" />;
    default:
      return <User className="h-5 w-5" />;
  }
};

// Get color scheme for each role
const getRoleColors = (role: ContactRole) => {
  switch (role) {
    case 'champion':
      return 'bg-green-100 border-green-200 text-green-700';
    case 'blocker':
      return 'bg-red-100 border-red-200 text-red-700';
    case 'influencer':
      return 'bg-blue-100 border-blue-200 text-blue-700';
    case 'decision-maker':
      return 'bg-purple-100 border-purple-200 text-purple-700';
    case 'user':
      return 'bg-gray-100 border-gray-200 text-gray-700';
    case 'new-contact':
      return 'bg-orange-100 border-orange-200 text-orange-700';
    default:
      return 'bg-gray-100 border-gray-200 text-gray-700';
  }
};

// Get human-readable name for each role
const getRoleName = (role: ContactRole): string => {
  switch (role) {
    case 'champion':
      return 'Champion';
    case 'blocker':
      return 'Blocker';
    case 'influencer':
      return 'Influencer';
    case 'decision-maker':
      return 'Decision Maker';
    case 'user':
      return 'User';
    case 'new-contact':
      return 'New Contact';
    default:
      return 'Unknown';
  }
};

const ContactRoleMapping: React.FC<ContactRoleMappingProps> = ({ accountId }) => {
  const { accounts } = useHubspot();
  
  const account = accounts.find(a => a.id === accountId);
  if (!account) return <div>Account not found</div>;
  
  // Group contacts by role
  const contactsByRole: Record<ContactRole, Contact[]> = {
    'champion': [],
    'blocker': [],
    'influencer': [],
    'decision-maker': [],
    'user': [],
    'new-contact': []
  };
  
  account.contacts.forEach(contact => {
    const role = determineContactRole(contact);
    contactsByRole[role].push(contact);
  });
  
  // Array of all roles for rendering
  const roles: ContactRole[] = ['champion', 'decision-maker', 'influencer', 'user', 'blocker', 'new-contact'];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contact Role Mapping for {account.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <div key={role} className={`border rounded-lg overflow-hidden ${getRoleColors(role)}`}>
                <div className="p-3 flex items-center gap-2 border-b border-inherit font-medium">
                  {getRoleIcon(role)}
                  {getRoleName(role)} ({contactsByRole[role].length})
                </div>
                <div className="divide-y divide-inherit">
                  {contactsByRole[role].length > 0 ? (
                    contactsByRole[role].map(contact => (
                      <div key={contact.id} className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                            <div className="text-sm opacity-80">{contact.title}</div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xs font-medium">Engagement</div>
                            <div className="w-16 bg-white/50 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-current h-1.5 rounded-full" 
                                style={{ width: `${contact.engagementLevel * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs opacity-80">{contact.email}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-center opacity-70">No contacts in this role</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactRoleMapping;
