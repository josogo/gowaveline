
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { templateUrl, formData } = await req.json()

    if (!templateUrl || !formData) {
      return new Response(
        JSON.stringify({ error: 'Template URL and form data are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Fetch the PDF template
    const templateResponse = await fetch(templateUrl)
    if (!templateResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch template PDF' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    const templateBytes = await templateResponse.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templateBytes)
    const form = pdfDoc.getForm()

    // Fill form fields
    console.log('Filling form fields with data:', formData)
    Object.entries(formData).forEach(([key, value]) => {
      try {
        const field = form.getTextField(key)
        if (field) {
          field.setText(value as string)
        } else {
          console.warn(`Field ${key} not found in the PDF form`)
        }
      } catch (error) {
        console.warn(`Error setting field ${key}:`, error)
      }
    })

    // Flatten the form (make it non-editable)
    form.flatten()

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="filled-document.pdf"',
        ...corsHeaders
      }
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
