-- Create contacts table to store HubSpot contact data
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  hubspot_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  company TEXT,
  title TEXT,
  phone TEXT,
  score INTEGER DEFAULT 0,
  priority_level TEXT CHECK (priority_level IN ('high', 'medium', 'low')),
  last_activity DATE,
  engagement_level INTEGER DEFAULT 1,
  owner TEXT,
  lifecycle_stage TEXT,
  last_engagement_date DATE,
  times_contacted INTEGER DEFAULT 0,
  city TEXT,
  country TEXT,
  marketing_status TEXT,
  lead_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hubspot_id)
);

-- Create accounts table to store HubSpot company data
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  hubspot_id TEXT NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  size TEXT,
  stage TEXT CHECK (stage IN ('awareness', 'prospecting', 'qualification', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  penetration_score INTEGER DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  total_revenue DECIMAL DEFAULT 0,
  active_deals INTEGER DEFAULT 0,
  city TEXT,
  country TEXT,
  last_activity DATE,
  times_contacted INTEGER DEFAULT 0,
  buying_roles INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  lead_status TEXT,
  lifecycle_stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hubspot_id)
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contacts
CREATE POLICY "Users can view their own contacts" 
ON public.contacts 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own contacts" 
ON public.contacts 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own contacts" 
ON public.contacts 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts" 
ON public.accounts 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own accounts" 
ON public.accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own accounts" 
ON public.accounts 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own accounts" 
ON public.accounts 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_hubspot_id ON public.contacts(hubspot_id);
CREATE INDEX idx_contacts_company ON public.contacts(company);
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_hubspot_id ON public.accounts(hubspot_id);
CREATE INDEX idx_accounts_name ON public.accounts(name);