import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MURF_API_KEY = Deno.env.get('MURF_API_KEY');
    if (!MURF_API_KEY) {
      throw new Error('MURF_API_KEY is not configured');
    }

    const { text, voiceId = "Natalie", locale = "en-US" } = await req.json();

    if (!text || typeof text !== 'string' || text.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid text parameter (max 2000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MURF_API_KEY,
      },
      body: JSON.stringify({
        text,
        voiceId,
        locale,
        format: "MP3",
        sampleRate: 24000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Murf API error:', JSON.stringify(data));
      throw new Error(`Murf API failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in murf-tts:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
