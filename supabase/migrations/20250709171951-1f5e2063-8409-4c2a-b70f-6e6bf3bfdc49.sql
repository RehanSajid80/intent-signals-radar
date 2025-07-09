-- Create table for saved strategy analyses
CREATE TABLE public.saved_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  company_name TEXT NOT NULL,
  strategy_title TEXT NOT NULL,
  analysis_content TEXT NOT NULL,
  analysis_type TEXT NOT NULL DEFAULT 'zyter-opportunity',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_strategies ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved strategies" 
ON public.saved_strategies 
FOR SELECT 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can create their own saved strategies" 
ON public.saved_strategies 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update their own saved strategies" 
ON public.saved_strategies 
FOR UPDATE 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can delete their own saved strategies" 
ON public.saved_strategies 
FOR DELETE 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_strategies_updated_at
BEFORE UPDATE ON public.saved_strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();