
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth info
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader) {
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

    // Parse request body as JSON (not form data)
    const requestBody = await req.json();
    const { entityId, entityType, docType, fileName, fileType, fileSize, filePath, userName } = requestBody;
    
    if (!entityId || !entityType || !docType || !fileName || !filePath || !fileType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Save document metadata to the appropriate table using service role (bypassing RLS)
    let dbResult;
    if (entityType === 'merchant') {
      dbResult = await supabaseClient
        .from('merchant_documents')
        .insert({
          merchant_id: entityId,
          document_type: docType,
          file_name: fileName,
          file_path: filePath,
          file_type: fileType,
          file_size: fileSize,
          uploaded_by: userName || user.email || 'web_app'
        })
        .select();
    } else {
      // For other entity types (future expansion)
      return new Response(
        JSON.stringify({ error: 'Unsupported entity type' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (dbResult.error) {
      console.error('Database error:', dbResult.error);
      return new Response(
        JSON.stringify({ error: 'Error saving document metadata', details: dbResult.error }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: dbResult.data
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
