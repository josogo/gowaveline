
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

export async function generatePreApplicationForm(data: any): Promise<ArrayBuffer> {
  const {
    businessName = '',
    email = '',
    phone = '',
    website = 'N/A',
    processingVolume = '',
    date = new Date().toLocaleDateString(),
  } = data

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'letter'
  })

  // Brand colors
  const brandColors = {
    pastelOrange: [255, 230, 204],
    oceanBlue: [41, 98, 149],
    neonOrange: [255, 102, 0],
    lightGray: [248, 249, 250],
    darkGray: [52, 58, 64],
    white: [255, 255, 255]
  }

  // Add header
  addFormHeader(doc, date, brandColors)

  // Add tagline bar
  addFormTaglineBar(doc, brandColors)

  // Add business information section
  addBusinessInfoSection(doc, {
    businessName,
    email,
    phone,
    website,
    processingVolume
  }, brandColors)

  // Add additional sections
  addAdditionalInfoSection(doc, brandColors)
  addProcessingInfoSection(doc, brandColors)

  // Add footer
  addFormFooter(doc, brandColors)

  return doc.output('arraybuffer')
}

function addFormHeader(doc: jsPDF, date: string, colors: any) {
  // Header background
  doc.setFillColor(...colors.pastelOrange)
  doc.rect(0, 0, 279, 25, 'F')

  // Company logo (left-aligned)
  doc.setFillColor(...colors.white)
  doc.rect(10, 5, 50, 15, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 35, 11, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(...colors.neonOrange)
  doc.text('Payment Solutions', 35, 15, { align: 'center' })

  // Page title (right-aligned)
  doc.setFontSize(18)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text('Pre-Application Form', 260, 13, { align: 'right' })

  // Date
  doc.setFontSize(10)
  doc.setTextColor(...colors.darkGray)
  doc.text(`Generated: ${date}`, 260, 20, { align: 'right' })
}

function addFormTaglineBar(doc: jsPDF, colors: any) {
  doc.setFillColor(...colors.lightGray)
  doc.rect(0, 25, 279, 12, 'F')

  doc.setFontSize(12)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'italic')
  doc.text('Fast Track Your Merchant Account Approval', 139.5, 32, { align: 'center' })
}

function addBusinessInfoSection(doc: jsPDF, data: any, colors: any) {
  const yStart = 50

  // Section header
  doc.setFillColor(...colors.oceanBlue)
  doc.rect(10, yStart, 120, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Business Information', 15, yStart + 6)

  // Fields
  const fields = [
    { label: 'Business Name:', value: data.businessName },
    { label: 'Email Address:', value: data.email },
    { label: 'Phone Number:', value: data.phone },
    { label: 'Website:', value: data.website },
    { label: 'Monthly Volume:', value: data.processingVolume }
  ]

  let yPos = yStart + 15
  doc.setFontSize(11)

  fields.forEach(field => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.darkGray)
    doc.text(`${field.label}`, 15, yPos)
    
    // Value box
    doc.setFillColor(...colors.white)
    doc.rect(55, yPos - 4, 70, 6, 'F')
    doc.setDrawColor(...colors.lightGray)
    doc.rect(55, yPos - 4, 70, 6, 'S')
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...colors.darkGray)
    doc.text(`${field.value}`, 57, yPos)
    yPos += 10
  })
}

function addAdditionalInfoSection(doc: jsPDF, colors: any) {
  const yStart = 50

  // Section header (right column)
  doc.setFillColor(...colors.neonOrange)
  doc.rect(140, yStart, 120, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Additional Information', 145, yStart + 6)

  // Fields
  const additionalFields = [
    'Business Type (LLC, Corp, etc.):',
    'Years in Business:',
    'Federal Tax ID:',
    'Business Address:',
    'Owner/Officer Name:'
  ]

  let yPos = yStart + 15
  doc.setFontSize(11)

  additionalFields.forEach((field) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.darkGray)
    doc.text(field, 145, yPos)
    
    // Input line
    doc.setDrawColor(...colors.lightGray)
    doc.setLineWidth(0.5)
    doc.line(145, yPos + 2, 255, yPos + 2)
    
    yPos += 10
  })
}

function addProcessingInfoSection(doc: jsPDF, colors: any) {
  const yStart = 130

  // Full width section
  doc.setFillColor(...colors.lightGray)
  doc.rect(10, yStart, 250, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text('Processing Information', 15, yStart + 6)

  const yPos = yStart + 20
  doc.setFontSize(11)
  doc.setTextColor(...colors.darkGray)
  doc.text('Card Types Accepted:', 15, yPos)

  // Checkboxes for card types
  const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover']
  let xPos = 80

  cardTypes.forEach(cardType => {
    doc.rect(xPos, yPos - 4, 4, 4, 'S')
    doc.text(cardType, xPos + 7, yPos)
    xPos += 40
  })
}

function addFormFooter(doc: jsPDF, colors: any) {
  const footerY = 170

  // Footer background
  doc.setFillColor(...colors.oceanBlue)
  doc.rect(0, footerY, 279, 25, 'F')

  // Next steps
  doc.setFontSize(12)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Next Steps', 15, footerY + 8)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('A WaveLine specialist will contact you within 24 hours to complete your application.', 15, footerY + 15)

  // Contact info
  doc.setTextColor(...colors.neonOrange)
  doc.setFont('helvetica', 'bold')
  doc.text('Questions? Call 818-264-6859 or visit gowaveline.com', 15, footerY + 20)
}
