
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot, Account } from "@/context/hubspot";
import { Building, Search, ArrowUpDown, Calendar, PhoneCall, MapPin, Users, Activity } from "lucide-react";

type SortField = 'name' | 'industry' | 'contacts' | 'lastActivity' | 'city' | 'country';
type SortDirection = 'asc' | 'desc';

const AccountsTable = ({ 
  onSelectAccount, 
  accounts: propAccounts 
}: { 
  onSelectAccount: (accountId: string) => void;
  accounts?: Account[];
}) => {
  const { accounts: contextAccounts } = useHubspot();
  const accounts = propAccounts || contextAccounts;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    account.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.city && account.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort accounts based on sort field and direction
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'industry') {
      return sortDirection === 'asc'
        ? (a.industry || '').localeCompare(b.industry || '')
        : (b.industry || '').localeCompare(a.industry || '');
    } else if (sortField === 'contacts') {
      return sortDirection === 'asc'
        ? a.contacts.length - b.contacts.length
        : b.contacts.length - a.contacts.length;
    } else if (sortField === 'city') {
      return sortDirection === 'asc'
        ? (a.city || '').localeCompare(b.city || '')
        : (b.city || '').localeCompare(a.city || '');
    } else if (sortField === 'country') {
      return sortDirection === 'asc'
        ? (a.country || '').localeCompare(b.country || '')
        : (b.country || '').localeCompare(a.country || '');
    }
    return 0;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="h-5 w-5" />
            Accounts Data
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 h-8 hover:bg-transparent"
                      onClick={() => handleSort('name')}
                    >
                      Company Name
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 h-8 hover:bg-transparent"
                      onClick={() => handleSort('industry')}
                    >
                      Industry
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      Last Activity
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <PhoneCall className="mr-2 h-4 w-4 text-muted-foreground" />
                      Times Contacted
                    </div>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 h-8 hover:bg-transparent"
                      onClick={() => handleSort('city')}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      Location
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="font-medium p-0 h-8 hover:bg-transparent"
                      onClick={() => handleSort('contacts')}
                    >
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      Contacts
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                      Lifecycle Stage
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAccounts.length > 0 ? (
                  sortedAccounts.map((account) => (
                    <TableRow 
                      key={account.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectAccount(account.id)}
                    >
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.industry || '-'}</TableCell>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell>{account.contacts.reduce((sum, contact) => sum + (contact.timesContacted || 0), 0)}</TableCell>
                      <TableCell>
                        {account.city && account.country 
                          ? `${account.city}, ${account.country}`
                          : account.city || account.country || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{account.contacts.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                          account.stage === 'closed_won' ? 'bg-green-100 text-green-800' : 
                          account.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {account.stage?.replace('_', ' ')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {accounts.length === 0 ? (
                        <div className="text-muted-foreground">
                          No accounts data available. Import your HubSpot data to see accounts.
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No accounts match your search.
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsTable;
