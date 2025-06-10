
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'
import { loadImageAsBase64, getStockPhotoUrl } from '../utils/imageUtils.ts'

export async function generateMarketingMaterial(data: any): Promise<ArrayBuffer> {
  const { materialType, content, companyInfo } = data
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'letter' // 8.5" x 11"
  })

  // Brand colors (converting to RGB)
  const brandColors = {
    pastelOrange: [255, 230, 204], // #FFE6CC
    oceanBlue: [41, 98, 149],      // #296295
    neonOrange: [255, 102, 0],     // #FF6600
    lightGray: [248, 249, 250],    // #F8F9FA
    darkGray: [52, 58, 64],        // #343A40
    white: [255, 255, 255]
  }

  // Add header
  addHeader(doc, content.title, materialType, brandColors)

  // Add tagline bar
  addTaglineBar(doc, brandColors)

  // Add hero section with image
  await addHeroSection(doc, materialType, content, brandColors)

  // Add content body
  addContentBody(doc, content, brandColors)

  // Add footer
  addFooter(doc, brandColors)

  return doc.output('arraybuffer')
}

function addHeader(doc: jsPDF, title: string, materialType: string, colors: any) {
  // Header background - light pastel orange
  doc.setFillColor(...colors.pastelOrange)
  doc.rect(0, 0, 279, 25, 'F') // Full width header

  // Company logo area (left-aligned)
  doc.setFillColor(...colors.white)
  doc.rect(10, 5, 50, 15, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text('WaveLine', 35, 11, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(...colors.neonOrange)
  doc.text('Payment Solutions', 35, 15, { align: 'center' })

  // Page title (right-aligned, bold)
  doc.setFontSize(18)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 260, 13, { align: 'right' })

  // Industry icon area
  const industryIcon = getIndustryIcon(materialType)
  doc.setFontSize(10)
  doc.setTextColor(...colors.darkGray)
  doc.text(industryIcon, 220, 13, { align: 'center' })
}

function addTaglineBar(doc: jsPDF, colors: any) {
  // Tagline bar background
  doc.setFillColor(...colors.lightGray)
  doc.rect(0, 25, 279, 12, 'F')

  // Tagline text (centered, italic)
  doc.setFontSize(12)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'italic')
  doc.text('Your Partner in High-Risk Merchant Services', 139.5, 32, { align: 'center' })
}

async function addHeroSection(doc: jsPDF, materialType: string, content: any, colors: any) {
  const yStart = 45

  // Hero section background
  doc.setFillColor(...colors.white)
  doc.rect(10, yStart, 259, 60, 'F')
  doc.setDrawColor(...colors.lightGray)
  doc.setLineWidth(0.5)
  doc.rect(10, yStart, 259, 60, 'S')

  // Add stock photo
  const stockPhotoUrl = getStockPhotoUrl(materialType)
  if (stockPhotoUrl) {
    try {
      const imageBase64 = await loadImageAsBase64(stockPhotoUrl)
      if (imageBase64) {
        doc.addImage(imageBase64, 'JPEG', 15, yStart + 5, 80, 50)
      }
    } catch (error) {
      console.error('Failed to add image:', error)
    }
  }

  // Industry summary overlay (text box)
  doc.setFillColor(255, 255, 255, 0.9) // Semi-transparent white
  doc.rect(100, yStart + 10, 160, 40, 'F')
  doc.setDrawColor(...colors.neonOrange)
  doc.setLineWidth(1)
  doc.rect(100, yStart + 10, 160, 40, 'S')

  doc.setFontSize(14)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text(content.subtitle, 180, yStart + 20, { align: 'center' })

  doc.setFontSize(10)
  doc.setTextColor(...colors.darkGray)
  doc.setFont('helvetica', 'normal')
  const summaryText = getSummaryText(materialType)
  const lines = doc.splitTextToSize(summaryText, 150)
  doc.text(lines, 180, yStart + 28, { align: 'center' })
}

function addContentBody(doc: jsPDF, content: any, colors: any) {
  const yStart = 115

  // Left column - Key Points
  doc.setFillColor(...colors.oceanBlue)
  doc.rect(10, yStart, 120, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Benefits', 15, yStart + 6)

  let yPos = yStart + 15
  doc.setFontSize(11)
  doc.setTextColor(...colors.darkGray)
  doc.setFont('helvetica', 'normal')

  content.solutions.slice(0, 4).forEach((solution: string, index: number) => {
    // Bullet point
    doc.setFillColor(...colors.neonOrange)
    doc.circle(17, yPos - 1, 1.5, 'F')
    
    const lines = doc.splitTextToSize(solution, 105)
    doc.text(lines, 22, yPos)
    yPos += lines.length * 4 + 3
  })

  // Right column - Industry Challenges & Solutions
  doc.setFillColor(...colors.neonOrange)
  doc.rect(140, yStart, 120, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Industry Challenges We Solve', 145, yStart + 6)

  yPos = yStart + 15
  doc.setFontSize(11)
  doc.setTextColor(...colors.darkGray)
  doc.setFont('helvetica', 'normal')

  content.challenges.slice(0, 4).forEach((challenge: string, index: number) => {
    // Problem icon
    doc.setFillColor(220, 53, 69) // Red for problems
    doc.circle(147, yPos - 1, 1.5, 'F')
    
    const lines = doc.splitTextToSize(challenge, 105)
    doc.text(lines, 152, yPos)
    yPos += lines.length * 4 + 3
  })

  // Quick Stats section (bottom)
  const statsY = 165
  addQuickStats(doc, colors, statsY)
}

function addQuickStats(doc: jsPDF, colors: any, yPos: number) {
  const stats = [
    { label: '24hr Approvals', icon: '⚡' },
    { label: '99% Approval Rate', icon: '✓' },
    { label: '20+ Bank Partners', icon: '🏦' },
    { label: 'No Hidden Fees', icon: '💎' }
  ]

  const boxWidth = 60
  const boxHeight = 15
  const spacing = 10
  const startX = (279 - (stats.length * boxWidth + (stats.length - 1) * spacing)) / 2

  stats.forEach((stat, index) => {
    const x = startX + index * (boxWidth + spacing)
    
    // Box background
    doc.setFillColor(...colors.lightGray)
    doc.rect(x, yPos, boxWidth, boxHeight, 'F')
    doc.setDrawColor(...colors.neonOrange)
    doc.setLineWidth(1)
    doc.rect(x, yPos, boxWidth, boxHeight, 'S')

    // Icon
    doc.setFontSize(12)
    doc.setTextColor(...colors.neonOrange)
    doc.text(stat.icon, x + 8, yPos + 9)

    // Label
    doc.setFontSize(9)
    doc.setTextColor(...colors.darkGray)
    doc.setFont('helvetica', 'bold')
    doc.text(stat.label, x + 15, yPos + 9)
  })
}

function addFooter(doc: jsPDF, colors: any) {
  const footerY = 195

  // Footer background
  doc.setFillColor(...colors.oceanBlue)
  doc.rect(0, footerY, 279, 20, 'F')

  // Contact info (left-aligned)
  doc.setFontSize(11)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text('Ready to Get Started?', 15, footerY + 7)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('📞 818-264-6859  |  🌐 gowaveline.com  |  📧 info@gowaveline.com', 15, footerY + 13)

  // Call to action (right-aligned)
  doc.setFontSize(10)
  doc.setTextColor(...colors.neonOrange)
  doc.setFont('helvetica', 'italic')
  doc.text('Call today for a free consultation!', 260, footerY + 10, { align: 'right' })
}

function getIndustryIcon(materialType: string): string {
  const icons = {
    'cbd': '🌿 CBD',
    'adult': '🔒 Adult',
    'firearms': '🛡️ Firearms',
    'vape': '💨 Vape',
    'general': '⚡ High-Risk'
  }
  return icons[materialType as keyof typeof icons] || icons.general
}

function getSummaryText(materialType: string): string {
  const summaries = {
    'cbd': 'Specialized payment processing for hemp and CBD merchants with full compliance expertise.',
    'adult': 'Discreet, reliable processing solutions designed specifically for adult entertainment businesses.',
    'firearms': 'Second Amendment-friendly payment solutions with expertise in firearms regulations.',
    'vape': 'Compliant processing for vaping industry with age verification and fraud protection.',
    'general': 'Comprehensive high-risk merchant services with industry-leading approval rates.'
  }
  return summaries[materialType as keyof typeof summaries] || summaries.general
}
