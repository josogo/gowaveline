
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const { action, accessToken, maxResults, to, subject, body } = await req.json();

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    switch (action) {
      case "listMessages": {
        const queryParams = new URLSearchParams({
          maxResults: String(maxResults || 10),
        });

        // Get list of messages
        const response = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to list messages: ${errorText}`);
        }

        const messagesList = await response.json();
        
        // Get details for each message
        const messages = [];
        for (const message of messagesList.messages || []) {
          const detailsResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          if (detailsResponse.ok) {
            const messageDetails = await detailsResponse.json();
            messages.push(messageDetails);
          }
        }

        return new Response(
          JSON.stringify({ messages }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "sendEmail": {
        if (!to || !subject || !body) {
          throw new Error("To, subject, and body are required");
        }

        // Compose email
        const emailLines = [
          `To: ${to}`,
          `Subject: ${subject}`,
          "Content-Type: text/html; charset=utf-8",
          "",
          body,
        ];
        
        const email = emailLines.join("\r\n");
        
        // Encode in base64
        const encodedEmail = btoa(email)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        // Send email
        const response = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              raw: encodedEmail,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send email: ${errorText}`);
        }

        const result = await response.json();
        return new Response(
          JSON.stringify(result),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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
