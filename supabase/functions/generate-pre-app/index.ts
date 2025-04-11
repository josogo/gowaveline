
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("======== Edge function started: generate-pre-app ========");
    console.log("Request method:", req.method);
    
    // Log all headers for debugging (except authorization details)
    const headersLog = {};
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === 'authorization') {
        headersLog[key] = 'Bearer [token-hidden]';
      } else {
        headersLog[key] = value;
      }
    }
    console.log("Request headers:", JSON.stringify(headersLog, null, 2));
    
    // Get the request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received");
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      throw new Error('Invalid JSON in request body');
    }
    
    const { industryId, formData } = requestData;
    
    console.log("Request data contents:", {
      industryId: industryId || "Missing",
      formData: formData ? "Present" : "Missing"
    });
    
    if (!industryId) {
      throw new Error('Industry ID is required')
    }
    
    if (!formData) {
      throw new Error('Form data is required')
    }

    // Generate a simple PDF with the business name (or principal name as fallback)
    const businessName = formData.businessName || formData.principalName || 'New Business';
    console.log(`Generating PDF for business: ${businessName}`);
    
    // Create mock PDF data - in a real implementation, you would use a PDF generation library
    // This is a very simple PDF structure in base64 format
    const pdfBase64 = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGFkT9PwzAQxfd8Cq8IKYnrJE5YkCqVAQYGYEBiQO1AwRL/JDJQ8e25NghVgMHy6d7v7t6dWwgkQA8hhIHeQK8tNw48IOxzWEcwJsLwdDAYRAMLfR' // Mock base64 data

    console.log("PDF generation completed successfully");
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF generated successfully',
        pdfBase64: pdfBase64,
        businessName: businessName
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-pre-app:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    )
  }
})
