import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyData } = await req.json();

    const prompt = `
You are a sales intelligence analyst. Analyze this company data and provide actionable insights for a salesperson.

Company Data:
- Name: ${companyData.name}
- Domain: ${companyData.domain}
- Industry: ${companyData.industry}
- Lifecycle Stage: ${companyData.lifecycleStage}
- Page Views: ${companyData.pageViews}
- Intent Score: ${companyData.intentScore}
- Created Date: ${new Date(parseInt(companyData.createdDate)).toLocaleDateString()}

Please provide:
1. **Priority Level** (High/Medium/Low) and why
2. **Key Insights** (2-3 bullet points)
3. **Recommended Actions** (specific next steps)
4. **Timing** (when to reach out and why)
5. **Talking Points** (what to discuss based on their activity)

Be specific and actionable. Focus on what a salesperson needs to know RIGHT NOW.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are a sales intelligence AI that provides actionable insights for B2B salespeople. Be concise, specific, and focus on immediate actions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in company-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});