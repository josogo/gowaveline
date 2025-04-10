
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API keys from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    // Create a Supabase client with the service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '')

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User auth error:', userError);
      throw new Error(`Invalid auth token: ${userError?.message || 'User not found'}`)
    }

    console.log('Authenticated user:', user.id);
    
    // Verify the user has admin role
    const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
      user_id: user.id,
      role: 'admin'
    });
    
    if (roleError) {
      console.error('Role check error:', roleError);
      throw new Error(`Failed to verify admin role: ${roleError.message}`);
    }
    
    if (!hasAdminRole) {
      console.error('User is not admin:', user.id);
      throw new Error('Admin privileges required to generate PDF');
    }
    
    console.log('Admin role verified for user:', user.id);

    // Get the request data
    const { industryId, leadData, formData } = await req.json()
    
    if (!industryId) {
      throw new Error('Industry ID is required')
    }
    
    if (!formData) {
      throw new Error('Form data is required')
    }

    // TODO: Here, you would generate the actual PDF
    // For now, we'll return mock PDF data
    const pdfBase64 = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGFkT9PwzAQxfd8Cq8IKYnrJE5YkCqVAQYGYEBiQO1AwRL/JDJQ8e25NghVgMHy6d7v7t6dWwgkQA8hhIHeQK8tNw48IOxzWEcwJsLwdDAYRAMLfR' // Mock base64 data

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
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
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
