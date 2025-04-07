
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { industryId, leadData } = await req.json();

    if (!industryId) {
      return new Response(JSON.stringify({ error: 'Industry ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Fetch industry details
    const { data: industryData, error: industryError } = await supabaseClient
      .from('industries')
      .select('name, description')
      .eq('id', industryId)
      .single();

    if (industryError || !industryData) {
      return new Response(JSON.stringify({ error: 'Industry not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Fetch template document
    const { data: templates, error: templatesError } = await supabaseClient
      .from('industry_documents')
      .select('*')
      .eq('industry_id', industryId)
      .eq('file_type', 'template');

    if (templatesError || !templates || templates.length === 0) {
      return new Response(JSON.stringify({ error: 'No template found for this industry' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const template = templates[0];

    // For demonstration, create a simple PDF with the information
    // In a real implementation, you would use a PDF library to generate or fill a PDF form
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${industryData.name} Pre-Application Form</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2563eb; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; }
    .value { margin-left: 15px; }
    .section { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
  </style>
</head>
<body>
  <h1>${industryData.name} Pre-Application Form</h1>
  
  <div class="section">
    <h2>Business Information</h2>
    <div class="field">
      <div class="label">Business Name:</div>
      <div class="value">${leadData?.businessName || '_____________________'}</div>
    </div>
    <div class="field">
      <div class="label">Email:</div>
      <div class="value">${leadData?.email || '_____________________'}</div>
    </div>
    <div class="field">
      <div class="label">Phone Number:</div>
      <div class="value">${leadData?.phone || '_____________________'}</div>
    </div>
    <div class="field">
      <div class="label">Website:</div>
      <div class="value">${leadData?.website || '_____________________'}</div>
    </div>
    <div class="field">
      <div class="label">Processing Volume:</div>
      <div class="value">${leadData?.processingVolume || '_____________________'}</div>
    </div>
  </div>

  <div class="section">
    <h2>Owner Information</h2>
    <div class="field">
      <div class="label">Owner Name:</div>
      <div class="value">_____________________</div>
    </div>
    <div class="field">
      <div class="label">Owner Email:</div>
      <div class="value">_____________________</div>
    </div>
    <div class="field">
      <div class="label">Owner Phone:</div>
      <div class="value">_____________________</div>
    </div>
  </div>

  <div class="section">
    <h2>Bank Information</h2>
    <div class="field">
      <div class="label">Bank Name:</div>
      <div class="value">_____________________</div>
    </div>
    <div class="field">
      <div class="label">Account Type:</div>
      <div class="value">_____________________</div>
    </div>
  </div>

  <div class="section">
    <p><small>This is a pre-application form for ${industryData.name}. 
    ${industryData.description || ''}</small></p>
    <p><small>Generated on ${new Date().toLocaleDateString()}</small></p>
  </div>
</body>
</html>
    `;

    // Convert HTML to base64
    // Note: In a real implementation, you would use a PDF library
    const base64Data = btoa(pdfContent);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        pdfBase64: base64Data
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate PDF', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
