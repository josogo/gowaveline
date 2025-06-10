
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { generateMarketingMaterial } from './generators/marketingMaterial.ts'
import { generatePreApplicationForm } from './generators/preApplicationForm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: 'Type and data are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    let pdfBytes: ArrayBuffer

    if (type === 'marketing-material') {
      pdfBytes = await generateMarketingMaterial(data)
    } else if (type === 'preapp') {
      pdfBytes = await generatePreApplicationForm(data)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported document type' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.materialType || 'generated'}-document.pdf"`,
        ...corsHeaders
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
