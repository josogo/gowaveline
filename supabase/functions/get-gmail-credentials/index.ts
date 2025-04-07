
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json();
    
    if (action === 'getBookingCredentials') {
      // In a real app, this would fetch from database or secure storage
      // For demo purposes, we're using the service account credentials
      const email = Deno.env.get('ADMIN_EMAIL') || 'admin@example.com';
      const accessToken = Deno.env.get('ADMIN_CALENDAR_TOKEN') || 'demo-token-123';
      
      // Normally you'd validate request authentication here
      
      return new Response(
        JSON.stringify({
          email,
          accessToken
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action specified' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in get-gmail-credentials function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
