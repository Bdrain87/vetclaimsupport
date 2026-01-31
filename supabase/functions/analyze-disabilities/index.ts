import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error('Auth validation failed:', claimsError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const { userData } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing user data for disability suggestions...");
    console.log("Medical visits:", userData.medicalVisits?.length || 0);
    console.log("Exposures:", userData.exposures?.length || 0);
    console.log("Symptoms:", userData.symptoms?.length || 0);
    console.log("Medications:", userData.medications?.length || 0);
    console.log("Service history:", userData.serviceHistory?.length || 0);

const systemPrompt = `You are a VA disability claims expert. Analyze the veteran's documented evidence and suggest VA disabilities they may qualify for based on their medical visits, exposures, symptoms, medications, and service history.

For each suggested disability:
1. Name the specific VA disability condition
2. Explain WHY this veteran may qualify based on their documented evidence
3. Rate the evidence strength (Strong, Moderate, or Needs More Evidence)
4. Suggest what additional evidence might strengthen their claim
5. List common secondary conditions that are frequently linked to this primary disability

Focus on:
- Conditions commonly rated by the VA
- Secondary conditions that may be linked to documented issues
- PACT Act presumptive conditions if they have qualifying exposures (burn pits, chemicals, etc.)
- Mental health conditions if symptoms suggest PTSD, depression, or anxiety

For secondary conditions, include conditions that the VA commonly recognizes as being caused or aggravated by the primary condition. For example:
- PTSD commonly leads to: sleep apnea, depression, anxiety, migraines, hypertension, GERD, erectile dysfunction
- Tinnitus commonly leads to: headaches, depression, anxiety, sleep disorders
- Back conditions commonly lead to: radiculopathy, sciatica, erectile dysfunction, depression
- Knee conditions commonly lead to: hip problems, back problems, gait abnormalities

Be specific about which pieces of the veteran's documented evidence support each suggestion.
Format your response as a JSON array with the structure specified in the tool.`;

    const userMessage = `Please analyze this veteran's documented evidence and suggest VA disabilities they may qualify for:

MEDICAL VISITS:
${userData.medicalVisits?.length > 0 
  ? userData.medicalVisits.map((v: any) => `- ${v.date}: ${v.visitType} at ${v.location}. Reason: ${v.reason}. Diagnosis: ${v.diagnosis}. Treatment: ${v.treatment}`).join('\n')
  : 'No medical visits documented'}

EXPOSURES:
${userData.exposures?.length > 0
  ? userData.exposures.map((e: any) => `- ${e.date}: ${e.type} at ${e.location} for ${e.duration}. Details: ${e.details}. PPE: ${e.ppeProvided ? 'Yes' : 'No'}`).join('\n')
  : 'No exposures documented'}

SYMPTOMS:
${userData.symptoms?.length > 0
  ? userData.symptoms.map((s: any) => `- ${s.date}: ${s.symptom} (${s.bodyArea}). Severity: ${s.severity}/10, Frequency: ${s.frequency}. Impact: ${s.dailyImpact}`).join('\n')
  : 'No symptoms documented'}

MEDICATIONS:
${userData.medications?.length > 0
  ? userData.medications.map((m: any) => `- ${m.name}: Prescribed for ${m.prescribedFor}. Side effects: ${m.sideEffects}. ${m.stillTaking ? 'Currently taking' : 'Stopped'}`).join('\n')
  : 'No medications documented'}

SERVICE HISTORY:
${userData.serviceHistory?.length > 0
  ? userData.serviceHistory.map((s: any) => `- ${s.startDate} to ${s.endDate}: ${s.base}, ${s.unit}. AFSC: ${s.afsc}. Duties: ${s.duties}. Hazards: ${s.hazards}`).join('\n')
  : 'No service history documented'}

Based on this evidence, suggest VA disabilities this veteran may qualify for.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_disabilities",
              description: "Return a list of suggested VA disabilities based on the veteran's evidence",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        condition: { type: "string", description: "Name of the VA disability condition" },
                        category: { type: "string", enum: ["Primary", "Secondary", "PACT Act Presumptive", "Mental Health"] },
                        evidenceStrength: { type: "string", enum: ["Strong", "Moderate", "Needs More Evidence"] },
                        reasoning: { type: "string", description: "Why this veteran may qualify based on their evidence" },
                        supportingEvidence: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Specific pieces of documented evidence that support this claim"
                        },
                        additionalEvidence: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Additional evidence that would strengthen the claim"
                        },
                        typicalRating: { type: "string", description: "Typical VA rating percentage range" },
                        secondaryConditions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              condition: { type: "string", description: "Name of the secondary condition" },
                              connection: { type: "string", description: "How this secondary is connected to the primary" },
                              typicalRating: { type: "string", description: "Typical VA rating for this secondary" }
                            },
                            required: ["condition", "connection", "typicalRating"],
                            additionalProperties: false
                          },
                          description: "Common secondary conditions linked to this primary disability"
                        }
                      },
                      required: ["condition", "category", "evidenceStrength", "reasoning", "supportingEvidence", "additionalEvidence", "typicalRating", "secondaryConditions"],
                      additionalProperties: false
                    }
                  },
                  overallAssessment: { type: "string", description: "Overall assessment of the veteran's documentation" },
                  priorityActions: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Top priority actions to strengthen their claim"
                  }
                },
                required: ["suggestions", "overallAssessment", "priorityActions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_disabilities" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to analyze data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    console.log("AI response received");
    
    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const suggestions = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(suggestions), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback if no tool call
    return new Response(JSON.stringify({ 
      suggestions: [],
      overallAssessment: "Unable to analyze data. Please add more documentation.",
      priorityActions: ["Document more medical visits", "Log any hazardous exposures", "Track symptoms daily"]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-disabilities function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
