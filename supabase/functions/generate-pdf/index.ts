
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

async function generateMarketingMaterial(data: any): Promise<ArrayBuffer> {
  const { materialType, content, companyInfo } = data
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Define colors (RGB values 0-255)
  const orangeColor = [249, 115, 22] // Orange-500
  const darkOrangeColor = [234, 88, 12] // Orange-600
  const tealColor = [20, 184, 166] // Teal-500
  const grayColor = [75, 85, 99] // Gray-600
  const lightGrayColor = [243, 244, 246] // Gray-100
  const darkGrayColor = [31, 41, 55] // Gray-800
  const whiteColor = [255, 255, 255]

  // Add decorative background elements
  doc.setFillColor(249, 235, 225) // Very light orange
  for (let i = 0; i < 5; i++) {
    doc.circle(50 + i * 60, -20, 40, 'F')
    doc.circle(30 + i * 70, 220, 35, 'F')
  }

  // Header section with gradient effect
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.rect(0, 0, 297, 60, 'F')
  
  // Add darker overlay for gradient effect
  doc.setFillColor(darkOrangeColor[0], darkOrangeColor[1], darkOrangeColor[2])
  doc.rect(0, 45, 297, 15, 'F')

  // Company logo area
  doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.roundedRect(20, 15, 50, 30, 5, 5, 'F')
  
  // Add shadow effect for logo area
  doc.setFillColor(220, 220, 220)
  doc.roundedRect(22, 17, 50, 30, 5, 5, 'F')
  
  // WaveLine logo text
  doc.setFontSize(18)
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 45, 27, { align: 'center' })
  
  // Add wave symbol
  doc.setFontSize(12)
  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2])
  doc.text('~~~', 45, 37, { align: 'center' })

  // Main title
  doc.setFontSize(28)
  doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(content.title, 148, 28, { align: 'center' })
  
  // Subtitle
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text(content.subtitle, 148, 40, { align: 'center' })

  // Company tagline
  doc.setFontSize(12)
  doc.setFont('helvetica', 'italic')
  doc.text(companyInfo.tagline, 148, 50, { align: 'center' })

  // Add decorative lines
  doc.setDrawColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.setLineWidth(2)
  doc.line(80, 25, 210, 25)
  doc.line(80, 55, 210, 55)

  // Main content area
  let yPosition = 75

  // Industry Challenges section
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.roundedRect(15, yPosition - 5, 130, 95, 8, 8, 'F')
  
  // Add border accent
  doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.setLineWidth(3)
  doc.line(15, yPosition - 5, 15, yPosition + 90)
  
  // Challenge icon
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.circle(25, yPosition + 5, 3, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('Industry Challenges', 32, yPosition + 8)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
  let challengeY = yPosition + 20
  
  content.challenges.forEach((challenge: string, index: number) => {
    // Enhanced bullet points
    doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
    doc.circle(22, challengeY - 1, 1.5, 'F')
    
    // Add warning triangle
    doc.setFillColor(234, 179, 8) // Yellow-500
    const triangleSize = 1.5
    doc.triangle(18, challengeY - 2, 18 + triangleSize, challengeY + 1, 18 - triangleSize, challengeY + 1, 'F')
    
    const lines = doc.splitTextToSize(challenge, 115)
    doc.text(lines, 26, challengeY)
    challengeY += lines.length * 5 + 4
  })

  // Our Solutions section
  doc.setFillColor(tealColor[0], tealColor[1], tealColor[2])
  doc.roundedRect(152, yPosition - 5, 130, 95, 8, 8, 'F')
  
  // Add decorative corner elements
  doc.setFillColor(17, 94, 89) // Darker teal
  doc.triangle(152, yPosition - 5, 162, yPosition - 5, 152, yPosition + 5, 'F')
  doc.triangle(272, yPosition - 5, 282, yPosition - 5, 282, yPosition + 5, 'F')
  
  // Solution icon
  doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.circle(162, yPosition + 5, 3, 'F')
  
  doc.setFontSize(18)
  doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('Our Solutions', 169, yPosition + 8)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  let solutionY = yPosition + 20
  
  content.solutions.slice(0, 6).forEach((solution: string, index: number) => {
    // Enhanced bullet points
    doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.circle(164, solutionY - 1, 1.5, 'F')
    
    // Add checkmark
    doc.setFillColor(34, 197, 94) // Green-500
    const checkSize = 1.5
    doc.triangle(160, solutionY - 1, 160 + checkSize, solutionY + 1, 160 - checkSize, solutionY + 1, 'F')
    
    const lines = doc.splitTextToSize(solution, 115)
    doc.text(lines, 168, solutionY)
    solutionY += lines.length * 5 + 4
  })

  // Key Features section
  if (content.features) {
    yPosition = 180
    doc.setFillColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
    doc.roundedRect(15, yPosition - 5, 267, 30, 8, 8, 'F')
    
    // Add decorative elements
    doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
    doc.circle(25, yPosition + 5, 2, 'F')
    doc.circle(272, yPosition + 5, 2, 'F')
    
    doc.setFontSize(16)
    doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
    doc.setFont('helvetica', 'bold')
    doc.text('Key Features:', 30, yPosition + 8)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    let featureX = 30
    let featureY = yPosition + 18
    content.features.forEach((feature: string, index: number) => {
      // Add feature badges
      doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
      doc.roundedRect(featureX - 2, featureY - 6, doc.getTextWidth(`• ${feature}`) + 4, 8, 3, 3, 'F')
      doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2])
      doc.text(`• ${feature}`, featureX, featureY)
      featureX += doc.getTextWidth(`• ${feature}`) + 15
      if (featureX > 240) {
        featureX = 30
        featureY += 10
      }
    })
  }

  // Footer with contact information
  yPosition = 195
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.rect(0, yPosition, 297, 20, 'F')
  
  // Add footer accent line
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.rect(0, yPosition, 297, 3, 'F')
  
  // Contact information
  doc.setFontSize(11)
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
  doc.setFont('helvetica', 'bold')
  
  // Website
  doc.circle(60, yPosition + 10, 2, 'F')
  doc.text('🌐', 58, yPosition + 11)
  doc.text(companyInfo.website, 70, yPosition + 11)
  
  // Phone
  doc.circle(150, yPosition + 10, 2, 'F')
  doc.text('📞', 148, yPosition + 11)
  doc.text(companyInfo.phone, 160, yPosition + 11)
  
  // Email
  doc.circle(240, yPosition + 10, 2, 'F')
  doc.text('✉️', 238, yPosition + 11)
  doc.text(companyInfo.email, 250, yPosition + 11)

  // Add industry-specific styling
  if (materialType === 'cbd') {
    // Green accent elements
    doc.setDrawColor(34, 197, 94) // Green-500
    doc.setLineWidth(3)
    doc.line(15, 65, 282, 65)
    
    // Leaf graphics
    doc.setFillColor(134, 239, 172) // Light green
    for (let i = 0; i < 3; i++) {
      doc.circle(250 + i * 10, 30 + i * 5, 3, 'F')
    }
  } else if (materialType === 'adult') {
    // Purple accent elements
    doc.setDrawColor(147, 51, 234) // Purple-500
    doc.setLineWidth(3)
    doc.line(15, 65, 282, 65)
    
    // Discrete geometric shapes
    doc.setFillColor(196, 181, 253) // Light purple
    doc.circle(260, 35, 8, 'F')
  } else if (materialType === 'firearms') {
    // Red accent
    doc.setDrawColor(239, 68, 68) // Red-500
    doc.setLineWidth(2)
    doc.line(15, 65, 282, 65)
    
    // Shield graphics
    doc.setFillColor(147, 197, 253) // Light blue
    doc.roundedRect(250, 25, 15, 20, 5, 5, 'F')
  } else if (materialType === 'vape') {
    // Blue accent
    doc.setDrawColor(59, 130, 246) // Blue-500
    doc.setLineWidth(3)
    doc.line(15, 65, 282, 65)
    
    // Tech graphics
    doc.setFillColor(147, 197, 253) // Light blue
    for (let i = 0; i < 4; i++) {
      doc.rect(245 + i * 8, 30, 3, 15, 'F')
    }
  }

  // Add QR code placeholder
  doc.setFillColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
  doc.rect(260, 175, 15, 15, 'F')
  doc.setFillColor(whiteColor[0], whiteColor[1], whiteColor[2])
  doc.setFontSize(6)
  doc.text('QR', 267, 183, { align: 'center' })
  doc.setFontSize(8)
  doc.text('Scan for more info', 267, 192, { align: 'center' })

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

  // Define colors
  const orangeColor = [249, 115, 22]
  const darkOrangeColor = [234, 88, 12]
  const grayColor = [100, 100, 100]
  const darkGrayColor = [31, 41, 55]
  const lightGrayColor = [243, 244, 246]

  // Header background
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.rect(0, 0, 210, 50, 'F')
  
  // Gradient effect
  doc.setFillColor(darkOrangeColor[0], darkOrangeColor[1], darkOrangeColor[2])
  doc.rect(0, 35, 210, 15, 'F')

  // WaveLine logo area
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, 10, 40, 25, 3, 3, 'F')
  doc.setFontSize(14)
  doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 35, 20, { align: 'center' })
  doc.setFontSize(10)
  doc.text('~~~', 35, 28, { align: 'center' })

  // Main title
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Pre-Application Form', 105, 25, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'italic')
  doc.text('Your Partner in High-Risk Merchant Services', 105, 35, { align: 'center' })

  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(`Generated: ${date}`, 105, 42, { align: 'center' })

  // Decorative line
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(1)
  doc.line(20, 45, 190, 45)

  // Reset text color for content
  doc.setTextColor(0, 0, 0)
  
  // Business Information section
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.roundedRect(15, 55, 180, 8, 2, 2, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
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
    // Field background
    doc.setFillColor(249, 250, 251)
    doc.rect(20, yPosition - 3, 170, 8, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
    doc.text(`${field.label}`, 25, yPosition + 2)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`${field.value}`, 85, yPosition + 2)
    yPosition += lineHeight
  })
  
  // Additional Required Information section
  yPosition += 10
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.roundedRect(15, yPosition - 3, 180, 8, 2, 2, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
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
  
  additionalFields.forEach((field, index) => {
    // Alternate background colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251)
      doc.rect(20, yPosition - 2, 170, 6, 'F')
    }
    doc.text(field, 25, yPosition + 2)
    yPosition += 8
  })
  
  // Processing Information section
  yPosition += 10
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.roundedRect(15, yPosition - 3, 180, 8, 2, 2, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
  doc.text('Processing Information', 20, yPosition + 3)
  yPosition += 15
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover']
  
  doc.text('Card Types Accepted:', 25, yPosition)
  
  let xPosition = 85
  cardTypes.forEach(cardType => {
    // Checkbox design
    doc.setFillColor(255, 255, 255)
    doc.rect(xPosition, yPosition - 4, 4, 4, 'F')
    doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2])
    doc.setLineWidth(0.5)
    doc.rect(xPosition, yPosition - 4, 4, 4, 'S')
    doc.text(cardType, xPosition + 6, yPosition)
    xPosition += 35
  })
  
  // Footer
  yPosition = 260
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2])
  doc.rect(0, yPosition, 210, 20, 'F')
  
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.rect(0, yPosition, 210, 2, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
  doc.text('This pre-application form is the first step in the approval process.', 20, yPosition + 8)
  doc.text('A representative will contact you shortly to complete the application.', 20, yPosition + 13)
  doc.text('For questions, please contact support@wavelinepayments.com', 20, yPosition + 18)
  
  // Decorative elements
  doc.setFillColor(orangeColor[0], orangeColor[1], orangeColor[2])
  doc.circle(200, yPosition + 10, 3, 'F')
  
  doc.setFontSize(9)
  doc.setTextColor(darkGrayColor[0], darkGrayColor[1], darkGrayColor[2])
  doc.text('Page 1 of 1', 190, 285, { align: 'right' })
  
  return doc.output('arraybuffer')
}
