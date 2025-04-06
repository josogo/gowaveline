
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  type: string;
  subject: string;
  data: Record<string, string | number>;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, subject, data } = await req.json() as EmailData;

    // For now, we're just logging the data
    // In a production environment, this would send an actual email
    console.log(`Email type: ${type}`);
    console.log(`Subject: ${subject}`);
    console.log("Data:", data);

    // Different handling based on email type
    if (type === 'statement') {
      // Statement analysis email logic
      console.log("Processing statement analysis request");
    } else if (type === 'contact') {
      // Contact form submission logic
      console.log("Processing contact form submission");
    } else if (type === 'getStarted') {
      // Get Started form submission logic
      console.log("Processing get started submission");
    } else if (type === 'quiz') {
      // Quiz results submission logic
      console.log("Processing quiz results submission");
    }

    // Use RESEND API to send the email
    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Waveline <onboarding@resend.dev>",
            to: ["admin@example.com"],
            subject: subject,
            html: `<p>New ${type} submission received:</p>
                  <pre>${JSON.stringify(data, null, 2)}</pre>`,
          }),
        });
        
        const responseData = await emailResponse.json();
        console.log("Email sent with Resend:", responseData);
      } catch (error) {
        console.error("Error sending with Resend:", error);
      }
    } else {
      console.log("RESEND_API_KEY not available, email not sent");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
