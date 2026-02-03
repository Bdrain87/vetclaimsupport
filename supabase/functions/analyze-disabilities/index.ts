import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://vetclaimsupport.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_PAYLOAD_SIZE = 500 * 1024;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Generate unique request ID for tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

serve(async (req) => {
  const requestId = generateRequestId();

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      console.error(`[${requestId}] Payload too large: ${contentLength} bytes`);
      return new Response(JSON.stringify({
        error: 'Payload too large. Maximum size is 500KB.',
        code: 'PAYLOAD_TOO_LARGE',
        requestId
      }), {
        status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userData = await req.json();
    if (!userData || typeof userData !== 'object') {
      console.error(`[${requestId}] Invalid request body`);
      return new Response(JSON.stringify({
        error: 'Invalid request. Please provide valid claim data.',
        code: 'INVALID_REQUEST',
        requestId
      }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error(`[${requestId}] Missing GEMINI_API_KEY`);
      return new Response(JSON.stringify({
        error: 'AI service is temporarily unavailable. Please try again later.',
        code: 'SERVICE_UNAVAILABLE',
        requestId
      }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = "You are an expert VA disability claims analyst. Based on the evidence, suggest VA disabilities: " + JSON.stringify(userData);

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[${requestId}] Gemini API error: ${response.status}`);
        return new Response(JSON.stringify({
          error: 'AI analysis could not be completed. Please try again.',
          code: 'AI_ERROR',
          requestId
        }), {
          status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis';

      console.log(`[${requestId}] Analysis completed successfully`);
      return new Response(JSON.stringify({
        analysis: analysisText,
        model: 'gemini-1.5-flash',
        provider: 'google',
        requestId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error(`[${requestId}] Request timeout`);
        return new Response(JSON.stringify({
          error: 'Analysis timed out. Please try again with less data.',
          code: 'TIMEOUT',
          requestId
        }), {
          status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR',
      requestId
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
