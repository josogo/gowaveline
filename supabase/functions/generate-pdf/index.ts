
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

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

async function loadImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error('Error loading image:', error)
    return ''
  }
}

async function generateMarketingMaterial(data: any): Promise<ArrayBuffer> {
  const { materialType, content, companyInfo } = data
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Load stock photo based on material type
  let stockPhotoUrl = ''
  switch (materialType) {
    case 'cbd':
      stockPhotoUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'
      break
    case 'adult':
      stockPhotoUrl = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop'
      break
    case 'firearms':
      stockPhotoUrl = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop'
      break
    case 'vape':
      stockPhotoUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'
      break
    default:
      stockPhotoUrl = 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop'
  }

  // Header section with company branding
  doc.setFillColor(249, 115, 22) // Orange
  doc.rect(0, 0, 210, 60, 'F')

  // WaveLine Logo Area
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 15, 50, 30, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(249, 115, 22)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 40, 28, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(20, 184, 166) // Teal
  doc.text('Payment Solutions', 40, 35, { align: 'center' })

  // Main title
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(content.title, 105, 35, { align: 'center' })
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(content.subtitle, 105, 45, { align: 'center' })

  // Add stock photo
  if (stockPhotoUrl) {
    try {
      const imageBase64 = await loadImageAsBase64(stockPhotoUrl)
      if (imageBase64) {
        doc.addImage(imageBase64, 'JPEG', 15, 75, 80, 60)
      }
    } catch (error) {
      console.error('Failed to add image:', error)
    }
  }

  // Main content area
  let yPosition = 75

  // Industry Challenges section
  doc.setFillColor(248, 250, 252) // Light gray background
  doc.rect(105, yPosition, 90, 60, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(31, 41, 55) // Dark gray
  doc.setFont('helvetica', 'bold')
  doc.text('Industry Challenges', 110, yPosition + 10)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99) // Gray
  let challengeY = yPosition + 20
  
  content.challenges.slice(0, 4).forEach((challenge: string, index: number) => {
    doc.setFillColor(249, 115, 22)
    doc.circle(112, challengeY - 1, 1, 'F')
    
    const lines = doc.splitTextToSize(challenge, 75)
    doc.text(lines, 116, challengeY)
    challengeY += lines.length * 4 + 3
  })

  // Solutions section
  yPosition = 145
  doc.setFillColor(20, 184, 166) // Teal
  doc.rect(0, yPosition, 210, 8, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Our Solutions', 105, yPosition + 6, { align: 'center' })

  yPosition += 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(31, 41, 55)
  
  const solutionsPerColumn = Math.ceil(content.solutions.length / 2)
  
  // Left column
  let leftY = yPosition
  content.solutions.slice(0, solutionsPerColumn).forEach((solution: string) => {
    doc.setFillColor(20, 184, 166)
    doc.circle(20, leftY - 1, 1, 'F')
    
    const lines = doc.splitTextToSize(solution, 85)
    doc.text(lines, 24, leftY)
    leftY += lines.length * 5 + 3
  })
  
  // Right column
  let rightY = yPosition
  content.solutions.slice(solutionsPerColumn).forEach((solution: string) => {
    doc.setFillColor(20, 184, 166)
    doc.circle(110, rightY - 1, 1, 'F')
    
    const lines = doc.splitTextToSize(solution, 85)
    doc.text(lines, 114, rightY)
    rightY += lines.length * 5 + 3
  })

  // Key Features section (if available)
  if (content.features && content.features.length > 0) {
    yPosition = Math.max(leftY, rightY) + 10
    
    doc.setFillColor(249, 250, 251)
    doc.rect(15, yPosition, 180, 25, 'F')
    
    doc.setFontSize(14)
    doc.setTextColor(31, 41, 55)
    doc.setFont('helvetica', 'bold')
    doc.text('Key Features', 20, yPosition + 8)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    let featureX = 20
    let featureY = yPosition + 16
    
    content.features.forEach((feature: string, index: number) => {
      doc.setFillColor(249, 115, 22)
      doc.circle(featureX, featureY - 1, 0.8, 'F')
      doc.text(feature, featureX + 4, featureY)
      featureX += doc.getTextWidth(feature) + 25
      
      if (featureX > 160) {
        featureX = 20
        featureY += 6
      }
    })
  }

  // Footer with contact information
  yPosition = 260
  doc.setFillColor(248, 250, 252)
  doc.rect(0, yPosition, 210, 30, 'F')
  
  doc.setFillColor(249, 115, 22)
  doc.rect(0, yPosition, 210, 2, 'F')
  
  doc.setFontSize(12)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Contact WaveLine Payment Solutions', 105, yPosition + 10, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  
  const contactInfo = [
    `📧 ${companyInfo.email}`,
    `📞 ${companyInfo.phone}`,
    `🌐 ${companyInfo.website}`
  ]
  
  let contactY = yPosition + 18
  contactInfo.forEach(info => {
    doc.text(info, 105, contactY, { align: 'center' })
    contactY += 5
  })

  return doc.output('arraybuffer')
}

async function generatePreApplicationForm(data: any): Promise<ArrayBuffer> {
  const {
    businessName = '',
    email = '',
    phone = '',
    website = 'N/A',
    processingVolume = '',
    date = new Date().toLocaleDateString(),
  } = data

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Header background
  doc.setFillColor(249, 115, 22)
  doc.rect(0, 0, 210, 50, 'F')

  // WaveLine logo area
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 10, 40, 25, 'F')
  doc.setFontSize(14)
  doc.setTextColor(249, 115, 22)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 35, 20, { align: 'center' })
  doc.setFontSize(10)
  doc.setTextColor(20, 184, 166)
  doc.text('Payment Solutions', 35, 27, { align: 'center' })

  // Main title
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Pre-Application Form', 105, 25, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'italic')
  doc.text('Your Partner in High-Risk Merchant Services', 105, 35, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Generated: ${date}`, 105, 42, { align: 'center' })

  // Reset text color for content
  doc.setTextColor(0, 0, 0)
  
  // Business Information section
  doc.setFillColor(248, 250, 252)
  doc.rect(15, 55, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Business Information', 20, 61)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const fields = [
    { label: 'Business Name:', value: businessName },
    { label: 'Email Address:', value: email },
    { label: 'Phone Number:', value: phone },
    { label: 'Website:', value: website },
    { label: 'Monthly Processing Volume:', value: processingVolume }
  ]
  
  let yPosition = 72
  const lineHeight = 12
  
  fields.forEach(field => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(31, 41, 55)
    doc.text(`${field.label}`, 25, yPosition + 2)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`${field.value}`, 85, yPosition + 2)
    yPosition += lineHeight
  })
  
  // Additional Required Information section
  yPosition += 10
  doc.setFillColor(248, 250, 252)
  doc.rect(15, yPosition - 3, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Additional Required Information', 20, yPosition + 3)
  yPosition += 15
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
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
  
  additionalFields.forEach((field) => {
    doc.text(field, 25, yPosition + 2)
    yPosition += 8
  })
  
  // Processing Information section
  yPosition += 10
  doc.setFillColor(248, 250, 252)
  doc.rect(15, yPosition - 3, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Processing Information', 20, yPosition + 3)
  yPosition += 15
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover']
  
  doc.text('Card Types Accepted:', 25, yPosition)
  
  let xPosition = 85
  cardTypes.forEach(cardType => {
    doc.rect(xPosition, yPosition - 4, 4, 4, 'S')
    doc.text(cardType, xPosition + 6, yPosition)
    xPosition += 35
  })
  
  // Footer
  yPosition = 260
  doc.setFillColor(248, 250, 252)
  doc.rect(0, yPosition, 210, 20, 'F')
  
  doc.setFillColor(249, 115, 22)
  doc.rect(0, yPosition, 210, 2, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(75, 85, 99)
  doc.text('This pre-application form is the first step in the approval process.', 20, yPosition + 8)
  doc.text('A representative will contact you shortly to complete the application.', 20, yPosition + 13)
  doc.text('For questions, please contact support@wavelinepayments.com', 20, yPosition + 18)
  
  doc.setFontSize(9)
  doc.setTextColor(31, 41, 55)
  doc.text('Page 1 of 1', 190, 285, { align: 'right' })
  
  return doc.output('arraybuffer')
}
