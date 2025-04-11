import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'
import { encode } from "https://deno.land/std@0.177.0/encoding/base64.ts"

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
 * Convert the WaveLine logo to base64 for embedding in the PDF
 */
const getWavelineLogo = async () => {
  // This is a placeholder with an orange wave and blue "waveline" text
  // Equivalent to the uploaded waveline logo image
  const logoBase64 = "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"

  return logoBase64;
};

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
  
  try {
    // Get WaveLine logo as base64
    const logoBase64 = await getWavelineLogo();
    
    // Add WaveLine logo and header
    const yAfterHeader = addDocumentHeader(doc, pageSetup, logoBase64);
    
    // Add business name as document title
    const yAfterTitle = addBusinessTitle(doc, formData, yAfterHeader, pageSetup);
    
    // Start adding content sections
    let currentY = yAfterTitle;
    
    // Add each section of the form
    currentY = addBusinessStructureSection(doc, formData, currentY, pageSetup);
    currentY = addBusinessInfoSection(doc, formData, currentY, pageSetup);
    currentY = addAuthorizedContactSection(doc, formData, currentY, pageSetup);
    currentY = addEquipmentSection(doc, formData, currentY, pageSetup);
    currentY = addBusinessLocationSection(doc, formData, currentY, pageSetup);
    
    // Start a new page
    doc.addPage();
    currentY = pageSetup.margin + 10;
    
    currentY = addPrincipalInfoSection(doc, formData, currentY, pageSetup);
    currentY = addBankInfoSection(doc, formData, currentY, pageSetup);
    currentY = addBusinessDescriptionSection(doc, formData, currentY, pageSetup);
    currentY = addProcessingVolumeSection(doc, formData, currentY, pageSetup);
    currentY = addTransactionMethodsSection(doc, formData, currentY, pageSetup);
    
    // Start a new page
    doc.addPage();
    currentY = pageSetup.margin + 10;
    
    currentY = addRefundPolicySection(doc, formData, currentY, pageSetup);
    currentY = addBusinessTypeSection(doc, formData, currentY, pageSetup);
    
    // Add eCommerce section if applicable
    currentY = addEcommerceSection(doc, formData, currentY, pageSetup);
    
    // Add footer with application ID and date
    addDocumentFooter(doc, formData.businessName || "WaveLine Merchant Application");
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
  
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
  const primaryColor = [243, 144, 29]; // Orange (#F3901D)
  const secondaryColor = [0, 174, 239]; // Blue (#00AEEF)
  const textColor = [51, 51, 51]; // Dark gray (#333333)
  
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
    textColor,
    lineHeight: 7,
    sectionSpacing: 10
  };
}

/**
 * Adds the document header with logo and title
 */
function addDocumentHeader(doc, { pageWidth, margin, primaryColor, secondaryColor }, logoBase64) {
  // Add logo if available
  if (logoBase64) {
    // Add the WaveLine logo centered at the top
    try {
      doc.addImage(logoBase64, 'PNG', (pageWidth / 2) - 20, margin, 40, 40);
    } catch (error) {
      console.error("Error adding logo:", error);
    }
  }
  
  // Add WaveLine Merchant Application title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("WaveLine Merchant Application", pageWidth / 2, margin + 50, { align: 'center' });
  
  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);
  
  // Return new Y position after header
  return margin + 60;
}

/**
 * Adds the business name as document title
 */
function addBusinessTitle(doc, formData, y, { pageWidth, secondaryColor }) {
  doc.setFontSize(16);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  const title = formData.businessName || ' ';
  if (title.trim() !== '') {
    doc.text(title, pageWidth / 2, y, { align: 'center' });
    // Reset text color for the rest of the document
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    return y + 12; // Return new Y position with spacing
  }
  // Reset text color even if no title
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  return y + 5; // Return new Y position with less spacing
}

/**
 * Adds the business structure section to the PDF
 */
function addBusinessStructureSection(doc, formData, y, { leftMargin, pageWidth, margin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "1. Business Structure", y, primaryColor);
  
  // Checkbox for business structure with better formatting
  const structures = [
    { id: "sole_proprietorship", label: "Sole Proprietorship" },
    { id: "corporation", label: "Corporation" },
    { id: "llc", label: "LLC" },
    { id: "non_profit", label: "Non-profit (401c)" },
    { id: "government", label: "Government" }, 
    { id: "other", label: "Other" }
  ];
  
  let currentX = leftMargin;
  const checkboxSpacing = 30; // Space between checkboxes
  
  structures.forEach((structure) => {
    const isSelected = formData.businessStructure === structure.id;
    
    // Check if we need to move to a new line
    if (currentX + checkboxSpacing > pageWidth - margin) {
      currentX = leftMargin;
      y += lineHeight;
    }
    
    // Draw filled square for selected options
    doc.rect(currentX, y - 3, 3, 3); 
    if (isSelected) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, y - 3, 3, 3, 'F');
    }
    
    // Text after checkbox
    doc.text(structure.label, currentX + 5, y);
    currentX += structure.label.length * 2 + 10; // Adjust spacing based on label length
  });
  
  y += lineHeight;
  
  // Add business structure other field if selected
  if (formData.businessStructure === 'other') {
    doc.text(`Other: ${formData.businessStructureOther || '_______________'}`, leftMargin, y);
    y += lineHeight;
  } else {
    doc.text(`Other: _______________`, leftMargin, y);
    y += lineHeight;
  }
  
  return y + sectionSpacing/2;
}

/**
 * Adds the business information section to the PDF
 */
function addBusinessInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "2. Business Information", y, primaryColor);
  
  // Create a field with label and value or blank line
  function addField(label, value, yPos) {
    doc.setFont('helvetica', 'normal');
    doc.text(`${label} ${value || '_______________'}`, leftMargin, yPos);
    return yPos + lineHeight;
  }
  
  y = addField("Street (Location) Address:", formData.streetAddress, y);
  y = addField("Mailing (Legal) Address:", formData.mailingAddress, y);
  y = addField("Business/Contact Telephone:", formData.businessPhone, y);
  y = addField("Business/Contact Email:", formData.businessEmail, y);
  y = addField("Business Fax #:", formData.businessFax, y);
  y = addField("Customer Service Telephone:", formData.customerServicePhone, y);
  y = addField("Customer Service Email:", formData.customerServiceEmail, y);
  y = addField("Website/URL: http://", formData.website, y);
  
  return y + sectionSpacing/2;
}

/**
 * Adds the authorized contact section to the PDF
 */
function addAuthorizedContactSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "3. Authorized Contact", y, primaryColor);
  
  doc.text(`Full Name: ${formData.authorizedContactName || '________________________________'}`, leftMargin, y);
  
  return y + lineHeight + sectionSpacing/2;
}

/**
 * Adds the equipment and software section to the PDF
 */
function addEquipmentSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "4. Equipment / Software", y, primaryColor);
  
  doc.text(`Terminal/Gateway Used: (e.g., VX 520, Authorize.net, NMI) ${formData.terminalGateway || '________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Shopping Cart (if applicable): ${formData.shoppingCart || '________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text("If using Shopify, request Authorize.net Gateway.", leftMargin, y);
  
  return y + lineHeight + sectionSpacing/2;
}

/**
 * Adds the business location section to the PDF
 */
function addBusinessLocationSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "5. Business Location", y, primaryColor);
  
  doc.text(`Number of Employees: ${formData.employeeCount || '_______'}`, leftMargin, y);
  y += lineHeight;
  
  // Location Type checkboxes
  doc.text("Location Type:", leftMargin, y);
  let currentX = leftMargin + 30;
  
  const locationTypes = [
    { id: "home", label: "Home/Residential" },
    { id: "office", label: "Office/Business District" },
    { id: "storefront", label: "Storefront" }
  ];
  
  locationTypes.forEach((type) => {
    const isSelected = formData.locationType === type.id;
    
    doc.rect(currentX, y - 3, 3, 3);
    if (isSelected) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, y - 3, 3, 3, 'F');
    }
    
    doc.text(type.label, currentX + 5, y);
    currentX += type.label.length * 2 + 10;
  });
  
  y += lineHeight;
  
  // Own or Rent checkboxes
  doc.text("Own or Rent:", leftMargin, y);
  currentX = leftMargin + 30;
  
  const ownRentOptions = [
    { id: "own", label: "Own" },
    { id: "rent", label: "Rent" }
  ];
  
  ownRentOptions.forEach((option) => {
    const isSelected = formData.ownOrRent === option.id;
    
    doc.rect(currentX, y - 3, 3, 3);
    if (isSelected) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, y - 3, 3, 3, 'F');
    }
    
    doc.text(option.label, currentX + 5, y);
    currentX += option.label.length * 2 + 10;
  });
  
  y += lineHeight;
  
  // Square footage checkboxes
  doc.text("Approx. Square Footage:", leftMargin, y);
  currentX = leftMargin + 50;
  
  const footageOptions = [
    { id: "0-500", label: "0-500 ft²" },
    { id: "501-2000", label: "501-2,000 ft²" },
    { id: "2001-5000", label: "2,001-5,000 ft²" },
    { id: "5000+", label: "5,000+ ft²" }
  ];
  
  footageOptions.forEach((option) => {
    const isSelected = formData.squareFootage === option.id;
    
    doc.rect(currentX, y - 3, 3, 3);
    if (isSelected) {
      doc.setFillColor(0, 0, 0);
      doc.rect(currentX, y - 3, 3, 3, 'F');
    }
    
    doc.text(option.label, currentX + 5, y);
    currentX += option.label.length * 2 + 10;
  });
  
  return y + lineHeight + sectionSpacing/2;
}

/**
 * Adds the principal information section to the PDF
 */
function addPrincipalInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "6. Principal Information", y, primaryColor);
  
  // Draw principal information fields
  doc.text(`Full Name: ${formData.principalName || '________________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Ownership %: ${formData.ownershipPercentage || '_____'}%`, leftMargin, y);
  
  const additionalOwnersX = leftMargin + 70;
  doc.text("☐ Check here if additional owners/members have 25%+ equity", additionalOwnersX, y);
  if (formData.additionalOwners) {
    doc.rect(additionalOwnersX - 10, y - 3, 3, 3, 'F');
  } else {
    doc.rect(additionalOwnersX - 10, y - 3, 3, 3);
  }
  y += lineHeight;
  
  doc.text(`Title (Owner, CEO, etc.): ${formData.principalTitle || '________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Home Telephone: ${formData.principalPhone || '________________________'}`, leftMargin, y);
  y += lineHeight;
  
  // Format date of birth
  let dob = "____ / ____ / ________";
  if (formData.dateOfBirthMonth && formData.dateOfBirthDay && formData.dateOfBirthYear) {
    dob = `${formData.dateOfBirthMonth} / ${formData.dateOfBirthDay} / ${formData.dateOfBirthYear}`;
  }
  doc.text(`Date of Birth: ${dob}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`SSN: ${formData.ssn || '________________________'}`, leftMargin, y);
  y += lineHeight;
  
  // Format license details
  doc.text(`Driver's License #: ${formData.driversLicense || '________________________'} `, leftMargin, y);
  y += lineHeight;
  
  let licExp = "____ / ____ / ________";
  if (formData.licenseExpMonth && formData.licenseExpDay && formData.licenseExpYear) {
    licExp = `${formData.licenseExpMonth} / ${formData.licenseExpDay} / ${formData.licenseExpYear}`;
  }
  doc.text(`Exp Date: ${licExp}`, leftMargin, y);
  
  doc.text(`State: ${formData.licenseState || '__________'}`, leftMargin + 80, y);
  y += lineHeight;
  
  doc.text(`Home Address: ${formData.principalAddress || '________________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Personal Email: ${formData.principalEmail || '________________________________'}`, leftMargin, y);
  
  return y + lineHeight + sectionSpacing/2;
}

/**
 * Adds the bank information section to the PDF
 */
function addBankInfoSection(doc, formData, y, { leftMargin, lineHeight, sectionSpacing, primaryColor }) {
  y = addSectionHeader(doc, "7. Bank Settlement Information", y, primaryColor);
  
  doc.text(`Bank Name: ${formData.bankName || '________________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Contact Name at Bank: ${formData.bankContactName || '________________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Routing Number: ${formData.routingNumber || '________________________________'}`, leftMargin, y);
  y += lineHeight;
  
  doc.text(`Account Number: ${formData.accountNumber || '________________________________'}`, leftMargin, y);
  
  return y + lineHeight
