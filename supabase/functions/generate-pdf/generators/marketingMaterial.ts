
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'
import { loadImageAsBase64, getStockPhotoUrl } from '../utils/imageUtils.ts'

export async function generateMarketingMaterial(data: any): Promise<ArrayBuffer> {
  const { materialType, content, companyInfo } = data
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Add header with company branding
  addHeader(doc, content.title, content.subtitle)

  // Add stock photo
  const stockPhotoUrl = getStockPhotoUrl(materialType)
  if (stockPhotoUrl) {
    try {
      const imageBase64 = await loadImageAsBase64(stockPhotoUrl)
      if (imageBase64) {
        doc.addImage(imageBase64, 'JPEG', 15, 60, 180, 80)
      }
    } catch (error) {
      console.error('Failed to add image:', error)
    }
  }

  // Add main content sections
  addChallengesSection(doc, content.challenges)
  addSolutionsSection(doc, content.solutions)
  
  if (content.features && content.features.length > 0) {
    addFeaturesSection(doc, content.features)
  }

  // Add footer
  addFooter(doc, companyInfo)

  return doc.output('arraybuffer')
}

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  // Header background
  doc.setFillColor(249, 115, 22) // Orange
  doc.rect(0, 0, 210, 50, 'F')

  // WaveLine Logo
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 10, 50, 25, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(249, 115, 22)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 40, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(20, 184, 166)
  doc.text('Payment Solutions', 40, 27, { align: 'center' })

  // Main title
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 105, 25, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(subtitle, 105, 35, { align: 'center' })
}

function addChallengesSection(doc: jsPDF, challenges: string[]) {
  let yPosition = 155

  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Industry Challenges', 15, yPosition)

  yPosition += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)

  challenges.slice(0, 4).forEach((challenge) => {
    doc.setFillColor(249, 115, 22)
    doc.circle(17, yPosition - 1, 1, 'F')
    
    const lines = doc.splitTextToSize(challenge, 175)
    doc.text(lines, 22, yPosition)
    yPosition += lines.length * 5 + 3
  })
}

function addSolutionsSection(doc: jsPDF, solutions: string[]) {
  let yPosition = 200

  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Our Solutions', 15, yPosition)

  yPosition += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(31, 41, 55)

  solutions.forEach((solution) => {
    doc.setFillColor(20, 184, 166)
    doc.circle(17, yPosition - 1, 1, 'F')
    
    const lines = doc.splitTextToSize(solution, 175)
    doc.text(lines, 22, yPosition)
    yPosition += lines.length * 5 + 3
  })
}

function addFeaturesSection(doc: jsPDF, features: string[]) {
  let yPosition = 245

  doc.setFillColor(249, 250, 251)
  doc.rect(15, yPosition, 180, 20, 'F')
  
  doc.setFontSize(14)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Features', 20, yPosition + 8)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  let featureX = 20
  let featureY = yPosition + 15
  
  features.forEach((feature) => {
    doc.setFillColor(249, 115, 22)
    doc.circle(featureX, featureY - 1, 0.8, 'F')
    doc.text(feature, featureX + 4, featureY)
    featureX += doc.getTextWidth(feature) + 20
    
    if (featureX > 160) {
      featureX = 20
      featureY += 5
    }
  })
}

function addFooter(doc: jsPDF, companyInfo: any) {
  const yPosition = 275

  doc.setFillColor(248, 250, 252)
  doc.rect(0, yPosition, 210, 20, 'F')
  
  doc.setFillColor(249, 115, 22)
  doc.rect(0, yPosition, 210, 2, 'F')
  
  doc.setFontSize(12)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Contact WaveLine Payment Solutions', 105, yPosition + 8, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  
  const contactInfo = [
    `Email: ${companyInfo.email}`,
    `Phone: ${companyInfo.phone}`,
    `Website: ${companyInfo.website}`
  ]
  
  let contactY = yPosition + 14
  contactInfo.forEach(info => {
    doc.text(info, 105, contactY, { align: 'center' })
    contactY += 3
  })
}
