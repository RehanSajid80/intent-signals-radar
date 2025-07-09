-- Create table to store AI analysis results
CREATE TABLE public.ai_analysis_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  analysis_type TEXT NOT NULL DEFAULT 'zyter-opportunity',
  input_data JSONB NOT NULL,
  analysis_result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NULL
);

-- Enable Row Level Security
ALTER TABLE public.ai_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own analysis cache" 
ON public.ai_analysis_cache 
FOR SELECT 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can create their own analysis cache" 
ON public.ai_analysis_cache 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update their own analysis cache" 
ON public.ai_analysis_cache 
FOR UPDATE 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can delete their own analysis cache" 
ON public.ai_analysis_cache 
FOR DELETE 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Create function to update timestamps
CREATE TRIGGER update_ai_analysis_cache_updated_at
BEFORE UPDATE ON public.ai_analysis_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_ai_analysis_cache_company_type ON public.ai_analysis_cache(company_name, analysis_type);
CREATE INDEX idx_ai_analysis_cache_user_id ON public.ai_analysis_cache(user_id);