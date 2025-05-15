
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

const ScoringSettings = () => {
  const [priorityWeights, setPriorityWeights] = useState({
    recentEngagement: 40,
    accountImportance: 30,
    dealStage: 20,
    behavioralIntent: 10
  });
  
  const [thresholds, setThresholds] = useState({
    highPriority: 80,
    mediumPriority: 50
  });

  const handleWeightChange = (key, value) => {
    setPriorityWeights({
      ...priorityWeights,
      [key]: parseInt(value, 10)
    });
  };

  const handleThresholdChange = (key, value) => {
    setThresholds({
      ...thresholds,
      [key]: parseInt(value, 10)
    });
  };

  const handleSave = () => {
    // Save scoring model logic would go here
    console.log("Saving scoring model:", { priorityWeights, thresholds });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoring Model Configuration</CardTitle>
        <CardDescription>
          Customize how lead scores are calculated based on your business needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Priority Weights</h3>
          <p className="text-sm text-muted-foreground">
            Adjust how different factors contribute to the overall priority score
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Recent Engagement</Label>
                <span className="text-sm">{priorityWeights.recentEngagement}%</span>
              </div>
              <Input 
                type="range" 
                min="0" 
                max="100" 
                value={priorityWeights.recentEngagement} 
                onChange={(e) => handleWeightChange('recentEngagement', e.target.value)}
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Account Importance</Label>
                <span className="text-sm">{priorityWeights.accountImportance}%</span>
              </div>
              <Input 
                type="range" 
                min="0" 
                max="100" 
                value={priorityWeights.accountImportance}
                onChange={(e) => handleWeightChange('accountImportance', e.target.value)}
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Deal Stage</Label>
                <span className="text-sm">{priorityWeights.dealStage}%</span>
              </div>
              <Input 
                type="range" 
                min="0" 
                max="100" 
                value={priorityWeights.dealStage}
                onChange={(e) => handleWeightChange('dealStage', e.target.value)}
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Behavioral Intent</Label>
                <span className="text-sm">{priorityWeights.behavioralIntent}%</span>
              </div>
              <Input 
                type="range" 
                min="0" 
                max="100" 
                value={priorityWeights.behavioralIntent}
                onChange={(e) => handleWeightChange('behavioralIntent', e.target.value)}
                className="w-full" 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-medium">Priority Thresholds</h3>
          <p className="text-sm text-muted-foreground">
            Set score thresholds for priority levels
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>High Priority Threshold</Label>
              <Input 
                type="number" 
                value={thresholds.highPriority}
                onChange={(e) => handleThresholdChange('highPriority', e.target.value)}
                min="0" 
                max="100" 
              />
              <p className="text-xs text-muted-foreground">
                Contacts with score above this value are high priority
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Medium Priority Threshold</Label>
              <Input 
                type="number" 
                value={thresholds.mediumPriority}
                onChange={(e) => handleThresholdChange('mediumPriority', e.target.value)}
                min="0" 
                max="100" 
              />
              <p className="text-xs text-muted-foreground">
                Contacts with score above this value are medium priority
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Scoring Model
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScoringSettings;
