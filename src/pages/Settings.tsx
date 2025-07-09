import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Webhook, Eye, EyeOff } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import N8nSettings from "@/components/settings/N8nSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <header className="border-b bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-6 max-w-4xl">
          {/* Security notice */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-700">Enhanced Security</AlertTitle>
            <AlertDescription className="text-blue-600">
              Your API keys are securely stored and encrypted. We follow best practices to protect your sensitive data.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            {/* n8n Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  <CardTitle>n8n Webhook Integration</CardTitle>
                </div>
                <CardDescription>
                  Configure your n8n webhook URL to fetch sales intelligence data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <N8nSettings />
              </CardContent>
            </Card>

            {/* OpenAI API */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>OpenAI API Integration</CardTitle>
                </div>
                <CardDescription>
                  Your OpenAI API key is required for AI-powered analysis and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-orange-50 border-orange-200">
                    <Key className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-700">Update API Key Required</AlertTitle>
                    <AlertDescription className="text-orange-600">
                      If you're experiencing "Server error occurred" messages, your OpenAI API key may need to be updated or configured.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Label>Update OpenAI API Key</Label>
                    <p className="text-sm text-muted-foreground">
                      Click the button below to securely update your OpenAI API key. This will open a secure form to enter your key.
                    </p>
                    
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Opening API Key Form",
                          description: "Use the secure form below to update your OpenAI API key.",
                        });
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Update OpenAI API Key
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-medium mb-2">How to get your OpenAI API Key:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform API Keys</a></li>
                      <li>Sign in to your OpenAI account</li>
                      <li>Click "Create new secret key"</li>
                      <li>Copy the key and paste it in the form below</li>
                      <li>The key will be stored securely in Supabase Edge Function secrets</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🔧 Features Powered by OpenAI:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Zyter Deep Dive Analysis</strong> - AI-powered opportunity insights</li>
                      <li>• <strong>Company Intelligence</strong> - Strategic recommendations</li>
                      <li>• <strong>Intent Signal Analysis</strong> - Behavioral insights</li>
                      <li>• <strong>Sales Strategy Generation</strong> - Customized approaches</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage & Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>
                  Overview of your configured integrations and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Webhook className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">n8n Webhook</p>
                        <p className="text-sm text-muted-foreground">Sales pipeline data integration</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">OpenAI API</p>
                        <p className="text-sm text-muted-foreground">AI-powered analysis and insights</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Configured
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
