
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("======== Edge function started: generate-pre-app ========");
    console.log("Request method:", req.method);
    
    // Log sanitized headers (hide auth token)
    logSanitizedHeaders(req.headers);
    
    // Get and validate request data
    const requestData = await parseAndValidateRequest(req);
    const { industryId, formData } = requestData;
    
    // Generate PDF with form data
    const businessName = formData.businessName || 'New Business';
    console.log(`Generating PDF for business: ${businessName}`);
    
    // Create the PDF with the formatted WaveLine Merchant Application
    const pdfBase64 = await generateWaveLineMerchantApplication(formData);
    console.log("PDF generation completed successfully");
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF generated successfully',
        pdfBase64: pdfBase64,
        businessName: businessName
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-pre-app:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    )
  }
})

/**
 * Logs the request headers with authorization information sanitized
 */
function logSanitizedHeaders(headers) {
  const headersLog = {};
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === 'authorization') {
      headersLog[key] = 'Bearer [token-hidden]';
    } else {
      headersLog[key] = value;
    }
  }
  console.log("Request headers:", JSON.stringify(headersLog, null, 2));
}

/**
 * Parses and validates the request data
 */
async function parseAndValidateRequest(req) {
  let requestData;
  try {
    requestData = await req.json();
    console.log("Request data received");
  } catch (parseError) {
    console.error("Error parsing request JSON:", parseError);
    throw new Error('Invalid JSON in request body');
  }
  
  const { industryId, formData } = requestData;
  
  console.log("Request data contents:", {
    industryId: industryId || "Missing",
    formData: formData ? "Present" : "Missing"
  });
  
  if (!industryId) {
    throw new Error('Industry ID is required');
  }
  
  if (!formData) {
    throw new Error('Form data is required');
  }
  
  return requestData;
}

/**
 * Main function to generate the merchant application PDF
 */
async function generateWaveLineMerchantApplication(formData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Page dimensions and styles
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const primaryColor = [14, 165, 233]; // #0EA5E9 (sky blue)
  const secondaryColor = [51, 65, 85]; // #334155 (slate)
  
  // Starting position
  let y = margin;
  const leftMargin = margin;
  const rightMargin = pageWidth - margin;
  const lineHeight = 7;
  const sectionSpacing = 10;
  
  // Add document header
  y = addDocumentHeader(doc, pageWidth, margin, primaryColor);
  
  // Add business name as document title
  y = addDocumentTitle(doc, formData.businessName, pageWidth, y, secondaryColor);
  
  // Set standard text format
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Add all sections
  y = addBusinessStructureSection(doc, formData, y, leftMargin, pageWidth, margin, lineHeight, sectionSpacing);
  y = addBusinessInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  y = addPrincipalInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  y = addBankInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  
  // Check if we need to add a new page
  if (y > pageHeight - 60) {
    doc.addPage();
    y = margin;
  }
  
  y = addProcessingVolumeSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  y = addBusinessTypeSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  y = addTransactionMethodsSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing);
  
  // Check if we need another page
  if (y > pageHeight - 60) {
    doc.addPage();
    y = margin;
  }
  
  // Add eCommerce section if applicable
  if (formData.purchaseMethods && formData.purchaseMethods.includes('internet')) {
    y = addEcommerceSection(doc, formData, y, leftMargin, lineHeight);
  }
  
  // Add footer with application ID and date
  addFooter(doc, formData.businessName || "WaveLine Merchant Application");
  
  // Convert the document to base64
  const pdfOutput = doc.output('datauristring');
  
  // Return just the base64 part
  const base64Data = pdfOutput.split(',')[1];
  return base64Data;
}

/**
 * Adds the document header with logo and title
 */
function addDocumentHeader(doc, pageWidth, margin, primaryColor) {
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  // Add logo text in white
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text("WaveLine", margin, 15);
  
  // Add application title
  doc.setFont('helvetica', 'normal');
  doc.text("Merchant Application", pageWidth - margin - 45, 15);
  
  // Reset position after header
  return 35; // New Y position
}

/**
 * Adds the document title (business name)
 */
function addDocumentTitle(doc, businessName, pageWidth, y, secondaryColor) {
  doc.setFontSize(16);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  const title = businessName || 'New Business';
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  return y + 12; // Return new Y position with spacing
}

/**
 * Adds the business structure section to the PDF
 */
function addBusinessStructureSection(doc, formData, y, leftMargin, pageWidth, margin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "1. Business Structure", y);
  
  // Checkbox for business structure with better formatting
  const structures = ["Sole Proprietorship", "Corporation", "LLC", "Non-profit (401(c))", "Government", "Other"];
  let currentY = y;
  let currentX = leftMargin;
  const maxWidth = 80;
  
  structures.forEach((structure) => {
    const isSelected = formData.businessStructure === structure.toLowerCase().replace(/\s+/g, '');
    
    // Check if we need to move to a new line
    if (currentX > pageWidth - margin - maxWidth) {
      currentX = leftMargin;
      currentY += lineHeight;
    }
    
    // Draw checkbox
    doc.rect(currentX, currentY - 3, 3, 3); 
    
    // Fill if selected
    if (isSelected || 
        (structure.toLowerCase().includes(formData.businessStructure))) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, currentY - 3, 3, 3, 'F');
    }
    
    // Text after checkbox
    doc.text(structure, currentX + 5, currentY);
    currentX += structure.length * 1.8 + 8;
  });
  
  return currentY + sectionSpacing;
}

/**
 * Adds the business information section to the PDF
 */
function addBusinessInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "2. Business Information", y);
  
  // Business Information fields with improved formatting
  const businessInfo = [
    { label: "Business Name:", value: formData.businessName || "" },
    { label: "Street Address:", value: formData.businessAddress || "" },
    { label: "City, State, ZIP:", value: formData.businessCity ? 
      `${formData.businessCity}, ${formData.businessState || 'CA'} ${formData.businessZip || ''}` : "" },
    { label: "Business Phone:", value: formData.businessPhone || "" },
    { label: "Business Email:", value: formData.businessEmail || "" },
    { label: "Website/URL:", value: formData.website || "" }
  ];
  
  y = addLabeledFields(doc, businessInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the principal information section to the PDF
 */
function addPrincipalInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "3. Principal Information", y);
  
  // Additional owners checkbox
  doc.setFont('helvetica', 'normal');
  doc.text("Check if additional owners/members have 25%+ equity:", leftMargin, y);
  doc.rect(leftMargin + 80, y - 3, 3, 3);
  
  if (formData.additionalOwners) {
    doc.setFillColor(0, 0, 0);
    doc.rect(leftMargin + 80, y - 3, 3, 3, 'F');
  }
  
  y += lineHeight;
  
  // Principal Information fields
  const principalInfo = [
    { label: "Full Name:", value: formData.principalName || "" },
    { label: "Ownership %:", value: formData.ownershipPct ? `${formData.ownershipPct}%` : "" },
    { label: "Title:", value: formData.principalTitle || "" },
    { label: "Phone:", value: formData.principalPhone || "" },
    { label: "Email:", value: formData.personalEmail || "" },
    { label: "Home Address:", value: formData.homeAddress || "" }
  ];
  
  y = addLabeledFields(doc, principalInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the bank information section to the PDF
 */
function addBankInfoSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "4. Bank Settlement Information", y);
  
  const bankInfo = [
    { label: "Bank Name:", value: formData.bankName || "" },
    { label: "Routing Number:", value: formData.routingNumber || "" },
    { label: "Account Number:", value: formData.accountNumber || "" }
  ];
  
  y = addLabeledFields(doc, bankInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the processing volume section to the PDF
 */
function addProcessingVolumeSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "5. Processing Volume", y);
  
  const volumeInfo = [
    { label: "Monthly Volume:", value: formData.monthlyVolume ? `$${formData.monthlyVolume}` : "" },
    { label: "Average Ticket:", value: formData.averageTicket ? `$${formData.averageTicket}` : "" },
    { label: "Highest Ticket:", value: formData.highestTicket ? `$${formData.highestTicket}` : "" }
  ];
  
  y = addLabeledFields(doc, volumeInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the business type section to the PDF
 */
function addBusinessTypeSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "6. Business Type", y);
  
  // Draw business type fields
  const businessTypeInfo = [
    { 
      label: "Seasonal Business:",
      checkboxes: [
        { label: "Yes", checked: formData.isSeasonalBusiness === true },
        { label: "No", checked: formData.isSeasonalBusiness === false }
      ]
    },
    { 
      label: "Refund Policy:",
      checkboxes: [
        { label: "Yes", checked: formData.hasRefundPolicy === true },
        { label: "No", checked: formData.hasRefundPolicy === false }
      ]
    }
  ];
  
  businessTypeInfo.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, leftMargin, y);
    
    let xPos = leftMargin + 40;
    
    if (item.checkboxes) {
      item.checkboxes.forEach(checkbox => {
        doc.rect(xPos, y - 3, 3, 3);
        if (checkbox.checked) {
          doc.setFillColor(0, 0, 0);
          doc.rect(xPos, y - 3, 3, 3, 'F');
        }
        
        doc.setFont('helvetica', 'normal');
        doc.text(checkbox.label, xPos + 5, y);
        xPos += 20;
      });
    }
    
    y += lineHeight;
  });
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the transaction methods section to the PDF
 */
function addTransactionMethodsSection(doc, formData, y, leftMargin, lineHeight, sectionSpacing) {
  y = addSectionHeader(doc, "7. Transaction Methods", y);
  
  // Draw transaction methods with percentages
  const transactionMethods = [
    { label: "Face-to-Face (Retail):", value: formData.faceToFacePct || "0", checked: formData.purchaseMethods && formData.purchaseMethods.includes('inperson') },
    { label: "Mail/Phone/Email (MOTO):", value: formData.motoPct || "0", checked: formData.purchaseMethods && formData.purchaseMethods.includes('mailphone') },
    { label: "Internet (eCommerce):", value: formData.ecommercePct || "0", checked: formData.purchaseMethods && formData.purchaseMethods.includes('internet') }
  ];
  
  transactionMethods.forEach(method => {
    doc.rect(leftMargin, y - 3, 3, 3);
    
    if (method.checked || parseInt(method.value) > 0) {
      doc.setFillColor(0, 0, 0);
      doc.rect(leftMargin, y - 3, 3, 3, 'F');
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(method.label, leftMargin + 5, y);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${method.value}%`, leftMargin + 60, y);
    
    y += lineHeight;
  });
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the eCommerce section to the PDF if applicable
 */
function addEcommerceSection(doc, formData, y, leftMargin, lineHeight) {
  y = addSectionHeader(doc, "8. eCommerce Information", y);
  
  const ecommerceFields = [
    { label: "Shopping Cart:", value: formData.shoppingCartPlatform || "" },
    { label: "Shipping Method:", value: formatArrayField(formData.shippingMethod) },
    { label: "Advertising Channels:", value: formatArrayField(formData.advertisingChannels) }
  ];
  
  y = addLabeledFields(doc, ecommerceFields, y, leftMargin, lineHeight);
  
  return y;
}

/**
 * Helper function to add a section header
 */
function addSectionHeader(doc, text, y) {
  doc.setFillColor(14, 165, 233);  // #0EA5E9 (sky blue)
  doc.rect(20, y, doc.internal.pageSize.getWidth() - 40, 7, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(text, 25, y + 5);
  
  // Reset text color and font
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  return y + 10;  // Return new Y position after header
}

/**
 * Helper function to add label-value pairs to the PDF
 */
function addLabeledFields(doc, fields, y, leftMargin, lineHeight) {
  fields.forEach(item => {
    // Draw field label in bold
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, leftMargin, y);
    
    // Draw field value in normal font
    doc.setFont('helvetica', 'normal');
    doc.text(String(item.value), leftMargin + 40, y);
    
    y += lineHeight;
  });
  
  return y;
}

/**
 * Helper function to add footer to all pages
 */
function addFooter(doc, businessName) {
  const pageCount = doc.internal.getNumberOfPages();
  const today = new Date().toLocaleDateString();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add footer line
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // Add page number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
    
    // Add business name and date
    doc.text(`${businessName} - ${today}`, 20, pageHeight - 10);
  }
}

/**
 * Helper function to format array fields as comma-separated strings
 */
function formatArrayField(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return "";
  }
  
  return arr.map(item => {
    // Capitalize first letter of each word and replace dashes/underscores with spaces
    return item.replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }).join(', ');
}
