import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHubspot } from "@/context/hubspot";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Contact } from "@/types/hubspot";

const AccountDetails = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts } = useHubspot();
  const navigate = useNavigate();

  // Find the account with the matching accountId
  const account = accounts.find(acc => acc.id === accountId);

  if (!account) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-4">
          <Card>
            <CardContent>
              Account not found.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">{account.name}</CardTitle>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <div className="grid gap-4">
              <div>
                <span className="text-sm font-medium">Industry:</span>
                <p className="text-muted-foreground">{account.industry}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Website:</span>
                <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{account.website}</a>
              </div>
              <div>
                <span className="text-sm font-medium">Size:</span>
                <p className="text-muted-foreground">{account.size}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Total Deals:</span>
                <p className="text-muted-foreground">{account.totalDeals}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Total Revenue:</span>
                <p className="text-muted-foreground">${account.totalRevenue}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Active Deals:</span>
                <p className="text-muted-foreground">{account.activeDeals}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Funnel Stage:</span>
                <p className="text-muted-foreground">{account.stage}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Penetration Score:</span>
                <p className="text-muted-foreground">{account.penetrationScore}</p>
              </div>
              {account.cloudProviders && (
                <div>
                  <span className="text-sm font-medium">Cloud Providers:</span>
                  <div className="flex gap-2">
                    {account.cloudProviders.aws && <span className="text-muted-foreground">AWS</span>}
                    {account.cloudProviders.azure && <span className="text-muted-foreground">Azure</span>}
                    {account.cloudProviders.googleCloud && <span className="text-muted-foreground">Google Cloud</span>}
                    {account.cloudProviders.oracle && <span className="text-muted-foreground">Oracle</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Contacts</h4>
              {account.contacts && account.contacts.length > 0 ? (
                <ul className="list-disc pl-5">
                  {account.contacts.map((contact: Contact) => (
                    <li key={contact.id} className="text-muted-foreground">
                      {contact.firstName} {contact.lastName} ({contact.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No contacts associated with this account.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountDetails;
