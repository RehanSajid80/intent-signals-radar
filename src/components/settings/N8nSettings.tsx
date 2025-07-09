import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const N8nSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebhookUrl();
  }, []);

  const fetchWebhookUrl = async () => {
    setIsLoading(true);
    try {
      // Try to get from user settings first if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      let data, error;
      
      if (user) {
        // User is logged in, get their specific setting
        const result = await supabase
          .from('user_settings')
          .select('setting_value')
          .eq('user_id', user.id)
          .eq('setting_key', 'n8n_webhook_url')
          .single();
        data = result.data;
        error = result.error;
      } else {
        // No user logged in, get the global setting (user_id = null)
        const result = await supabase
          .from('user_settings')
          .select('setting_value')
          .eq('setting_key', 'n8n_webhook_url')
          .is('user_id', null)
          .single();
        data = result.data;
        error = result.error;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching webhook URL:', error);
        return;
      }

      if (data) {
        setWebhookUrl(data.setting_value || "");
      }
    } catch (error) {
      console.error('Error fetching webhook URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebhookUrl = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id || null, // Allow null for anonymous users
          setting_key: 'n8n_webhook_url',
          setting_value: webhookUrl
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "n8n webhook URL saved successfully",
      });
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast({
        title: "Error",
        description: "Failed to save webhook URL",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          <CardTitle>n8n Integration</CardTitle>
        </div>
        <CardDescription>
          Configure your n8n webhook URL for sales intelligence data fetching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">n8n Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://your-n8n-instance.com/webhook/your-endpoint"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            This webhook should return company data in the expected format for the sales intelligence dashboard.
          </p>
        </div>
        
        <Button 
          onClick={saveWebhookUrl} 
          disabled={isSaving || isLoading}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Webhook URL"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default N8nSettings;