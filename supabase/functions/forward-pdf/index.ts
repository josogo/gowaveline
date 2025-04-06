
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/@resend/node"

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
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const { formData, pdfUrl, pdfName, notifyEmail } = await req.json()
    
    if (!formData || !pdfUrl || !pdfName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Create email content
    let formFields = '';
    for (const [key, value] of Object.entries(formData)) {
      formFields += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    
    const htmlContent = `
      <h2>New Form Submission with PDF</h2>
      <p>A new form has been submitted with the following details:</p>
      ${formFields}
      <p>The PDF document is attached to this email.</p>
    `;
    
    // In a real implementation, you would download the PDF and attach it
    // This is a simplified example
    const emailResult = await resend.emails.send({
      from: 'Waveline <notifications@waveline.ai>',
      to: [notifyEmail || 'admin@waveline.ai'],
      subject: 'New Form Submission with PDF',
      html: htmlContent,
      attachments: [
        {
          filename: pdfName,
          path: pdfUrl,
        },
      ],
    });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email sent successfully',
        emailResult
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
