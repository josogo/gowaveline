
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

  // Add footer with correct contact info
  addFormFooter(doc)

  return doc.output('arraybuffer')
}

function addFormHeader(doc: jsPDF, date: string) {
  // Clean header background
  doc.setFillColor(31, 41, 55)
  doc.rect(0, 0, 210, 50, 'F')

  // Orange accent
  doc.setFillColor(249, 115, 22)
  doc.rect(0, 47, 210, 3, 'F')

  // WaveLine logo area
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 10, 50, 30, 'F')
  doc.setFontSize(16)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 40, 22, { align: 'center' })
  doc.setFontSize(9)
  doc.setTextColor(249, 115, 22)
  doc.text('Payment Solutions', 40, 28, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('High-Risk Specialists', 40, 33, { align: 'center' })

  // Main title
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Pre-Application Form', 125, 22, { align: 'center' })
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(203, 213, 225)
  doc.text('Fast Track Your Merchant Account Approval', 125, 32, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(203, 213, 225)
  doc.text(`Generated: ${date}`, 125, 40, { align: 'center' })
}

function addBusinessInfoSection(doc: jsPDF, data: any) {
  doc.setTextColor(0, 0, 0)
  
  // Business Information section
  doc.setFillColor(249, 250, 251)
  doc.rect(15, 60, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Business Information', 20, 66)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const fields = [
    { label: 'Business Name:', value: data.businessName },
    { label: 'Email Address:', value: data.email },
    { label: 'Phone Number:', value: data.phone },
    { label: 'Website:', value: data.website },
    { label: 'Monthly Processing Volume:', value: data.processingVolume }
  ]
  
  let yPosition = 78
  const lineHeight = 12
  
  fields.forEach(field => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(31, 41, 55)
    doc.text(`${field.label}`, 25, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`${field.value}`, 85, yPosition)
    yPosition += lineHeight
  })
}

function addAdditionalInfoSection(doc: jsPDF) {
  let yPosition = 150
  
  doc.setFillColor(249, 250, 251)
  doc.rect(15, yPosition - 3, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Additional Required Information', 20, yPosition + 3)
  yPosition += 15
  
  doc.setFontSize(10)
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
    doc.text(field, 25, yPosition)
    yPosition += 8
  })
}

function addProcessingInfoSection(doc: jsPDF) {
  let yPosition = 235
  
  doc.setFillColor(249, 250, 251)
  doc.rect(15, yPosition - 3, 180, 8, 'F')
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)
  doc.text('Processing Information', 20, yPosition + 3)
  yPosition += 15
  
  doc.setFontSize(10)
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
  
  // Footer background
  doc.setFillColor(31, 41, 55)
  doc.rect(0, yPosition, 210, 20, 'F')
  
  // Orange accent
  doc.setFillColor(249, 115, 22)
  doc.rect(0, yPosition, 210, 2, 'F')
  
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Next Steps', 20, yPosition + 8)
  
  doc.setFontSize(9)
  doc.setTextColor(203, 213, 225)
  doc.setFont('helvetica', 'normal')
  doc.text('A WaveLine specialist will contact you within 24 hours to complete your application.', 20, yPosition + 13)
  
  // Contact info
  doc.setTextColor(249, 115, 22)
  doc.text('Questions? Call 818-264-6859 or visit gowaveline.com', 20, yPosition + 17)
  
  doc.setFontSize(8)
  doc.setTextColor(203, 213, 225)
  doc.text('Page 1 of 1', 190, 285, { align: 'right' })
}
