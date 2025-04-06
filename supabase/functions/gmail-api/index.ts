
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

        console.log("Fetching Gmail messages with access token");
        
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
        console.log(`Retrieved ${messagesList.messages?.length || 0} messages`);
        
        // Get details for each message
        const messages = [];
        for (const message of messagesList.messages || []) {
          console.log(`Fetching details for message: ${message.id}`);
          
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
          } else {
            console.error(`Failed to get details for message ${message.id}`);
          }
        }

        console.log(`Successfully processed ${messages.length} messages`);
        
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

        console.log(`Sending email to ${to} with subject: ${subject}`);
        
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
        console.log("Email sent successfully");
        
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
    console.error("Error in gmail-api function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
