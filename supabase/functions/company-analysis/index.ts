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
    const { companyData, analysisType = 'default' } = await req.json();

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