
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RECIPIENT_EMAIL = "info@gowaveline.com";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: string;
  subject: string;
  data: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { type, subject, data } = await req.json() as EmailRequest;
    console.log("Email request received:", { type, subject, data });
    
    // Resend API implementation
    const resend = {
      apiKey: Deno.env.get("RESEND_API_KEY"),
      baseUrl: "https://api.resend.com",
    };

    // Build email content based on type
    let htmlContent = "";
    let plainText = "";
    
    switch (type) {
      case "statement":
        htmlContent = `
          <h1>New Statement Analysis Request</h1>
          <p>A new statement has been submitted for analysis.</p>
          <h2>Contact Information:</h2>
          <ul>
            <li><strong>Company:</strong> ${data.company}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
          </ul>
          <h2>File Information:</h2>
          <ul>
            <li><strong>Filename:</strong> ${data.fileName}</li>
            <li><strong>File Type:</strong> ${data.fileType}</li>
            <li><strong>File Size:</strong> ${(data.fileSize / (1024 * 1024)).toFixed(2)} MB</li>
          </ul>
        `;
        plainText = `New Statement Analysis Request\n\nA new statement has been submitted for analysis.\n\nContact Information:\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nFile Information:\nFilename: ${data.fileName}\nFile Type: ${data.fileType}\nFile Size: ${(data.fileSize / (1024 * 1024)).toFixed(2)} MB`;
        break;
        
      case "lead":
        htmlContent = `
          <h1>New Lead Submission</h1>
          <p>A new lead has been submitted through the website.</p>
          <h2>Lead Information:</h2>
          <ul>
            <li><strong>Company:</strong> ${data.company}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
          </ul>
        `;
        plainText = `New Lead Submission\n\nA new lead has been submitted through the website.\n\nLead Information:\nCompany: ${data.company}\nEmail: ${data.email}\nPhone: ${data.phone}`;
        break;
        
      default:
        htmlContent = `<h1>${subject}</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
        plainText = `${subject}\n\n${JSON.stringify(data, null, 2)}`;
    }
    
    // Fake the email sending for now
    console.log("Would send email to:", RECIPIENT_EMAIL);
    console.log("Subject:", subject);
    console.log("Content:", plainText);
    
    // If Resend API key is set, send the email for real
    if (resend.apiKey) {
      const response = await fetch(`${resend.baseUrl}/emails`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resend.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Waveline Website <notifications@gowaveline.com>",
          to: [RECIPIENT_EMAIL],
          subject: subject,
          html: htmlContent,
          text: plainText,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
      }
      
      const result = await response.json();
      console.log("Email sent successfully:", result);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
