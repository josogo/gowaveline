
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "statement" | "contact" | "getStarted";
  subject: string;
  data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    businessName?: string;
    monthlyVolume?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, subject, data }: EmailRequest = await req.json();
    
    let htmlContent = '';
    
    // Generate different email content based on the submission type
    if (type === "statement") {
      htmlContent = `
        <h1>New Statement Analysis Request</h1>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>File Name:</strong> ${data.fileName || 'Not provided'}</p>
        <p><strong>File Type:</strong> ${data.fileType || 'Not provided'}</p>
        <p><strong>File Size:</strong> ${data.fileSize ? `${(data.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Not provided'}</p>
        <p>The customer has uploaded a statement for analysis. Please follow up with them promptly.</p>
      `;
    } else if (type === "contact") {
      htmlContent = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || 'No message provided'}</p>
      `;
    } else if (type === "getStarted") {
      htmlContent = `
        <h1>New Get Started Application</h1>
        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Business Name:</strong> ${data.businessName || 'Not provided'}</p>
        <p><strong>Monthly Volume:</strong> ${data.monthlyVolume || 'Not provided'}</p>
        <p><strong>File Name:</strong> ${data.fileName || 'No file uploaded'}</p>
        <p><strong>File Type:</strong> ${data.fileType || 'N/A'}</p>
        <p><strong>File Size:</strong> ${data.fileSize ? `${(data.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "WaveLine <noreply@gowaveline.com>",
      to: ["info@gowaveline.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
