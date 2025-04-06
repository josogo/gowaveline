
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const { action, code, redirectUri } = await req.json();

    // Client ID and secret would be stored in environment variables
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("Google client ID or secret not configured");
    }

    // Handle different actions
    switch (action) {
      case "getClientId":
        return new Response(
          JSON.stringify({ clientId }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      
      case "exchangeCode":
        if (!code || !redirectUri) {
          throw new Error("Code and redirectUri are required for token exchange");
        }

        // Exchange authorization code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
        }

        return new Response(
          JSON.stringify(tokenData),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      
      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
