
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Gmail credentials function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const requestBody = await req.json().catch(error => {
      console.error('Error parsing request body:', error);
      return {};
    });
    
    console.log('Request action:', requestBody?.action);
    
    const { action, code, redirectUri } = requestBody;

    // Get Google credentials from environment variables
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';

    console.log('Client ID available:', !!GOOGLE_CLIENT_ID);
    console.log('Client Secret available:', !!GOOGLE_CLIENT_SECRET);
    console.log('Redirect URI received:', redirectUri);

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google credentials in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Missing Google credentials configuration',
          clientIdPresent: !!GOOGLE_CLIENT_ID,
          clientSecretPresent: !!GOOGLE_CLIENT_SECRET
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check configuration
    if (action === 'checkConfig') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          clientIdConfigured: !!GOOGLE_CLIENT_ID,
          clientSecretConfigured: !!GOOGLE_CLIENT_SECRET,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For demo purposes, return a specific set of credentials for the booking page
    if (action === 'getBookingCredentials') {
      // This is a simplified demo - in production you would use stored tokens for a service account
      // or admin account that manages the calendar
      return new Response(
        JSON.stringify({
          email: 'calendar-admin@example.com',
          accessToken: 'demo-access-token-12345' // This is just for demo
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return client ID for auth flow initialization
    if (action === 'getClientId') {
      console.log('Returning client ID for auth flow');
      return new Response(
        JSON.stringify({ clientId: GOOGLE_CLIENT_ID }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange authorization code for tokens
    if (action === 'exchangeCode' && code) {
      console.log('Exchanging code for tokens');
      
      if (!redirectUri) {
        console.error('Missing redirect URI in request');
        return new Response(
          JSON.stringify({ error: 'Missing redirect URI' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Using redirect URI:', redirectUri);
      
      const tokenRequestBody = new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString();
      
      console.log('Making token request to Google OAuth endpoint');
      
      try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: tokenRequestBody,
        });

        const responseStatus = tokenResponse.status;
        console.log('Token response status:', responseStatus);
        
        // Get full response for debugging
        const responseText = await tokenResponse.text();
        console.log('Response body:', responseText);
        
        if (!tokenResponse.ok) {
          console.error('Error exchanging code for tokens:', responseStatus, responseText);
          
          // Create more detailed error message
          return new Response(
            JSON.stringify({ 
              error: `Failed to exchange code: ${responseStatus}`,
              details: responseText,
              requestedRedirectUri: redirectUri
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Parse the response as JSON
        let tokens;
        try {
          tokens = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse token response as JSON:', e);
          return new Response(
            JSON.stringify({ 
              error: 'Invalid token response format', 
              rawResponse: responseText 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('Successfully retrieved tokens');
        
        return new Response(
          JSON.stringify(tokens),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (fetchError) {
        console.error('Network error during token exchange:', fetchError);
        return new Response(
          JSON.stringify({ 
            error: 'Network error during token exchange',
            message: fetchError instanceof Error ? fetchError.message : String(fetchError)
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Invalid request action:', action);
    return new Response(
      JSON.stringify({ error: 'Invalid request', receivedAction: action }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in get-gmail-credentials:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
