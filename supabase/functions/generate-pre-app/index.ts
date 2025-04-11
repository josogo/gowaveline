
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("======== Edge function started: generate-pre-app ========");
    console.log("Request method:", req.method);
    
    // Log all headers for debugging (except authorization details)
    const headersLog = {};
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === 'authorization') {
        headersLog[key] = 'Bearer [token-hidden]';
      } else {
        headersLog[key] = value;
      }
    }
    console.log("Request headers:", JSON.stringify(headersLog, null, 2));
    
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      throw new Error('Missing Supabase environment variables')
    }
    
    console.log("Supabase URL and service key are available");

    // Create a Supabase client with the service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("Missing authorization header");
      throw new Error('Missing authorization header')
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '')
    console.log("Token received, verifying user");

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError) {
      console.error('User auth error details:', JSON.stringify(userError, null, 2));
      throw new Error(`Invalid auth token: ${userError.message || 'Unknown authentication error'}`)
    }
    
    if (!user) {
      console.error('User not found in token response');
      throw new Error('User not found in authentication response')
    }

    console.log('Authenticated user:', user.id, '(Email:', user.email, ')');
    
    // We're removing the admin role check - any authenticated user can generate PDFs
    console.log('Authentication successful, proceeding with PDF generation');

    // Get the request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received");
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      throw new Error('Invalid JSON in request body');
    }
    
    const { industryId, leadData, formData } = requestData;
    
    console.log("Request data contents:", {
      industryId: industryId || "Missing",
      formData: formData ? "Present" : "Missing",
      leadData: leadData ? "Present" : "Missing"
    });
    
    if (!industryId) {
      throw new Error('Industry ID is required')
    }
    
    if (!formData) {
      throw new Error('Form data is required')
    }

    // TODO: Here, you would generate the actual PDF
    // For now, we'll return mock PDF data
    console.log("Generating mock PDF data");
    const pdfBase64 = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGFkT9PwzAQxfd8Cq8IKYnrJE5YkCqVAQYGYEBiQO1AwRL/JDJQ8e25NghVgMHy6d7v7t6dWwgkQA8hhIHeQK8tNw48IOxzWEcwJsLwdDAYRAMLfR' // Mock base64 data

    console.log("PDF generation completed successfully");
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF generated successfully',
        pdfBase64: pdfBase64
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-pre-app:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    )
  }
})
