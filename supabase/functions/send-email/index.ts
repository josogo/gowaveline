
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const TO_EMAIL = "info@gowaveline.com";
const FROM_EMAIL = "notifications@gowaveline.com"; // Make sure this is verified in Resend

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, subject, data } = await req.json();

    if (!type || !subject || !data) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Format email content based on type
    let html = '';
    if (type === 'statement') {
      html = `
        <h2>New Statement Analysis Request</h2>
        <p><strong>From:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <h3>Submitted File:</h3>
        <p><strong>Filename:</strong> ${data.fileName}</p>
        <p><strong>File Type:</strong> ${data.fileType}</p>
        <p><strong>File Size:</strong> ${formatFileSize(data.fileSize)}</p>
        <p><em>This is an automated notification from your Waveline Statement Analysis tool.</em></p>
      `;
    } else {
      // Default email format for other types
      html = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    // Send email through Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: subject,
        html: html,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', result);
      throw new Error(JSON.stringify(result));
    }

    console.log('Email sent successfully:', result);
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully', id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-email function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to format file size to human-readable format
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / 1048576).toFixed(2) + " MB";
}
