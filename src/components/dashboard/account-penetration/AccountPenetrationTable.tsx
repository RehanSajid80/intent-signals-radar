
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AccountData {
  name: string;
  contacts: number;
  mqls: number;
  sqls: number;
  penetration: number;
}

interface AccountPenetrationTableProps {
  sortedCompanies: AccountData[];
  sortField: 'penetration' | 'contacts' | 'mqls' | 'sqls';
  setSortField: (field: 'penetration' | 'contacts' | 'mqls' | 'sqls') => void;
}

const AccountPenetrationTable = ({ 
  sortedCompanies, 
  sortField, 
  setSortField 
}: AccountPenetrationTableProps) => {
  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSortField('contacts')}
                  className={cn("p-0 h-auto font-medium", sortField === 'contacts' && "text-primary")}
                >
                  Contacts
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSortField('mqls')}
                  className={cn("p-0 h-auto font-medium", sortField === 'mqls' && "text-primary")}
                >
                  MQLs
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSortField('sqls')}
                  className={cn("p-0 h-auto font-medium", sortField === 'sqls' && "text-primary")}
                >
                  SQLs
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSortField('penetration')}
                  className={cn("p-0 h-auto font-medium", sortField === 'penetration' && "text-primary")}
                >
                  Penetration %
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.map((company, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="text-right">{company.contacts}</TableCell>
                <TableCell className="text-right">{company.mqls}</TableCell>
                <TableCell className="text-right">{company.sqls}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className="mr-2">{company.penetration}%</span>
                    <div className="w-16 bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-purple-500"
                        style={{ width: `${company.penetration}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sortedCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No company data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default AccountPenetrationTable;
