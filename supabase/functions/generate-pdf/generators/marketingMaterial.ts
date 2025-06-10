
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
    white: [255, 255, 255],
    green: [34, 197, 94]           // For dual pricing highlight
  }

  // Add header
  addHeader(doc, content.title, materialType, brandColors)

  // Add tagline bar with dual pricing indicator
  addTaglineBar(doc, brandColors, content.dualPricingFocus)

  // Add hero section with image
  await addHeroSection(doc, materialType, content, brandColors)

  // Add content body with dual pricing emphasis
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

function addTaglineBar(doc: jsPDF, colors: any, isDualPricing?: boolean) {
  // Tagline bar background
  doc.setFillColor(...colors.lightGray)
  doc.rect(0, 25, 279, 12, 'F')

  // Tagline text (centered, italic)
  doc.setFontSize(12)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'italic')
  
  if (isDualPricing) {
    doc.text('Dual Pricing Solutions • Reduce Customer Costs • Increase Profit Margins', 139.5, 32, { align: 'center' })
  } else {
    doc.text('Your Partner in High-Risk Merchant Services', 139.5, 32, { align: 'center' })
  }
}

async function addHeroSection(doc: jsPDF, materialType: string, content: any, colors: any) {
  const yStart = 45

  // Hero section background
  doc.setFillColor(...colors.white)
  doc.rect(10, yStart, 259, 60, 'F')
  doc.setDrawColor(...colors.lightGray)
  doc.setLineWidth(0.5)
  doc.rect(10, yStart, 259, 60, 'S')

  // Add stock photo (skip for now to avoid stack overflow)
  // const stockPhotoUrl = getStockPhotoUrl(materialType)

  // Industry summary overlay (text box)
  doc.setFillColor(255, 255, 255, 0.9) // Semi-transparent white
  doc.rect(100, yStart + 10, 160, 40, 'F')
  
  // Different border color for dual pricing materials
  if (content.dualPricingFocus) {
    doc.setDrawColor(...colors.green)
  } else {
    doc.setDrawColor(...colors.neonOrange)
  }
  doc.setLineWidth(2)
  doc.rect(100, yStart + 10, 160, 40, 'S')

  doc.setFontSize(14)
  doc.setTextColor(...colors.oceanBlue)
  doc.setFont('helvetica', 'bold')
  doc.text(content.subtitle, 180, yStart + 20, { align: 'center' })

  // Add dual pricing callout if applicable
  if (content.dualPricingFocus) {
    doc.setFontSize(10)
    doc.setTextColor(...colors.green)
    doc.setFont('helvetica', 'bold')
    doc.text('★ DUAL PRICING SPECIALIST ★', 180, yStart + 30, { align: 'center' })
  }

  doc.setFontSize(10)
  doc.setTextColor(...colors.darkGray)
  doc.setFont('helvetica', 'normal')
  const summaryText = getSummaryText(materialType)
  const lines = doc.splitTextToSize(summaryText, 150)
  const textYPos = content.dualPricingFocus ? yStart + 36 : yStart + 30
  doc.text(lines, 180, textYPos, { align: 'center' })
}

function addContentBody(doc: jsPDF, content: any, colors: any) {
  const yStart = 115

  // Left column - Key Points
  const leftHeaderColor = content.dualPricingFocus ? colors.green : colors.oceanBlue
  doc.setFillColor(...leftHeaderColor)
  doc.rect(10, yStart, 120, 8, 'F')
  doc.setFontSize(14)
  doc.setTextColor(...colors.white)
  doc.setFont('helvetica', 'bold')
  doc.text(content.dualPricingFocus ? 'Dual Pricing Benefits' : 'Key Benefits', 15, yStart + 6)

  let yPos = yStart + 15
  doc.setFontSize(11)
  doc.setTextColor(...colors.darkGray)
  doc.setFont('helvetica', 'normal')

  content.solutions.slice(0, 4).forEach((solution: string, index: number) => {
    // Bullet point
    const bulletColor = content.dualPricingFocus ? colors.green : colors.neonOrange
    doc.setFillColor(...bulletColor)
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

  // Quick Stats section (bottom) - adjusted for dual pricing
  const statsY = 165
  addQuickStats(doc, colors, statsY, content.dualPricingFocus)
}

function addQuickStats(doc: jsPDF, colors: any, yPos: number, isDualPricing?: boolean) {
  const stats = isDualPricing ? [
    { label: 'Save 3-4% on Processing', icon: '💰' },
    { label: 'Transparent Dual Pricing', icon: '📊' },
    { label: 'Cash Discount Programs', icon: '💵' },
    { label: 'Instant Setup Available', icon: '⚡' }
  ] : [
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
    
    // Different border for dual pricing
    const borderColor = isDualPricing ? colors.green : colors.neonOrange
    doc.setDrawColor(...borderColor)
    doc.setLineWidth(1)
    doc.rect(x, yPos, boxWidth, boxHeight, 'S')

    // Icon
    doc.setFontSize(12)
    doc.setTextColor(...borderColor)
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
  doc.text('Call today for dual pricing consultation!', 260, footerY + 10, { align: 'right' })
}

function getIndustryIcon(materialType: string): string {
  const icons = {
    'cbd': '🌿 CBD',
    'adult': '🔒 Adult',
    'firearms': '🛡️ Firearms',
    'vape': '💨 Vape',
    'auto': '🚗 Auto',
    'plasticsurgery': '💎 Plastic Surgery',
    'medspa': '✨ Med Spa',
    'sportsmedicine': '🏃 Sports Medicine',
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
    'auto': 'Streamlined automotive payment processing with dual pricing to reduce customer costs.',
    'plasticsurgery': 'Premium payment solutions for aesthetic practices with dual pricing programs.',
    'medspa': 'Sophisticated payment processing for medical spas with membership and dual pricing options.',
    'sportsmedicine': 'Performance-focused payment solutions with dual pricing and insurance integration.',
    'general': 'Comprehensive high-risk merchant services with industry-leading approval rates.'
  }
  return summaries[materialType as keyof typeof summaries] || summaries.general
}
