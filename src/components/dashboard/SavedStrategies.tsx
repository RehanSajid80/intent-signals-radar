import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, Calendar, Eye, Trash2, Loader2 } from "lucide-react";
import { useSavedStrategies, SavedStrategy } from "@/hooks/useSavedStrategies";
import { format } from "date-fns";

const SavedStrategies: React.FC = () => {
  const { savedStrategies, isLoading, fetchSavedStrategies, deleteStrategy } = useSavedStrategies();
  const [selectedStrategy, setSelectedStrategy] = useState<SavedStrategy | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchSavedStrategies();
  }, []);

  const handleViewStrategy = (strategy: SavedStrategy) => {
    setSelectedStrategy(strategy);
    setIsViewModalOpen(true);
  };

  const handleDeleteStrategy = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      await deleteStrategy(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading saved strategies...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (savedStrategies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No saved strategies yet</p>
            <p className="text-sm text-muted-foreground">
              Generate and save strategies from the Zyter Deep Dive analysis to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Strategies
            <Badge variant="secondary" className="ml-2">
              {savedStrategies.length}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your saved AI-generated strategies for future reference
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{strategy.strategy_title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium">{strategy.company_name}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(strategy.created_at), 'MMM d, yyyy')}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {strategy.analysis_type === 'zyter-opportunity' ? 'Zyter Strategy' : 'Analysis'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewStrategy(strategy)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {strategy.analysis_content.substring(0, 200)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Strategy Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              {selectedStrategy?.strategy_title}
            </DialogTitle>
            <DialogDescription>
              {selectedStrategy?.company_name} • Saved {selectedStrategy ? format(new Date(selectedStrategy.created_at), 'MMM d, yyyy') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStrategy && (
            <ScrollArea className="max-h-[70vh]">
              <div className="prose prose-sm max-w-none p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/30 p-4 rounded border">
                  {selectedStrategy.analysis_content}
                </pre>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedStrategies;