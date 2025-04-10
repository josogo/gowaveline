
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { PDFDocument, StandardFonts, rgb } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"

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
    const { formData } = await req.json()

    if (!formData) {
      return new Response(
        JSON.stringify({ error: 'Form data is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    const pdfBytes = await generatePreApplicationForm(formData)
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)))

    return new Response(
      JSON.stringify({ pdfBase64 }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

async function generatePreApplicationForm(data: any): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  
  // Add a blank page to the document
  const page1 = pdfDoc.addPage([612, 792]) // Letter size
  const page2 = pdfDoc.addPage([612, 792]) // Letter size
  const page3 = pdfDoc.addPage([612, 792]) // Letter size
  
  // Embed standard fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  // Set margins
  const margin = 50
  const textSize = 10
  const headerSize = 14
  const subheaderSize = 12
  const smallTextSize = 8
  
  // Helper to draw text with proper alignment
  const drawText = (page: any, text: string, x: number, y: number, options: any = {}) => {
    const { fontSize = textSize, font = helvetica, color = rgb(0, 0, 0) } = options
    page.drawText(text, { x, y, size: fontSize, font, color })
  }

  // Page 1 - Header
  drawText(page1, 'WaveLine Payments', margin, 750, { fontSize: 18, font: helveticaBold, color: rgb(0, 0.4, 0.8) })
  drawText(page1, 'High Risk Merchant Pre-Application Form', margin, 730, { fontSize: headerSize, font: helveticaBold })
  drawText(page1, `Generated: ${new Date().toLocaleDateString()}`, margin, 715, { fontSize: smallTextSize, color: rgb(0.4, 0.4, 0.4) })
  
  page1.drawLine({
    start: { x: margin, y: 710 },
    end: { x: 562, y: 710 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })

  // Page 1 - Business Structure
  drawText(page1, '1. Business Structure', margin, 690, { fontSize: subheaderSize, font: helveticaBold })
  
  const businessStructureOptions = ['Sole Proprietorship', 'Corporation', 'LLC', 'Non-profit (401(c))', 'Government', 'Other']
  let optionX = margin
  
  businessStructureOptions.forEach((option, index) => {
    const selected = data.businessStructure === option
    const box = { x: optionX, y: 673, width: 10, height: 10 }
    page1.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page1.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page1, option, optionX + 15, 675)
    optionX += option.length * 5 + 40
    
    if (index === 2) { // Move to next line after 3 options
      optionX = margin
    }
  })
  
  if (data.businessStructure === 'Other' && data.otherBusinessStructure) {
    drawText(page1, data.otherBusinessStructure, margin + 330, 675)
  }
  
  // Page 1 - Business Information
  drawText(page1, '2. Business Information', margin, 650, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page1, 'Business Name:', margin, 630)
  drawText(page1, data.businessName || '', margin + 120, 630)
  
  drawText(page1, 'Street Address:', margin, 610)
  drawText(page1, data.streetAddress || '', margin + 120, 610)
  
  drawText(page1, 'Mailing Address:', margin, 590)
  drawText(page1, data.mailingAddress || '', margin + 120, 590)
  
  drawText(page1, 'Business Phone:', margin, 570)
  drawText(page1, data.businessPhone || '', margin + 120, 570)
  
  drawText(page1, 'Business Email:', margin, 550)
  drawText(page1, data.businessEmail || '', margin + 120, 550)
  
  drawText(page1, 'Business Fax:', margin, 530)
  drawText(page1, data.businessFax || '', margin + 120, 530)
  
  drawText(page1, 'Customer Service Phone:', margin, 510)
  drawText(page1, data.customerServicePhone || '', margin + 150, 510)
  
  drawText(page1, 'Customer Service Email:', margin, 490)
  drawText(page1, data.customerServiceEmail || '', margin + 150, 490)
  
  drawText(page1, 'Website/URL:', margin, 470)
  drawText(page1, 'http://' + (data.website || ''), margin + 120, 470)
  
  // Page 1 - Authorized Contact
  drawText(page1, '3. Authorized Contact', margin, 450, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page1, 'Full Name:', margin, 430)
  drawText(page1, data.contactName || '', margin + 120, 430)
  
  // Page 1 - Equipment / Software
  drawText(page1, '4. Equipment / Software', margin, 410, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page1, 'Terminal/Gateway Used:', margin, 390)
  drawText(page1, data.terminalGateway || '', margin + 150, 390)
  
  drawText(page1, 'Shopping Cart:', margin, 370)
  drawText(page1, data.shoppingCart || '', margin + 150, 370)
  
  drawText(page1, 'If using Shopify, request Authorize.net Gateway.', margin, 350, { fontSize: smallTextSize, font: helveticaOblique })
  
  // Page 1 - Business Location
  drawText(page1, '5. Business Location', margin, 330, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page1, 'Number of Employees:', margin, 310)
  drawText(page1, data.employeeCount || '', margin + 150, 310)
  
  drawText(page1, 'Location Type:', margin, 290)
  
  const locationTypes = ['Home/Residential', 'Office/Business District', 'Storefront']
  
  locationTypes.forEach((type, index) => {
    const selected = data.locationType === type
    const box = { x: margin + 100 + (index * 150), y: 290, width: 10, height: 10 }
    page1.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page1.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page1, type, margin + 115 + (index * 150), 293)
  })
  
  drawText(page1, 'Own or Rent:', margin, 270)
  
  const ownOrRentOptions = ['Own', 'Rent']
  
  ownOrRentOptions.forEach((option, index) => {
    const selected = data.ownOrRent === option
    const box = { x: margin + 100 + (index * 80), y: 270, width: 10, height: 10 }
    page1.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page1.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page1, option, margin + 115 + (index * 80), 273)
  })
  
  drawText(page1, 'Approx. Square Footage:', margin, 250)
  
  const squareFootageOptions = ['0–500 ft²', '501–2,000 ft²', '2,001–5,000 ft²', '5,000+ ft²']
  let sfOptionX = margin + 150
  
  squareFootageOptions.forEach((option) => {
    const selected = (
      (option === '0–500 ft²' && data.squareFootage === '0-500') ||
      (option === '501–2,000 ft²' && data.squareFootage === '501-2000') ||
      (option === '2,001–5,000 ft²' && data.squareFootage === '2001-5000') ||
      (option === '5,000+ ft²' && data.squareFootage === '5000+')
    )
    
    const box = { x: sfOptionX, y: 250, width: 10, height: 10 }
    page1.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page1.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page1, option, sfOptionX + 15, 253)
    sfOptionX += option.length * 5 + 40
  })
  
  // Page 1 - Principal Information
  drawText(page1, '6. Principal Information', margin, 230, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page1, 'Full Name:', margin, 210)
  drawText(page1, data.principalName || '', margin + 100, 210)
  
  drawText(page1, 'Ownership %:', margin, 190)
  drawText(page1, (data.ownershipPercentage || '') + '%', margin + 100, 190)
  
  const additionalOwnersBox = { x: margin, y: 170, width: 10, height: 10 }
  page1.drawRectangle({ ...additionalOwnersBox, borderColor: rgb(0, 0, 0), borderWidth: 1 })
  
  if (data.hasAdditionalOwners) {
    page1.drawRectangle({ 
      ...additionalOwnersBox, 
      x: additionalOwnersBox.x + 2, 
      y: additionalOwnersBox.y + 2, 
      width: 6, 
      height: 6, 
      color: rgb(0, 0, 0) 
    })
  }
  
  drawText(page1, 'Check here if additional owners/members have 25%+ equity', margin + 15, 173)
  
  drawText(page1, 'Title:', margin, 150)
  drawText(page1, data.title || '', margin + 100, 150)
  
  drawText(page1, 'Home Phone:', margin, 130)
  drawText(page1, data.homePhone || '', margin + 100, 130)
  
  drawText(page1, 'Date of Birth:', margin, 110)
  drawText(page1, data.dateOfBirth || '', margin + 100, 110)
  
  drawText(page1, 'SSN:', margin, 90)
  drawText(page1, data.ssn || '', margin + 100, 90)
  
  drawText(page1, 'Driver\'s License #:', margin, 70)
  drawText(page1, data.driversLicense || '', margin + 100, 70)
  
  drawText(page1, 'Exp Date:', margin + 220, 70)
  drawText(page1, data.licenseExpDate || '', margin + 280, 70)
  
  drawText(page1, 'State:', margin + 350, 70)
  drawText(page1, data.licenseState || '', margin + 390, 70)
  
  drawText(page1, 'Home Address:', margin, 50)
  drawText(page1, data.homeAddress || '', margin + 100, 50)
  
  drawText(page1, 'Personal Email:', margin, 30)
  drawText(page1, data.personalEmail || '', margin + 100, 30)
  
  // Page 1 - Footer
  drawText(page1, 'Page 1 of 3', 540, 15, { fontSize: smallTextSize })
  
  
  //---------- PAGE 2 ----------
  
  // Page 2 - Bank Settlement Information
  drawText(page2, 'WaveLine Payments - Pre-Application Form (continued)', margin, 750, { fontSize: 14, font: helveticaBold, color: rgb(0, 0.4, 0.8) })
  
  drawText(page2, '7. Bank Settlement Information', margin, 720, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page2, 'Bank Name:', margin, 700)
  drawText(page2, data.bankName || '', margin + 150, 700)
  
  drawText(page2, 'Contact Name at Bank:', margin, 680)
  drawText(page2, data.bankContact || '', margin + 150, 680)
  
  drawText(page2, 'Routing Number:', margin, 660)
  drawText(page2, data.routingNumber || '', margin + 150, 660)
  
  drawText(page2, 'Account Number:', margin, 640)
  drawText(page2, data.accountNumber || '', margin + 150, 640)
  
  // Page 2 - Business Description
  drawText(page2, '8. Business Description', margin, 620, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page2, 'Products/Services Sold:', margin, 600)
  drawText(page2, data.productsServices || '', margin + 150, 600)
  
  drawText(page2, 'Years in Operation:', margin, 580)
  drawText(page2, data.yearsInOperation || '', margin + 150, 580)
  
  drawText(page2, 'Storage Location (if applicable):', margin, 560)
  drawText(page2, data.storageLocation || '', margin + 200, 560)
  
  // Page 2 - Processing Volume
  drawText(page2, '9. Processing Volume', margin, 540, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page2, 'Estimated Total Monthly Volume:', margin, 520)
  drawText(page2, '$' + (data.monthlyVolume || ''), margin + 200, 520)
  
  drawText(page2, 'Visa/Mastercard Volume:', margin, 500)
  drawText(page2, '$' + (data.visaMastercardVolume || ''), margin + 200, 500)
  
  drawText(page2, 'American Express Volume:', margin, 480)
  drawText(page2, '$' + (data.amexVolume || ''), margin + 200, 480)
  
  drawText(page2, 'Average Ticket:', margin, 460)
  drawText(page2, '$' + (data.averageTicket || ''), margin + 200, 460)
  
  drawText(page2, 'Highest Ticket:', margin, 440)
  drawText(page2, '$' + (data.highestTicket || ''), margin + 200, 440)
  
  // Page 2 - Transaction Method
  drawText(page2, '10. Transaction Method (Must Equal 100%)', margin, 420, { fontSize: subheaderSize, font: helveticaBold })
  
  const txMethodTypes = [
    { label: 'Face-to-Face (Retail):', value: data.faceToFacePercent || '0', y: 400 },
    { label: 'Telephone/Mail/Email (MOTO):', value: data.motoPercent || '0', y: 380 },
    { label: 'Internet (eCommerce):', value: data.ecommercePercent || '0', y: 360 }
  ]
  
  txMethodTypes.forEach(item => {
    drawText(page2, item.label, margin, item.y)
    drawText(page2, item.value + '%', margin + 200, item.y)
  })
  
  const totalPercentage = 
    parseInt(data.faceToFacePercent || '0') + 
    parseInt(data.motoPercent || '0') + 
    parseInt(data.ecommercePercent || '0')
    
  if (totalPercentage !== 100) {
    drawText(page2, 'Note: Total should equal 100% (Current: ' + totalPercentage + '%)', margin, 340, { font: helveticaOblique, color: rgb(0.8, 0, 0) })
  }
  
  // Page 2 - Refund Policy
  drawText(page2, '11. Refund / Cancellation Policy', margin, 320, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page2, 'Do you have a refund policy?', margin, 300)
  
  const refundPolicyOptions = ['Yes', 'No']
  refundPolicyOptions.forEach((option, index) => {
    const selected = data.hasRefundPolicy === option
    const box = { x: margin + 200 + (index * 80), y: 300, width: 10, height: 10 }
    
    page2.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page2.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page2, option, box.x + 15, box.y + 3)
  })
  
  if (data.hasRefundPolicy === 'Yes') {
    drawText(page2, 'Policy Type:', margin, 280)
    
    const policyTypes = ['Exchange', 'Store Credit', 'Refund within 30 days', 'Other']
    
    policyTypes.forEach((type, index) => {
      const selected = data.refundPolicyType === type
      const box = { x: margin + 100, y: 280 - (index * 20), width: 10, height: 10 }
      
      page2.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
      
      if (selected) {
        page2.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
      }
      
      drawText(page2, type, box.x + 15, box.y + 3)
      
      if (type === 'Other' && selected && data.otherRefundPolicy) {
        drawText(page2, data.otherRefundPolicy, box.x + 70, box.y + 3)
      }
    })
  }
  
  const processingHistoryY = data.hasRefundPolicy === 'Yes' ? 200 : 260
  
  drawText(page2, 'Processing History?', margin, processingHistoryY)
  
  const historyOptions = ['Yes', 'No']
  historyOptions.forEach((option, index) => {
    const selected = data.hasProcessingHistory === option
    const box = { x: margin + 200 + (index * 80), y: processingHistoryY, width: 10, height: 10 }
    
    page2.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page2.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page2, option, box.x + 15, box.y + 3)
  })
  
  if (data.hasProcessingHistory === 'Yes') {
    drawText(page2, '(Attach 3 most recent processing statements)', margin + 300, processingHistoryY, { fontSize: smallTextSize, font: helveticaOblique })
  }
  
  drawText(page2, 'Current/Previous Processor(s):', margin, processingHistoryY - 20)
  drawText(page2, data.previousProcessor || '', margin + 200, processingHistoryY - 20)
  
  drawText(page2, 'Previous Terminations?', margin, processingHistoryY - 40)
  
  const terminationsOptions = ['Yes', 'No']
  terminationsOptions.forEach((option, index) => {
    const selected = data.hasPreviousTerminations === option
    const box = { x: margin + 200 + (index * 80), y: processingHistoryY - 40, width: 10, height: 10 }
    
    page2.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page2.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page2, option, box.x + 15, box.y + 3)
  })
  
  if (data.hasPreviousTerminations === 'Yes' && data.terminationsExplanation) {
    drawText(page2, 'Explanation:', margin, processingHistoryY - 60)
    drawText(page2, data.terminationsExplanation, margin + 100, processingHistoryY - 60)
  }
  
  let bankruptciesY = processingHistoryY - 80
  if (data.hasPreviousTerminations === 'Yes') {
    bankruptciesY = processingHistoryY - 100
  }
  
  drawText(page2, 'Bankruptcies?', margin, bankruptciesY)
  
  const bankruptciesOptions = ['Yes', 'No']
  bankruptciesOptions.forEach((option, index) => {
    const selected = data.hasBankruptcies === option
    const box = { x: margin + 200 + (index * 80), y: bankruptciesY, width: 10, height: 10 }
    
    page2.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page2.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page2, option, box.x + 15, box.y + 3)
  })
  
  if (data.hasBankruptcies === 'Yes' && data.bankruptciesExplanation) {
    drawText(page2, 'Explanation:', margin, bankruptciesY - 20)
    drawText(page2, data.bankruptciesExplanation, margin + 100, bankruptciesY - 20)
  }
  
  // Page 2 - Business Type
  let businessTypeY = data.hasBankruptcies === 'Yes' ? bankruptciesY - 60 : bankruptciesY - 40
  
  drawText(page2, '12. Business Type', margin, businessTypeY, { fontSize: subheaderSize, font: helveticaBold })
  
  drawText(page2, 'B2B (%):', margin, businessTypeY - 20)
  drawText(page2, (data.b2bPercent || '0') + '%', margin + 100, businessTypeY - 20)
  
  drawText(page2, 'B2C (%):', margin + 200, businessTypeY - 20)
  drawText(page2, (data.b2cPercent || '0') + '%', margin + 300, businessTypeY - 20)
  
  // Page 2 - Footer
  drawText(page2, 'Page 2 of 3', 540, 15, { fontSize: smallTextSize })
  
  
  //---------- PAGE 3 ----------
  
  // Page 3 Header
  drawText(page3, 'WaveLine Payments - Pre-Application Form (continued)', margin, 750, { fontSize: 14, font: helveticaBold, color: rgb(0, 0.4, 0.8) })
  
  // Page 3 - Business Type (continued)
  drawText(page3, 'Seasonal Business?', margin, 720)
  
  const seasonalOptions = ['Yes', 'No']
  seasonalOptions.forEach((option, index) => {
    const selected = data.isSeasonalBusiness === option
    const box = { x: margin + 150 + (index * 80), y: 720, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  drawText(page3, 'Recurring Payments/Subscriptions?', margin, 700)
  
  const recurringOptions = ['Yes', 'No']
  recurringOptions.forEach((option, index) => {
    const selected = data.hasRecurringPayments === option
    const box = { x: margin + 200 + (index * 80), y: 700, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  if (data.hasRecurringPayments === 'Yes') {
    drawText(page3, 'Specify:', margin, 680)
    drawText(page3, data.recurringPaymentsDetails || '', margin + 100, 680)
  }
  
  // Page 3 - eCommerce
  let ecommerceY = data.hasRecurringPayments === 'Yes' ? 650 : 670
  
  drawText(page3, '13. eCommerce / Card-Not-Present', margin, ecommerceY, { fontSize: subheaderSize, font: helveticaBold })
  
  ecommerceY -= 20
  
  drawText(page3, 'Product Purchase Address(es):', margin, ecommerceY)
  drawText(page3, data.productPurchaseAddresses || '', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'Who Owns Inventory?', margin, ecommerceY)
  
  const inventoryOptions = ['Merchant', 'Vendor (Drop Ship)']
  inventoryOptions.forEach((option, index) => {
    const selected = data.inventoryOwner === option
    const box = { x: margin + 150 + (index * 150), y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  ecommerceY -= 20
  
  drawText(page3, 'Fulfillment Provider(s):', margin, ecommerceY)
  drawText(page3, data.fulfillmentProviders || '', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'Shopping Cart / CRM Platform(s):', margin, ecommerceY)
  drawText(page3, data.shoppingCartPlatforms || '', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'How Do Customers Purchase?', margin, ecommerceY)
  
  const purchaseOptions = ['In Person', 'Mail/Phone', 'Internet', 'Fax', 'Other']
  let purchaseX = margin + 200
  
  purchaseOptions.forEach((option) => {
    const selected = data.purchaseMethods && data.purchaseMethods.includes(option)
    const box = { x: purchaseX, y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
    
    if (option === 'Other' && selected && data.otherPurchaseMethod) {
      drawText(page3, data.otherPurchaseMethod, box.x + 70, box.y + 3)
    }
    
    purchaseX += (option === 'Mail/Phone' ? 95 : 70)
  })
  
  ecommerceY -= 20
  
  drawText(page3, 'Call Center Provider(s):', margin, ecommerceY)
  drawText(page3, data.callCenterProviders || '', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'Authorization to Shipment Timeframe:', margin, ecommerceY)
  
  const shipTimeframeOptions = ['0–7 days', '8–14 days', '15–30 days', '30–90 days', '90+ days']
  let shipX = margin + 230
  
  shipTimeframeOptions.forEach((option) => {
    const selected = data.authToShipTimeframe === option
    const box = { x: shipX, y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
    shipX += 65 + (option.length * 2)
  })
  
  ecommerceY -= 20
  
  drawText(page3, 'Delivery Timeframe to Customer:', margin, ecommerceY)
  
  const deliveryTimeframeOptions = ['0–7 days', '8–14 days', '15–30 days', '30–90 days', '90+ days']
  let deliveryX = margin + 230
  
  deliveryTimeframeOptions.forEach((option) => {
    const selected = data.deliveryTimeframe === option
    const box = { x: deliveryX, y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
    deliveryX += 65 + (option.length * 2)
  })
  
  ecommerceY -= 20
  
  drawText(page3, 'Chargeback Management System:', margin, ecommerceY)
  drawText(page3, data.chargebackSystem || '', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'Deposits Required?', margin, ecommerceY)
  
  const depositsOptions = ['Yes', 'No']
  depositsOptions.forEach((option, index) => {
    const selected = data.requiresDeposits === option
    const box = { x: margin + 150 + (index * 80), y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  if (data.requiresDeposits === 'Yes') {
    drawText(page3, '% Required:', margin + 250, ecommerceY)
    drawText(page3, (data.depositPercent || '') + '%', margin + 320, ecommerceY)
  }
  
  ecommerceY -= 20
  
  drawText(page3, 'When is Full Payment Received?', margin, ecommerceY)
  
  const paymentOptions = ['100% Paid in Advance', '100% Paid on Delivery/Completion']
  let paymentY = ecommerceY
  
  paymentOptions.forEach((option, index) => {
    const selected = data.paymentTiming === option
    const box = { x: margin + 200, y: paymentY - (index * 20), width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  ecommerceY -= 40
  
  drawText(page3, 'Sales Regions:', margin, ecommerceY)
  drawText(page3, data.salesRegions || '', margin + 150, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, '% of International Transactions:', margin, ecommerceY)
  drawText(page3, (data.internationalPercent || '') + '%', margin + 200, ecommerceY)
  
  ecommerceY -= 20
  
  drawText(page3, 'Shipping Method:', margin, ecommerceY)
  
  const shippingOptions = ['FedEx', 'UPS', 'USPS', 'Other']
  let shippingX = margin + 150
  
  shippingOptions.forEach((option) => {
    const selected = data.shippingMethods && data.shippingMethods.includes(option)
    const box = { x: shippingX, y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
    
    if (option === 'Other' && selected && data.otherShippingMethod) {
      drawText(page3, data.otherShippingMethod, box.x + 70, box.y + 3)
    }
    
    shippingX += 70
  })
  
  ecommerceY -= 20
  
  drawText(page3, 'Advertising Channels:', margin, ecommerceY)
  
  const advOptions = ['Catalog', 'TV/Radio', 'Flyers/Direct Mail', 'Internet', 'Other']
  let advY = ecommerceY
  let advX = margin + 150
  let lineCount = 0
  
  advOptions.forEach((option, index) => {
    if (index === 3) { // Start new line after 3 options
      advX = margin + 150
      advY -= 20
      lineCount = 0
    }
    
    const selected = data.advertisingChannels && data.advertisingChannels.includes(option)
    const box = { x: advX, y: advY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
    
    if (option === 'Other' && selected && data.otherAdvertisingChannel) {
      drawText(page3, data.otherAdvertisingChannel, box.x + 70, box.y + 3)
    }
    
    advX += 90 + (option.length * 3)
    lineCount++
  })
  
  ecommerceY = advY - 40
  
  drawText(page3, 'Warranty / Guarantee Provided By:', margin, ecommerceY)
  
  const warrantyOptions = ['Merchant', 'Manufacturer']
  
  warrantyOptions.forEach((option, index) => {
    const selected = data.warrantyProvider === option
    const box = { x: margin + 200 + (index * 120), y: ecommerceY, width: 10, height: 10 }
    
    page3.drawRectangle({ ...box, borderColor: rgb(0, 0, 0), borderWidth: 1 })
    
    if (selected) {
      page3.drawRectangle({ ...box, x: box.x + 2, y: box.y + 2, width: 6, height: 6, color: rgb(0, 0, 0) })
    }
    
    drawText(page3, option, box.x + 15, box.y + 3)
  })
  
  // Signature section
  ecommerceY -= 50
  
  drawText(page3, 'I hereby certify that the information provided is true and accurate to the best of my knowledge.', margin, ecommerceY)
  
  ecommerceY -= 30
  
  drawText(page3, 'Signature: ', margin, ecommerceY)
  page3.drawLine({
    start: { x: margin + 80, y: ecommerceY },
    end: { x: margin + 300, y: ecommerceY },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  
  drawText(page3, 'Date: ', margin + 350, ecommerceY)
  page3.drawLine({
    start: { x: margin + 390, y: ecommerceY },
    end: { x: margin + 500, y: ecommerceY },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  
  ecommerceY -= 30
  
  drawText(page3, 'Print Name: ', margin, ecommerceY)
  page3.drawLine({
    start: { x: margin + 80, y: ecommerceY },
    end: { x: margin + 300, y: ecommerceY },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  
  drawText(page3, 'Title: ', margin + 350, ecommerceY)
  page3.drawLine({
    start: { x: margin + 390, y: ecommerceY },
    end: { x: margin + 500, y: ecommerceY },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  
  // Page 3 - Footer
  drawText(page3, 'Page 3 of 3', 540, 15, { fontSize: smallTextSize })
  
  // Add a footer notice
  const footerY = 50
  drawText(page3, 'For WaveLine Payments Use Only', margin, footerY, { fontSize: smallTextSize, font: helveticaBold })
  drawText(page3, 'This pre-application form is used to determine eligibility for payment processing services.', margin, footerY - 15, { fontSize: smallTextSize })
  drawText(page3, 'For questions or assistance, please contact support@wavelinepayments.com', margin, footerY - 30, { fontSize: smallTextSize })
  
  // Save the PDF and return it as a byte array
  return await pdfDoc.save()
}
