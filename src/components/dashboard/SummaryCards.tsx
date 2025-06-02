import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHubspot } from "@/context/hubspot";

const SummaryCards = () => {
  const { accounts, contacts, deals } = useHubspot();

  const totalRevenue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const openDeals = deals.filter(deal => deal.stage !== 'closed_won' && deal.stage !== 'closed_lost').length;
  const closedWonDeals = deals.filter(deal => deal.stage === 'closed_won').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Accounts</CardTitle>
          <CardDescription>Number of accounts in your CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accounts.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Contacts</CardTitle>
          <CardDescription>Number of contacts associated with accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contacts.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Total value of all deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Deals</CardTitle>
          <CardDescription>Deals currently in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openDeals}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Closed Won Deals</CardTitle>
          <CardDescription>Deals successfully closed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{closedWonDeals}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
