
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import HubspotConnect from "@/components/hubspot/HubspotConnect";

const UnauthenticatedView = () => {
  return (
    <div className="max-w-2xl mx-auto my-8">
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Connect to HubSpot</h2>
            <p className="text-muted-foreground">
              Connect your HubSpot account to see your leads, accounts, and intent signals.
            </p>
          </div>
          <HubspotConnect />
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-muted/50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Dashboard Preview</h3>
        <p className="text-muted-foreground mb-4">
          Once connected, you'll see data for:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-card p-4 rounded-md border">
            <h4 className="font-medium">Priority Leads</h4>
            <p className="text-sm text-muted-foreground">See your highest priority contacts</p>
          </div>
          <div className="bg-card p-4 rounded-md border">
            <h4 className="font-medium">Account Penetration</h4>
            <p className="text-sm text-muted-foreground">Analyze your account engagement levels</p>
          </div>
          <div className="bg-card p-4 rounded-md border">
            <h4 className="font-medium">Stage Conversions</h4>
            <p className="text-sm text-muted-foreground">Track lead progression through stages</p>
          </div>
          <div className="bg-card p-4 rounded-md border">
            <h4 className="font-medium">Contact Analytics</h4>
            <p className="text-sm text-muted-foreground">Analyze contact owners, lifecycle stages and job titles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedView;
