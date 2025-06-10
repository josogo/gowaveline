
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
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add header
  addFormHeader(doc, date)

  // Add business information section
  addBusinessInfoSection(doc, {
    businessName,
    email,
    phone,
    website,
    processingVolume
  })

  // Add additional required information
  addAdditionalInfoSection(doc)

  // Add processing information
  addProcessingInfoSection(doc)

  // Add footer
  addFormFooter(doc)

  return doc.output('arraybuffer')
}

function addFormHeader(doc: jsPDF, date: string) {
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
}

function addBusinessInfoSection(doc: jsPDF, data: any) {
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
    { label: 'Business Name:', value: data.businessName },
    { label: 'Email Address:', value: data.email },
    { label: 'Phone Number:', value: data.phone },
    { label: 'Website:', value: data.website },
    { label: 'Monthly Processing Volume:', value: data.processingVolume }
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
}

function addAdditionalInfoSection(doc: jsPDF) {
  let yPosition = 145
  
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
}

function addProcessingInfoSection(doc: jsPDF) {
  let yPosition = 235
  
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
}

function addFormFooter(doc: jsPDF) {
  const yPosition = 260
  
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
}
