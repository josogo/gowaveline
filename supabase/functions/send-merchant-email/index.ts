
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface SendMerchantEmailRequest {
  merchantName: string;
  merchantEmail: string;
  applicationData: any;
  otp?: string;
  applicationId?: string;
  expiresAt?: string;
  resend?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to send merchant email");
    
    const requestData: SendMerchantEmailRequest = await req.json();
    const { 
      merchantName, 
      merchantEmail, 
      applicationId, 
      resend: resendFlag,
      applicationData 
    } = requestData;
    
    // If OTP wasn't provided in the request, try to fetch it from the database
    let otp = requestData.otp;
    
    if (!otp && applicationId) {
      try {
        const { data, error } = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/rest/v1/merchant_applications?id=eq.${applicationId}&select=otp`,
          {
            headers: {
              "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY") || ""}`,
            },
          }
        ).then(res => res.json());

        if (error) throw error;
        if (data && data.length > 0) {
          otp = data[0].otp;
        }
      } catch (err) {
        console.error("Error fetching OTP:", err);
        // Continue with the email sending even if we couldn't fetch the OTP
      }
    }
    
    // Base frontend URL - this should be your deployed frontend URL in production
    const baseUrl = new URL(req.headers.get("origin") || "http://localhost:3000");
    const merchantAppUrl = `${baseUrl.origin}/merchant-application`;
    
    // Create application URL with ID if provided
    const applicationUrl = applicationId 
      ? `${merchantAppUrl}/${applicationId}`
      : merchantAppUrl;
    
    // Create secure URL with application ID
    const secureLink = applicationId 
      ? `${applicationUrl}?email=${encodeURIComponent(merchantEmail)}`
      : applicationUrl;
    
    // Compose email HTML
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0D47A1; padding: 20px; color: white; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
            .otp-box { background-color: #eaeaea; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; }
            .button { background-color: #0D47A1; color: white; padding: 12px 20px; text-decoration: none; display: inline-block; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Complete Your WaveLine Application</h1>
            </div>
            <div class="content">
              <p>Hello ${merchantName},</p>
              <p>${resendFlag ? "A new link has been generated to" : "Please click the button below to"} complete your WaveLine payment processing application.</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${secureLink}" class="button">Access Application</a>
              </p>
              <p>To access your application, you'll need to enter your email and this one-time password:</p>
              <div class="otp-box">${otp || 'Contact Admin for OTP'}</div>
              <p>This link and password will expire in 48 hours.</p>
              <p>If you did not request this application, please disregard this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WaveLine. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    console.log(`Sending email to ${merchantEmail}`);
    
    // Check if we have a valid Resend API key
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Send email with proper error handling
    try {
      const emailResponse = await resend.emails.send({
        from: "WaveLine <admin@gowaveline.com>", // Updated email address
        to: [merchantEmail],
        subject: resendFlag ? "New Link: Complete Your WaveLine Application" : "Complete Your WaveLine Application",
        html: emailHtml,
      });
      
      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (emailError: any) {
      console.error("Resend API error:", emailError);
      throw new Error(`Failed to send email via Resend API: ${emailError.message}`);
    }
  } catch (error: any) {
    console.error("Error sending merchant email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send merchant email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
