-- Allow anonymous access to user_settings for n8n webhook configuration
-- Add a policy for anonymous users to read settings
CREATE POLICY "Anonymous users can view n8n webhook settings" 
ON public.user_settings 
FOR SELECT 
USING (setting_key = 'n8n_webhook_url');

-- Add a policy for anonymous users to insert settings
CREATE POLICY "Anonymous users can create n8n webhook settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (setting_key = 'n8n_webhook_url');

-- Add a policy for anonymous users to update settings
CREATE POLICY "Anonymous users can update n8n webhook settings" 
ON public.user_settings 
FOR UPDATE 
USING (setting_key = 'n8n_webhook_url');

-- Add a policy for anonymous users to delete settings
CREATE POLICY "Anonymous users can delete n8n webhook settings" 
ON public.user_settings 
FOR DELETE 
USING (setting_key = 'n8n_webhook_url');