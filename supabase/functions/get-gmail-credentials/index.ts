
// This file should already exist, but we'll add the getBookingCredentials functionality
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { action, code, redirectUri } = await req.json()

    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''

    switch (action) {
      case 'getClientId':
        // Return the client ID for frontend auth
        return new Response(
          JSON.stringify({ clientId: GOOGLE_CLIENT_ID }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )

      case 'exchangeCode':
        if (!code || !redirectUri) {
          return new Response(
            JSON.stringify({ error: 'Missing code or redirect URI' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          )
        }

        // Exchange auth code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
          })
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.text()
          console.error('Token exchange error:', errorData)
          return new Response(
            JSON.stringify({ error: 'Failed to exchange authorization code for tokens', details: errorData }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          )
        }

        const tokenData = await tokenResponse.json()
        return new Response(
          JSON.stringify(tokenData),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
        
      case 'getBookingCredentials':
        // In a real app, you would fetch this from a database 
        // or use a service account for a dedicated calendar
        // For demo purposes, we'll just use a stored token
        
        // This is a simplified approach for demo purposes only
        // In production, you would use a database to store admin credentials
        // and implement proper token refreshing
        return new Response(
          JSON.stringify({
            email: 'admin@example.com',  // This would be your organization's email 
            accessToken: Deno.env.get('CALENDAR_ADMIN_TOKEN') || ''
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
