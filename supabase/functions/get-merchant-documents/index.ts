
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting fetch documents process in edge function");
    
    // Create Supabase client with service role (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth info
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Verify authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Authenticated user ID: ${user.id}`);

    // Get application ID from query parameters
    const url = new URL(req.url);
    const applicationId = url.searchParams.get('applicationId');
    
    if (!applicationId) {
      console.error("Missing applicationId parameter");
      return new Response(
        JSON.stringify({ error: 'Missing applicationId parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Fetching documents for application: ${applicationId}`);

    // Fetch documents from the database
    const { data: documents, error: dbError } = await supabaseClient
      .from('merchant_documents')
      .select('*')
      .eq('merchant_id', applicationId)
      .order('created_at', { ascending: false });
      
    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Error fetching documents', details: dbError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Found ${documents?.length || 0} documents`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        documents: documents || []
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
