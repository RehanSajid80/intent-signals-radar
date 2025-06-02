import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHubspot } from "@/context/hubspot";

const LeadScoring = () => {
  const { contacts } = useHubspot();

  // Calculate average engagement level
  const totalEngagement = contacts.reduce((sum, contact) => sum + contact.engagementLevel, 0);
  const averageEngagement = contacts.length > 0 ? totalEngagement / contacts.length : 0;

  // Determine lead score based on engagement and priority
  const calculateLeadScore = (contact) => {
    let score = contact.engagementLevel * 5; // Engagement contributes to the score

    if (contact.priorityLevel === "high") {
      score += 20; // High priority contacts get a boost
    } else if (contact.priorityLevel === "medium") {
      score += 10; // Medium priority contacts get a smaller boost
    }

    return Math.min(score, 100); // Ensure score doesn't exceed 100
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Scoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium">
            Average Engagement Level: {averageEngagement.toFixed(2)}
          </div>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="space-y-1">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {contact.firstName} {contact.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: {calculateLeadScore(contact)}
                  </div>
                </div>
                <Progress value={calculateLeadScore(contact)} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadScoring;
