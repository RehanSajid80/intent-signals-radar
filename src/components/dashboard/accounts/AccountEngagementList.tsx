import React, { useState } from 'react';
import { useHubspot } from "@/context/hubspot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, ChevronRight, Users } from "lucide-react";

// Define engagement level types
type EngagementLevel = 'not-engaged' | 'slightly-engaged' | 'highly-engaged';

const getEngagementColor = (level: EngagementLevel) => {
  switch (level) {
    case 'not-engaged':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'slightly-engaged':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'highly-engaged':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getEngagementIcon = (level: EngagementLevel) => {
  switch (level) {
    case 'not-engaged':
      return <Circle className="h-4 w-4 text-red-500" />;
    case 'slightly-engaged':
      return <Circle className="h-4 w-4 text-yellow-500" />;
    case 'highly-engaged':
      return <Circle className="h-4 w-4 text-green-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-500" />;
  }
};

// Calculate account engagement based on contacts engagement
const calculateAccountEngagement = (account: Account): EngagementLevel => {
  if (!account.contacts || account.contacts.length === 0) return 'not-engaged';
  
  const highPriorityCount = account.contacts.filter(c => c.priorityLevel === 'high').length;
  const mediumPriorityCount = account.contacts.filter(c => c.priorityLevel === 'medium').length;
  const totalContacts = account.contacts.length;
  
  const engagementScore = (highPriorityCount * 3 + mediumPriorityCount * 1) / totalContacts;
  
  if (engagementScore >= 2) return 'highly-engaged';
  if (engagementScore >= 0.5) return 'slightly-engaged';
  return 'not-engaged';
};

interface AccountEngagementListProps {
  onAccountSelected: (accountId: string) => void;
}

const AccountEngagementList = ({ onAccountSelected }: AccountEngagementListProps) => {
  const { accounts } = useHubspot();
  const [selectedLevel, setSelectedLevel] = useState<EngagementLevel | 'all'>('all');
  
  const accountsByEngagement = {
    'not-engaged': accounts.filter(account => calculateAccountEngagement(account) === 'not-engaged'),
    'slightly-engaged': accounts.filter(account => calculateAccountEngagement(account) === 'slightly-engaged'),
    'highly-engaged': accounts.filter(account => calculateAccountEngagement(account) === 'highly-engaged')
  };
  
  const handleAccountClick = (accountId: string) => {
    onAccountSelected(accountId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => setSelectedLevel('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedLevel === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
        >
          All Accounts
        </button>
        <button 
          onClick={() => setSelectedLevel('not-engaged')}
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${selectedLevel === 'not-engaged' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'}`}
        >
          <Circle className="h-3 w-3" /> Not Engaged
        </button>
        <button 
          onClick={() => setSelectedLevel('slightly-engaged')}
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${selectedLevel === 'slightly-engaged' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}
        >
          <Circle className="h-3 w-3" /> Slightly Engaged
        </button>
        <button 
          onClick={() => setSelectedLevel('highly-engaged')}
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${selectedLevel === 'highly-engaged' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
        >
          <Circle className="h-3 w-3" /> Highly Engaged
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {(selectedLevel === 'all' || selectedLevel === 'not-engaged') && accountsByEngagement['not-engaged'].length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                <Circle className="h-4 w-4 fill-red-500 text-red-500" />
                Not Engaged Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {accountsByEngagement['not-engaged'].map(account => (
                  <div 
                    key={account.id}
                    className="p-4 hover:bg-red-50 cursor-pointer transition-colors flex justify-between items-center"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.industry} · {account.contacts.length} contacts</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{account.contacts.length}</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {(selectedLevel === 'all' || selectedLevel === 'slightly-engaged') && accountsByEngagement['slightly-engaged'].length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader className="bg-yellow-50 rounded-t-lg">
              <CardTitle className="text-lg text-yellow-700 flex items-center gap-2">
                <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                Slightly Engaged Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {accountsByEngagement['slightly-engaged'].map(account => (
                  <div 
                    key={account.id}
                    className="p-4 hover:bg-yellow-50 cursor-pointer transition-colors flex justify-between items-center"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.industry} · {account.contacts.length} contacts</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{account.contacts.length}</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {(selectedLevel === 'all' || selectedLevel === 'highly-engaged') && accountsByEngagement['highly-engaged'].length > 0 && (
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                Highly Engaged Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {accountsByEngagement['highly-engaged'].map(account => (
                  <div 
                    key={account.id}
                    className="p-4 hover:bg-green-50 cursor-pointer transition-colors flex justify-between items-center"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.industry} · {account.contacts.length} contacts</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{account.contacts.length}</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {accounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No accounts found. Import your HubSpot data to see account engagement.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountEngagementList;
