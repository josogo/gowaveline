
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

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
    // Parse request body
    const { type, data } = await req.json()

    // Validate request
    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: 'Type and data are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    let pdfBytes: ArrayBuffer

    if (type === 'preapp') {
      // Generate a pre-application form
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
        'Content-Disposition': 'attachment; filename="generated-document.pdf"',
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

async function generatePreApplicationForm(data: any): Promise<ArrayBuffer> {
  const {
    businessName = '',
    email = '',
    phone = '',
    website = 'N/A',
    processingVolume = '',
    date = new Date().toLocaleDateString(),
  } = data

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add company logo and header
  doc.setFontSize(22)
  doc.setTextColor(0, 71, 171) // Blue color
  doc.text('WaveLine Payments', 105, 20, { align: 'center' })
  
  // Add document title
  doc.setFontSize(18)
  doc.text('Pre-Application Form', 105, 35, { align: 'center' })

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100) // Gray color
  doc.text(`Generated: ${date}`, 105, 42, { align: 'center' })

  // Add divider
  doc.setDrawColor(220, 220, 220)
  doc.line(20, 45, 190, 45)

  // Set text color to black for the rest of the document
  doc.setTextColor(0, 0, 0)
  
  // Business information section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Business Information', 20, 60)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  // Add form fields
  const fields = [
    { label: 'Business Name:', value: businessName },
    { label: 'Email Address:', value: email },
    { label: 'Phone Number:', value: phone },
    { label: 'Website:', value: website },
    { label: 'Monthly Processing Volume:', value: processingVolume }
  ]
  
  let yPosition = 70
  const lineHeight = 10
  
  fields.forEach(field => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${field.label}`, 20, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.text(`${field.value}`, 80, yPosition)
    yPosition += lineHeight
  })
  
  // Additional required information section
  yPosition += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Additional Required Information', 20, yPosition)
  yPosition += 10
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  // Create form fields to be filled out
  const additionalFields = [
    'Business Type (LLC, Corp, etc.): _______________________________',
    'Years in Business: ___________________________________________',
    'Federal Tax ID: _____________________________________________',
    'Business Address: ___________________________________________',
    'City, State, Zip: ____________________________________________',
    'Owner/Officer Name: _________________________________________',
    'Owner/Officer Title: _________________________________________',
    'Owner/Officer Phone: ________________________________________',
    'Owner/Officer Email: ________________________________________'
  ]
  
  additionalFields.forEach(field => {
    doc.text(field, 20, yPosition)
    yPosition += lineHeight
  })
  
  // Processing information section
  yPosition += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Processing Information', 20, yPosition)
  yPosition += 10
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  // Create checkboxes for card types
  const cardTypes = [
    'Visa', 'MasterCard', 'American Express', 'Discover'
  ]
  
  doc.text('Card Types Accepted:', 20, yPosition)
  
  let xPosition = 80
  cardTypes.forEach(cardType => {
    doc.rect(xPosition, yPosition - 4, 4, 4) // Draw checkbox
    doc.text(cardType, xPosition + 6, yPosition)
    xPosition += 30
  })
  
  yPosition += 20
  
  // Footer with notes
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('This pre-application form is the first step in the approval process.', 20, 260)
  doc.text('A representative will contact you shortly to complete the application.', 20, 265)
  doc.text('For questions, please contact support@wavelinepayments.com', 20, 270)
  
  // Add page number
  doc.setFontSize(10)
  doc.text('Page 1 of 1', 190, 280, { align: 'right' })
  
  // Return PDF as ArrayBuffer
  return doc.output('arraybuffer')
}
