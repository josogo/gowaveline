
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
        doc.addImage(imageBase64, 'JPEG', 15, 55, 180, 90)
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

  // Add footer with correct contact info
  addFooter(doc)

  return doc.output('arraybuffer')
}

function addHeader(doc: jsPDF, title: string, subtitle: string) {
  // Clean header background with gradient effect
  doc.setFillColor(31, 41, 55) // Dark blue-gray
  doc.rect(0, 0, 210, 45, 'F')

  // Add subtle accent line
  doc.setFillColor(249, 115, 22) // Orange accent
  doc.rect(0, 42, 210, 3, 'F')

  // WaveLine Logo area - clean white box
  doc.setFillColor(255, 255, 255)
  doc.rect(15, 8, 60, 28, 'F')
  
  // Company logo text
  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 45, 19, { align: 'center' })
  
  doc.setFontSize(9)
  doc.setTextColor(249, 115, 22)
  doc.setFont('helvetica', 'normal')
  doc.text('Payment Solutions', 45, 26, { align: 'center' })
  
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('High-Risk Merchant Services', 45, 31, { align: 'center' })

  // Main title - clean and prominent
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 105, 22, { align: 'center' })
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(203, 213, 225)
  doc.text(subtitle, 105, 32, { align: 'center' })
}

function addChallengesSection(doc: jsPDF, challenges: string[]) {
  let yPosition = 155

  // Section header with background
  doc.setFillColor(248, 250, 252)
  doc.rect(15, yPosition - 5, 180, 12, 'F')
  
  doc.setFontSize(16)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Industry Challenges You Face', 20, yPosition + 3)

  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)

  challenges.slice(0, 4).forEach((challenge, index) => {
    // Modern bullet point
    doc.setFillColor(239, 68, 68) // Red for challenges
    doc.circle(18, yPosition - 1, 1.5, 'F')
    
    const lines = doc.splitTextToSize(challenge, 170)
    doc.text(lines, 25, yPosition)
    yPosition += lines.length * 4.5 + 4
  })
}

function addSolutionsSection(doc: jsPDF, solutions: string[]) {
  let yPosition = 200

  // Section header with background
  doc.setFillColor(240, 253, 244)
  doc.rect(15, yPosition - 5, 180, 12, 'F')

  doc.setFontSize(16)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('How WaveLine Solves These Problems', 20, yPosition + 3)

  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(31, 41, 55)

  solutions.slice(0, 5).forEach((solution, index) => {
    // Green checkmark bullet
    doc.setFillColor(34, 197, 94) // Green for solutions
    doc.circle(18, yPosition - 1, 1.5, 'F')
    
    const lines = doc.splitTextToSize(solution, 170)
    doc.text(lines, 25, yPosition)
    yPosition += lines.length * 4.5 + 4
  })
}

function addFeaturesSection(doc: jsPDF, features: string[]) {
  let yPosition = 250

  // Features box with border
  doc.setFillColor(254, 249, 195) // Light yellow background
  doc.rect(15, yPosition - 3, 180, 22, 'F')
  
  doc.setDrawColor(245, 158, 11) // Yellow border
  doc.setLineWidth(0.5)
  doc.rect(15, yPosition - 3, 180, 22, 'S')
  
  doc.setFontSize(12)
  doc.setTextColor(31, 41, 55)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Features & Benefits', 20, yPosition + 5)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(92, 84, 84)
  
  let featureX = 20
  let featureY = yPosition + 12
  
  features.slice(0, 6).forEach((feature, index) => {
    doc.setFillColor(245, 158, 11)
    doc.circle(featureX, featureY - 1, 0.8, 'F')
    doc.text(feature, featureX + 4, featureY)
    
    featureX += doc.getTextWidth(feature) + 18
    
    if (featureX > 160 || index === 2) {
      featureX = 20
      featureY += 5
    }
  })
}

function addFooter(doc: jsPDF) {
  const yPosition = 275

  // Footer background
  doc.setFillColor(31, 41, 55)
  doc.rect(0, yPosition, 210, 22, 'F')
  
  // Orange accent line
  doc.setFillColor(249, 115, 22)
  doc.rect(0, yPosition, 210, 2, 'F')
  
  // Contact header
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('Ready to Get Started? Contact WaveLine Today', 105, yPosition + 8, { align: 'center' })
  
  // Contact information
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(203, 213, 225)
  
  const contactInfo = [
    'Phone: 818-264-6859  •  Website: gowaveline.com  •  Email: info@gowaveline.com'
  ]
  
  doc.text(contactInfo[0], 105, yPosition + 14, { align: 'center' })
  
  // Call to action
  doc.setFontSize(9)
  doc.setTextColor(249, 115, 22)
  doc.setFont('helvetica', 'italic')
  doc.text('Call today for a free consultation and competitive quote!', 105, yPosition + 19, { align: 'center' })
}
