import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { companyData, analysisType = 'default' } = await req.json();
    const companyName = companyData.company || companyData.name;

    // Check if we have cached analysis for this company and analysis type
    console.log('Checking cache for:', companyName, analysisType);
    const { data: cachedAnalysis, error: cacheError } = await supabase
      .from('ai_analysis_cache')
      .select('analysis_result, created_at')
      .eq('company_name', companyName)
      .eq('analysis_type', analysisType)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheError) {
      console.error('Cache lookup error:', cacheError);
    }

    // If we have cached analysis less than 7 days old, return it
    if (cachedAnalysis) {
      const cacheAge = Date.now() - new Date(cachedAnalysis.created_at).getTime();
      const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (cacheAge < maxCacheAge) {
        console.log('Returning cached analysis for:', companyName);
        return new Response(JSON.stringify({ 
          analysis: cachedAnalysis.analysis_result,
          cached: true,
          cacheAge: Math.floor(cacheAge / (1000 * 60 * 60 * 24)) // days
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    let prompt = '';
    
    if (analysisType === 'zyter-opportunity') {
      // Zyter-specific opportunity analysis
      prompt = `
You are a sales intelligence analyst specializing in healthcare technology and AI solutions. Analyze this opportunity for Zyter.com and provide a comprehensive strategy.

Zyter.com Overview:
- Leading healthcare technology company
- Specializes in AI orchestration, managed care solutions, and population health
- Key platforms: TruCare, Outcomes Orchestrator™
- Focus areas: Healthcare operations, digital transformation, care management

Company Opportunity Data:
- Company: ${companyData.company}
- Relevance Score: ${companyData.zyterRelevanceScore} (${companyData.relevanceLevel} fit)
- Intent Signals: ${companyData.relevantSignals} signals
- Average Score: ${companyData.avgScore}
- Intent Categories: ${companyData.categories.join(', ')}
- Intent Topics: ${companyData.topics.join(', ')}
- Zyter Advantages: ${companyData.advantages.join(', ')}

Recent Intent Activity:
${companyData.companyIntentData.map(item => 
  `- ${item.topic} (${item.category}) - Score: ${item.score} - Date: ${item.date}`
).join('\n')}

Please provide:

1. **ZYTER POSITIONING STRATEGY**
   - How should Zyter position itself specifically to this company?
   - Which Zyter platform(s) are most relevant (TruCare, Outcomes Orchestrator™)?
   - Key value propositions based on their intent signals

2. **MESSAGING & TALKING POINTS**
   - Specific messaging for their intent categories
   - Pain points Zyter can address
   - ROI/outcome metrics to emphasize

3. **SHOWCASE STRATEGY**
   - How should Zyter.com showcase relevant case studies?
   - Which product demonstrations would be most impactful?
   - Industry-specific examples to highlight

4. **ENGAGEMENT RECOMMENDATIONS**
   - Best timing for outreach based on intent signals
   - Recommended touchpoints and frequency
   - Key stakeholders to target

5. **COMPETITIVE DIFFERENTIATION**
   - How to position against likely competitors
   - Unique Zyter advantages for this specific opportunity

6. **NEXT STEPS & ACTION PLAN**
   - Immediate actions for the sales team
   - Content/materials to prepare
   - Follow-up strategy

Be specific to healthcare technology sales and focus on actionable insights that Zyter's sales team can implement immediately.
`;
    } else if (analysisType === 'intent') {
      // Intent-specific analysis
      prompt = `
You are a sales intelligence analyst focusing on intent signal analysis. Analyze this company's intent data and provide actionable insights.

Company Intent Analysis:
- Company: ${companyData.company}
- Total Signals: ${companyData.totalSignals}
- Average Score: ${companyData.avgScore}
- High Score Signals: ${companyData.highScoreSignals}
- Categories: ${companyData.categories.join(', ')}
- Top Topics: ${companyData.topTopics.map(([topic, count]) => `${topic} (${count} signals)`).join(', ')}

Recent Activity:
${companyData.recentActivity.map(item => 
  `- ${item.topic} (${item.category}) - Score: ${item.score} - Date: ${item.date}`
).join('\n')}

Please provide:
1. **Intent Signal Analysis** - What these signals indicate about their buying journey
2. **Engagement Timing** - When and how to reach out based on signal strength
3. **Topic Prioritization** - Which topics show strongest intent and why
4. **Recommended Approach** - Specific talking points and value propositions
5. **Risk Assessment** - Potential challenges or competition indicators
6. **Next Steps** - Immediate actions and follow-up strategy

Focus on actionable insights for sales teams working with intent data.
`;
    } else if (analysisType === 'gtm-intelligence') {
      // GTM Intelligence structured analysis
      prompt = `
You are a B2B GTM Intelligence Agent. Analyze this account and provide structured insights for sales and marketing teams.

Company Data:
- Name: ${companyData.name}
- Domain: ${companyData.domain || 'N/A'}
- Industry: ${companyData.industry || 'N/A'}
- Lifecycle Stage: ${companyData.lifecycleStage || 'N/A'}
- Owner: ${companyData.ownerName || 'Unknown'}
- Page Views: ${companyData.pageViews || 0}
- Intent Score: ${companyData.intentScore || 0}
- Intent Topics: ${companyData.intentTopics?.join(', ') || 'None'}
- Intent Categories: ${companyData.intentCategories?.join(', ') || 'None'}

Return ONLY a valid JSON object with these exact fields:
{
  "bestEntryPoint": "Specific role/persona to target first based on industry and intent",
  "messagingStrategy": "Concise 1-2 sentence messaging approach focusing on their likely pain points",
  "marketingPersona": "Primary persona for marketing campaigns based on industry and stage",
  "contentRecommendations": ["Content type 1", "Content type 2", "Content type 3"]
}

Guidelines:
- For healthcare/medical: Focus on operational efficiency, patient outcomes, compliance
- For technology: Focus on scalability, integration, digital transformation
- For financial services: Focus on security, compliance, customer experience
- For manufacturing: Focus on operational efficiency, supply chain, automation
- High intent scores (60+): Suggest demo, case studies, ROI calculators
- Medium intent (30-60): Suggest whitepapers, webinars, industry reports
- Low/No intent: Suggest educational content, thought leadership, industry insights

No additional text or explanation - only the JSON object.
`;
    } else {
      // Default company analysis
      prompt = `
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
    }

    console.log('Making OpenAI API request for analysis type:', analysisType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using more reliable model
        messages: [
          { 
            role: 'system', 
            content: analysisType === 'zyter-opportunity' 
              ? 'You are a healthcare technology sales intelligence AI specializing in Zyter.com positioning and strategy. Provide detailed, actionable insights for sales teams.'
              : 'You are a sales intelligence AI that provides actionable insights for B2B salespeople. Be concise, specific, and focus on immediate actions.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: analysisType === 'gtm-intelligence' ? 0.1 : 0.3,
        max_tokens: analysisType === 'zyter-opportunity' ? 2000 : (analysisType === 'gtm-intelligence' ? 500 : 1000),
      }),
    });

    console.log('OpenAI API response status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || `OpenAI API error: ${response.status}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const analysis = data.choices[0].message.content;
    console.log('Analysis generated successfully, length:', analysis.length);

    // Save the analysis to cache
    console.log('Saving analysis to cache for:', companyName);
    const { error: saveError } = await supabase
      .from('ai_analysis_cache')
      .insert({
        company_name: companyName,
        analysis_type: analysisType,
        input_data: companyData,
        analysis_result: analysis,
        user_id: null // For now, making it accessible to all users
      });

    if (saveError) {
      console.error('Error saving to cache:', saveError);
      // Don't fail the request if cache save fails
    } else {
      console.log('Analysis saved to cache successfully');
    }

    // For GTM intelligence, try to parse JSON response
    if (analysisType === 'gtm-intelligence') {
      try {
        const parsedAnalysis = JSON.parse(analysis);
        return new Response(JSON.stringify({ 
          ...parsedAnalysis,
          cached: false,
          freshlyGenerated: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Failed to parse GTM intelligence JSON:', parseError);
        // Return default structure if parsing fails
        return new Response(JSON.stringify({
          bestEntryPoint: "Technical Decision Maker",
          messagingStrategy: "Focus on operational efficiency and digital transformation benefits",
          marketingPersona: "IT Operations Manager",
          contentRecommendations: ["Product Demo", "ROI Calculator", "Industry Case Studies"],
          cached: false,
          freshlyGenerated: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ 
      analysis,
      cached: false,
      freshlyGenerated: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in company-analysis function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate analysis';
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      errorMessage = 'OpenAI API quota exceeded. Please check your usage limits.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Network error connecting to OpenAI. Please try again.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});