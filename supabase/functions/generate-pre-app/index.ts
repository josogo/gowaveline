
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
    const pdfResult = await generateWaveLineMerchantApplication(formData);
    console.log("PDF generation completed successfully");
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF generated successfully',
        pdfBase64: pdfResult.pdfBase64,
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
});

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
 * Returns object with base64 PDF data
 */
async function generateWaveLineMerchantApplication(formData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Set up document dimensions and constants
  const pageSetup = setupPdfDocument(doc);
  
  // Add WaveLine logo and header
  const yAfterHeader = addDocumentHeader(doc, pageSetup);
  
  // Add business name as document title
  const yAfterTitle = addBusinessTitle(doc, formData, yAfterHeader, pageSetup);
  
  // Start adding content sections
  let currentY = yAfterTitle;
  
  // Add each section of the form
  currentY = addBusinessStructureSection(doc, formData, currentY, pageSetup);
  currentY = addBusinessInfoSection(doc, formData, currentY, pageSetup);
  
  // Check if we need to add a page break
  currentY = checkAndAddPageBreak(doc, currentY, pageSetup, false);
  
  currentY = addPrincipalInfoSection(doc, formData, currentY, pageSetup);
  currentY = addBankInfoSection(doc, formData, currentY, pageSetup);
  
  // Check if we need to add a page break
  currentY = checkAndAddPageBreak(doc, currentY, pageSetup, false);
  
  currentY = addProcessingVolumeSection(doc, formData, currentY, pageSetup);
  currentY = addBusinessTypeSection(doc, formData, currentY, pageSetup);
  currentY = addTransactionMethodsSection(doc, formData, currentY, pageSetup);
  
  // Check if we need another page break
  currentY = checkAndAddPageBreak(doc, currentY, pageSetup, false);
  
  // Add eCommerce section if applicable
  if (formData.purchaseMethods && formData.purchaseMethods.includes('internet')) {
    currentY = addEcommerceSection(doc, formData, currentY, pageSetup);
  }
  
  // Add footer with application ID and date
  addDocumentFooter(doc, formData.businessName || "WaveLine Merchant Application");
  
  // Convert the document to base64
  const pdfOutput = doc.output('datauristring');
  
  // Return just the base64 part
  const base64Data = pdfOutput.split(',')[1];
  
  return {
    pdfBase64: base64Data,
    pageCount: doc.internal.getNumberOfPages()
  };
}

/**
 * Sets up the PDF document with standard dimensions and styles
 */
function setupPdfDocument(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const primaryColor = [14, 165, 233]; // #0EA5E9 (sky blue)
  const secondaryColor = [51, 65, 85]; // #334155 (slate)
  
  // Standard settings for text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  return {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    leftMargin: margin,
    rightMargin: pageWidth - margin,
    primaryColor,
    secondaryColor,
    lineHeight: 7,
    sectionSpacing: 10
  };
}

/**
 * Adds the document header with logo and title
 */
function addDocumentHeader(doc, { pageWidth, margin, primaryColor }) {
  // Add blue header bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  // Add WaveLine text logo in white
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text("WaveLine", margin, 15);
  
  // Add application title
  doc.setFont('helvetica', 'normal');
  doc.text("Merchant Application", pageWidth - margin - 45, 15);
  
  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);
  
  // Return new Y position after header
  return 35;
}

/**
 * Adds the business name as document title
 */
function addBusinessTitle(doc, formData, y, { pageWidth, secondaryColor }) {
  doc.setFontSize(16);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  const title = formData.businessName || 'New Business Application';
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  
  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  return y + 12; // Return new Y position with spacing
}

/**
 * Adds the business structure section to the PDF
 */
function addBusinessStructureSection(doc, formData, y, { leftMargin, pageWidth, margin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "1. Business Structure", y);
  
  // Checkbox for business structure with better formatting
  const structures = [
    { id: "sole_proprietorship", label: "Sole Proprietorship" },
    { id: "corporation", label: "Corporation" },
    { id: "llc", label: "LLC" },
    { id: "non_profit", label: "Non-profit (401c)" },
    { id: "government", label: "Government" }, 
    { id: "other", label: "Other" }
  ];
  
  let currentY = y;
  let currentX = leftMargin;
  const maxWidth = 80;
  
  structures.forEach((structure) => {
    const isSelected = formData.businessStructure === structure.id;
    
    // Check if we need to move to a new line
    if (currentX > pageWidth - margin - maxWidth) {
      currentX = leftMargin;
      currentY += lineHeight;
    }
    
    // Draw checkbox
    doc.rect(currentX, currentY - 3, 3, 3); 
    
    // Fill if selected
    if (isSelected) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, currentY - 3, 3, 3, 'F');
    }
    
    // Text after checkbox
    doc.text(structure.label, currentX + 5, currentY);
    currentX += structure.label.length * 1.8 + 10;
  });
  
  // Add business structure other field if selected
  if (formData.businessStructure === 'other' && formData.businessStructureOther) {
    currentY += lineHeight;
    doc.text(`Other Type: ${formData.businessStructureOther}`, leftMargin, currentY);
  }
  
  return currentY + sectionSpacing;
}

/**
 * Adds the business information section to the PDF
 */
function addBusinessInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "2. Business Information", y);
  
  // Business Information fields with improved formatting
  const businessInfo = [
    { label: "Business Name:", value: formData.businessName || "" },
    { label: "Street Address:", value: formData.streetAddress || "" },
    { label: "Mailing Address:", value: formData.mailingAddress || formData.streetAddress || "" },
    { label: "City, State, ZIP:", value: 
      formatCityStateZip(formData.city, formData.state, formData.zip) },
    { label: "Business Phone:", value: formData.businessPhone || "" },
    { label: "Business Email:", value: formData.businessEmail || "" },
    { label: "Business Fax:", value: formData.businessFax || "" },
    { label: "Customer Service Phone:", value: formData.customerServicePhone || "" },
    { label: "Customer Service Email:", value: formData.customerServiceEmail || "" },
    { label: "Website/URL:", value: formData.website || "" }
  ];
  
  y = addLabeledFields(doc, businessInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the principal information section to the PDF
 */
function addPrincipalInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
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
  
  // Format date of birth if all components exist
  let dob = "";
  if (formData.dateOfBirthMonth && formData.dateOfBirthDay && formData.dateOfBirthYear) {
    dob = `${formData.dateOfBirthMonth}/${formData.dateOfBirthDay}/${formData.dateOfBirthYear}`;
  }
  
  // Format license expiration if all components exist
  let licExp = "";
  if (formData.licenseExpMonth && formData.licenseExpDay && formData.licenseExpYear) {
    licExp = `${formData.licenseExpMonth}/${formData.licenseExpDay}/${formData.licenseExpYear}`;
  }
  
  // Principal Information fields
  const principalInfo = [
    { label: "Full Name:", value: formData.principalName || "" },
    { label: "Ownership %:", value: formData.ownershipPercentage ? `${formData.ownershipPercentage}%` : "" },
    { label: "Title:", value: formData.principalTitle || "" },
    { label: "Phone:", value: formData.principalPhone || "" },
    { label: "Email:", value: formData.principalEmail || "" },
    { label: "Date of Birth:", value: dob },
    { label: "SSN:", value: formData.ssn || "" },
    { label: "Driver's License:", value: formData.driversLicense || "" },
    { label: "License Exp.:", value: licExp },
    { label: "License State:", value: formData.licenseState || "" },
    { label: "Home Address:", value: formData.principalAddress || "" }
  ];
  
  y = addLabeledFields(doc, principalInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the bank information section to the PDF
 */
function addBankInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "4. Bank Settlement Information", y);
  
  const bankInfo = [
    { label: "Bank Name:", value: formData.bankName || "" },
    { label: "Bank Contact:", value: formData.bankContactName || "" },
    { label: "Routing Number:", value: formData.routingNumber || "" },
    { label: "Account Number:", value: formData.accountNumber || "" }
  ];
  
  y = addLabeledFields(doc, bankInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the processing volume section to the PDF
 */
function addProcessingVolumeSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "5. Processing Volume", y);
  
  const volumeInfo = [
    { label: "Total Monthly Volume:", value: formData.totalMonthlyVolume ? `$${formData.totalMonthlyVolume}` : "" },
    { label: "Visa/MC Volume:", value: formData.visaMastercardVolume ? `$${formData.visaMastercardVolume}` : "" },
    { label: "Amex Volume:", value: formData.amexVolume ? `$${formData.amexVolume}` : "" },
    { label: "Average Ticket:", value: formData.averageTicket ? `$${formData.averageTicket}` : "" },
    { label: "Highest Ticket:", value: formData.highestTicket ? `$${formData.highestTicket}` : "" },
    { label: "Years in Operation:", value: formData.yearsInOperation || "" }
  ];
  
  y = addLabeledFields(doc, volumeInfo, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the business type section to the PDF
 */
function addBusinessTypeSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
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
    },
    { 
      label: "Recurring Payments:",
      checkboxes: [
        { label: "Yes", checked: formData.hasRecurringPayments === true },
        { label: "No", checked: formData.hasRecurringPayments === false }
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
  
  // Add refund policy details if available
  if (formData.hasRefundPolicy === true && formData.policyType) {
    doc.setFont('helvetica', 'bold');
    doc.text("Refund Policy Type:", leftMargin, y);
    doc.setFont('helvetica', 'normal');
    
    const policyTypes = {
      exchange: "Exchange Only",
      store_credit: "Store Credit",
      refund_30_days: "30 Day Refund",
      other: formData.policyTypeOther || "Other"
    };
    
    doc.text(policyTypes[formData.policyType] || "", leftMargin + 40, y);
    y += lineHeight;
  }
  
  // Add recurring payments details if available
  if (formData.hasRecurringPayments === true && formData.recurringPaymentsDetails) {
    doc.setFont('helvetica', 'bold');
    doc.text("Recurring Details:", leftMargin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.recurringPaymentsDetails, leftMargin + 40, y);
    y += lineHeight;
  }
  
  // Add B2B / B2C percentages if available
  if (formData.b2bPercentage || formData.b2cPercentage) {
    doc.setFont('helvetica', 'bold');
    doc.text("B2B:", leftMargin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.b2bPercentage || "0"}%`, leftMargin + 15, y);
    
    doc.setFont('helvetica', 'bold');
    doc.text("B2C:", leftMargin + 40, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.b2cPercentage || "0"}%`, leftMargin + 55, y);
    y += lineHeight;
  }
  
  return y + sectionSpacing / 2;
}

/**
 * Adds the transaction methods section to the PDF
 */
function addTransactionMethodsSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "7. Transaction Methods", y);
  
  // Draw transaction methods with percentages
  const transactionMethods = [
    { 
      id: "inperson", 
      label: "Face-to-Face (Retail):", 
      value: formData.faceToFacePercentage || "0", 
      checked: formData.purchaseMethods && formData.purchaseMethods.includes('inperson') 
    },
    { 
      id: "mailphone", 
      label: "Mail/Phone/Email (MOTO):", 
      value: formData.motoPercentage || "0", 
      checked: formData.purchaseMethods && formData.purchaseMethods.includes('mailphone') 
    },
    { 
      id: "internet", 
      label: "Internet (eCommerce):", 
      value: formData.ecommercePercentage || "0", 
      checked: formData.purchaseMethods && formData.purchaseMethods.includes('internet') 
    }
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
function addEcommerceSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing }) {
  y = addSectionHeader(doc, "8. eCommerce Information", y);
  
  const ecommerceFields = [
    { label: "Shopping Cart:", value: formData.shoppingCartPlatforms || "" },
    { label: "Shipping Method:", value: formatArrayField(formData.shippingMethod) },
    { label: "Advertising Channels:", value: formatArrayField(formData.advertisingChannels) },
    { label: "Auth to Ship Time:", value: formatTimeFrame(formData.authToShipTimeframe) },
    { label: "Delivery Time:", value: formatTimeFrame(formData.deliveryTimeframe) },
    { label: "Deposits Required:", value: formData.depositsRequired ? "Yes" : "No" },
    { label: "Deposit Percentage:", value: formData.depositPercentage ? `${formData.depositPercentage}%` : "" },
    { label: "Full Payment Timing:", value: formatPaymentTiming(formData.fullPaymentTiming) },
    { label: "International %:", value: formData.internationalTransactionsPercentage ? `${formData.internationalTransactionsPercentage}%` : "" },
    { label: "Inventory Ownership:", value: formData.inventoryOwnership === "merchant" ? "Merchant" : formData.inventoryOwnership === "vendor" ? "Vendor" : "" },
    { label: "Warranty Provider:", value: formData.warrantyProvider === "merchant" ? "Merchant" : formData.warrantyProvider === "manufacturer" ? "Manufacturer" : "" }
  ];
  
  y = addLabeledFields(doc, ecommerceFields, y, leftMargin, lineHeight);
  
  return y + sectionSpacing / 2;
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
    if (item.value !== undefined && item.value !== "") {
      // Draw field label in bold
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, leftMargin, y);
      
      // Draw field value in normal font
      doc.setFont('helvetica', 'normal');
      doc.text(String(item.value), leftMargin + 40, y);
      
      y += lineHeight;
    }
  });
  
  return y;
}

/**
 * Helper function to add footer to all pages
 */
function addDocumentFooter(doc, businessName) {
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
 * Checks if a page break is needed and adds one if necessary
 * @param {boolean} force - Forces page break regardless of position
 * @returns {number} New y position after check/page break
 */
function checkAndAddPageBreak(doc, y, { pageHeight, margin }, force = false) {
  if (force || y > pageHeight - 50) {
    doc.addPage();
    return margin + 10; // Return top of new page with small padding
  }
  return y;
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

/**
 * Helper function to format city, state, zip
 */
function formatCityStateZip(city, state, zip) {
  const parts = [];
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip) parts.push(zip);
  
  return parts.join(', ');
}

/**
 * Helper function to format time frames
 */
function formatTimeFrame(timeframe) {
  if (!timeframe) return "";
  
  const timeframes = {
    '0-7': '0-7 Days',
    '8-14': '8-14 Days',
    '15-30': '15-30 Days',
    '30-90': '30-90 Days',
    '90+': '90+ Days'
  };
  
  return timeframes[timeframe] || timeframe;
}

/**
 * Helper function to format payment timing
 */
function formatPaymentTiming(timing) {
  if (!timing) return "";
  
  const timings = {
    'advance': 'In Advance',
    'delivery': 'Upon Delivery'
  };
  
  return timings[timing] || timing;
}

