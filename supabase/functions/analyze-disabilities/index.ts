import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Allow both production and local development origins
const ALLOWED_ORIGINS = [
  'https://vetclaimsupport.com',
  'https://www.vetclaimsupport.com',
  'https://service-evidence.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const getAllowedOrigin = (origin: string | null): string => {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
};

const getCorsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Max-Age': '86400',
});

const MAX_PAYLOAD_SIZE = 500 * 1024;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Generate unique request ID for tracking
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

serve(async (req) => {
  const requestId = generateRequestId();
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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
      console.error(`[${requestId}] Missing GEMINI_API_KEY environment variable`);
      return new Response(JSON.stringify({
        error: 'AI service is not configured. Please contact support.',
        code: 'SERVICE_UNAVAILABLE',
        details: 'The GEMINI_API_KEY environment variable is not set.',
        requestId
      }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate API key format (should start with "AI")
    if (!GEMINI_API_KEY.startsWith('AI')) {
      console.error(`[${requestId}] Invalid GEMINI_API_KEY format`);
      return new Response(JSON.stringify({
        error: 'AI service configuration error. Please contact support.',
        code: 'INVALID_API_KEY',
        requestId
      }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = typeof userData.prompt === 'string'
      ? userData.prompt
      : "You are an expert VA disability claims analyst. Based on the evidence, suggest VA disabilities: " + JSON.stringify(userData);

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      console.log(`[${requestId}] Calling Gemini API...`);
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
        const errorBody = await response.text();
        console.error(`[${requestId}] Gemini API error: ${response.status} - ${errorBody}`);

        // Parse specific error codes
        let userMessage = 'AI analysis could not be completed. Please try again.';
        let errorCode = 'AI_ERROR';

        if (response.status === 401 || response.status === 403) {
          userMessage = 'AI service authentication failed. The API key may be invalid or expired.';
          errorCode = 'AUTH_ERROR';
        } else if (response.status === 429) {
          userMessage = 'AI service rate limit exceeded. Please wait a moment and try again.';
          errorCode = 'RATE_LIMIT';
        } else if (response.status === 400) {
          userMessage = 'Invalid request to AI service. Please try with different data.';
          errorCode = 'BAD_REQUEST';
        }

        return new Response(JSON.stringify({
          error: userMessage,
          code: errorCode,
          status: response.status,
          requestId
        }), {
          status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();

      // Check for blocked content or other issues
      if (data.promptFeedback?.blockReason) {
        console.error(`[${requestId}] Content blocked: ${data.promptFeedback.blockReason}`);
        return new Response(JSON.stringify({
          error: 'Unable to analyze this content. Please try rephrasing or removing sensitive information.',
          code: 'CONTENT_BLOCKED',
          requestId
        }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
        console.error(`[${requestId}] Request timeout after ${REQUEST_TIMEOUT}ms`);
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
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
