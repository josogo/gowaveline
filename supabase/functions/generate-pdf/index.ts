
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdfLib from "https://esm.sh/pdf-lib@1.17.1";

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
    // Get the Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { industryId, leadData } = await req.json();

    if (!industryId) {
      return new Response(
        JSON.stringify({ error: 'Industry ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating PDF for industry: ${industryId}`);

    // Get template document for the industry
    const { data: templateDoc, error: templateError } = await supabaseClient
      .from('industry_documents')
      .select('*')
      .eq('industry_id', industryId)
      .eq('file_type', 'template')
      .single();

    if (templateError || !templateDoc) {
      console.error('Error fetching template:', templateError);
      return new Response(
        JSON.stringify({ error: 'Template not found for this industry' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get industry logo if it exists
    const { data: logoDoc, error: logoError } = await supabaseClient
      .from('industry_documents')
      .select('*')
      .eq('industry_id', industryId)
      .eq('file_type', 'logo')
      .maybeSingle();

    // Download template PDF file
    const { data: templateBuffer, error: downloadError } = await supabaseClient
      .storage
      .from('industry-files')
      .download(templateDoc.file_path);

    if (downloadError) {
      console.error('Error downloading template:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Error downloading PDF template' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download logo if exists
    let logoBuffer = null;
    if (logoDoc && !logoError) {
      const { data: logo, error: logoDownloadError } = await supabaseClient
        .storage
        .from('industry-files')
        .download(logoDoc.file_path);
      
      if (!logoDownloadError) {
        logoBuffer = logo;
      }
    }

    // Get industry information
    const { data: industry, error: industryError } = await supabaseClient
      .from('industries')
      .select('*')
      .eq('id', industryId)
      .single();

    if (industryError) {
      console.error('Error fetching industry:', industryError);
      return new Response(
        JSON.stringify({ error: 'Industry not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load and modify the PDF
    const pdfDoc = await pdfLib.PDFDocument.load(await templateBuffer.arrayBuffer());
    const form = pdfDoc.getForm();

    console.log('PDF loaded, form fields:', Object.keys(form.getFields()).map(f => form.getField(f).getName()));
    
    // Add logo if available
    if (logoBuffer) {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      let logoImage;
      if (logoDoc.file_path.endsWith('.png')) {
        logoImage = await pdfDoc.embedPng(await logoBuffer.arrayBuffer());
      } else if (logoDoc.file_path.toLowerCase().endsWith('.jpg') || logoDoc.file_path.toLowerCase().endsWith('.jpeg')) {
        logoImage = await pdfDoc.embedJpg(await logoBuffer.arrayBuffer());
      }
      
      if (logoImage) {
        // Position in top-right corner
        const { width, height } = firstPage.getSize();
        const logoWidth = 100; // Adjust as needed
        const logoHeight = logoWidth * (logoImage.height / logoImage.width);
        
        firstPage.drawImage(logoImage, {
          x: width - logoWidth - 40,
          y: height - logoHeight - 40,
          width: logoWidth,
          height: logoHeight,
        });
      }
    }

    // Fill form fields with lead data if provided
    if (leadData) {
      try {
        // Business information
        if (leadData.businessName) {
          try { form.getTextField('BusinessName').setText(leadData.businessName); } catch (e) { console.log('Field not found: BusinessName'); }
        }
        if (leadData.address) {
          try { form.getTextField('Address').setText(leadData.address); } catch (e) { console.log('Field not found: Address'); }
        }
        if (leadData.email) {
          try { form.getTextField('Email').setText(leadData.email); } catch (e) { console.log('Field not found: Email'); }
        }
        if (leadData.phone) {
          try { form.getTextField('Phone').setText(leadData.phone); } catch (e) { console.log('Field not found: Phone'); }
        }
        if (leadData.website) {
          try { form.getTextField('Website').setText(leadData.website); } catch (e) { console.log('Field not found: Website'); }
        }
        // Add more field mappings as needed
      } catch (e) {
        console.error('Error filling form fields:', e);
        // Continue even if some fields fail - best effort approach
      }
    }

    // Flatten the form if needed
    // form.flatten(); // Uncomment to make form non-editable

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF
    return new Response(
      pdfBytes,
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${industry.name.replace(/\s+/g, '_')}_pre_application.pdf"`
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-pdf function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
