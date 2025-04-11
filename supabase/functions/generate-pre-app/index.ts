import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("======== Edge function started: generate-pre-app ========");
    console.log("Request method:", req.method);
    
    // Log headers (except authorization)
    const headersLog = {};
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === 'authorization') {
        headersLog[key] = 'Bearer [token-hidden]';
      } else {
        headersLog[key] = value;
      }
    }
    console.log("Request headers:", JSON.stringify(headersLog, null, 2));
    
    // Get the request data
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
      throw new Error('Industry ID is required')
    }
    
    if (!formData) {
      throw new Error('Form data is required')
    }

    // Generate a PDF with the submitted business data
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
 * Generates a formatted WaveLine Merchant Application PDF based on the provided form data
 */
async function generateWaveLineMerchantApplication(formData: any): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // Set global font
  doc.setFont('helvetica');
  
  // Add WaveLine logo (text representation)
  const logoText = "WaveLine";
  doc.setFontSize(28);
  doc.setTextColor(247, 148, 29); // Orange color
  doc.text(logoText, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  
  // Add application title
  doc.setFontSize(24);
  doc.setTextColor(247, 148, 29); // Orange color
  doc.text("WaveLine Merchant Application", doc.internal.pageSize.getWidth() / 2, 45, { align: 'center' });
  
  // Set text color to black for the rest of the document
  doc.setTextColor(0, 0, 0);
  
  // Start Y position for content
  let y = 65;
  const leftMargin = 20;
  const lineHeight = 7;
  const sectionSpacing = 10;
  
  // Section 1. Business Structure
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("1. Business Structure", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Checkboxes for business structure
  const structures = ["Sole Proprietorship", "Corporation", "LLC", "Non-profit (401(c))", "Government", "Other"];
  let xPos = leftMargin;
  
  doc.setFillColor(0, 0, 0);
  
  structures.forEach((structure, index) => {
    const isSelected = formData.businessStructure === structure.toLowerCase().replace(/\s+/g, '');
    
    // Draw checkbox
    doc.rect(xPos, y - 4, 4, 4);
    
    // Fill if selected
    if (structure.toLowerCase().includes(formData.businessStructure)) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    // Text after checkbox
    doc.text(structure, xPos + 6, y);
    xPos += structure.length * 2 + 15;
  });
  
  y += sectionSpacing + 5;
  
  // Section 2. Business Information
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("2. Business Information", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Business Information fields
  const businessInfo = [
    { label: "Street (Location) Address:", value: formData.businessAddress || "" },
    { label: "Mailing (Legal) Address:", value: formData.mailingAddress || "" },
    { label: "Business/Contact Telephone:", value: formData.businessPhone || "" },
    { label: "Business/Contact Email:", value: formData.businessEmail || "" },
    { label: "Business Fax #:", value: formData.businessFax || "" },
    { label: "Customer Service Telephone:", value: formData.customerServicePhone || "" },
    { label: "Customer Service Email:", value: formData.customerServiceEmail || "" },
    { label: "Website/URL:", value: formData.website || "" }
  ];
  
  businessInfo.forEach(item => {
    doc.text(item.label, leftMargin, y);
    doc.text(item.value, 80, y);
    y += lineHeight;
  });
  
  y += sectionSpacing;
  
  // Section 3. Authorized Contact
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("3. Authorized Contact", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Authorized Contact fields
  doc.text("Full Name:", leftMargin, y);
  doc.text(formData.principalName || "", 80, y);
  
  y += sectionSpacing + 10;
  
  // Section 4. Equipment / Software
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("4. Equipment / Software", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Equipment info
  doc.text("Terminal/Gateway Used (e.g., VX 520, Authorize.net, NMI):", leftMargin, y);
  doc.text(formData.terminalType || "", 125, y);
  y += lineHeight;
  
  doc.text("Shopping Cart (if applicable):", leftMargin, y);
  doc.text(formData.shoppingCart || "", 80, y);
  y += lineHeight;
  
  doc.text("If using Shopify, request Authorize.net Gateway.", leftMargin, y);
  
  y += sectionSpacing + 10;
  
  // Section 5. Business Location
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("5. Business Location", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Business Location info
  doc.text("Number of Employees:", leftMargin, y);
  doc.text(formData.numEmployees || "", 80, y);
  y += lineHeight;
  
  // Location Type checkboxes
  doc.text("Location Type:", leftMargin, y);
  const locationTypes = ["Home/Residential", "Office/Business District", "Storefront"];
  xPos = 80;
  
  locationTypes.forEach(type => {
    doc.rect(xPos, y - 4, 4, 4);
    
    // Fill if selected
    if (formData.locationType === type.toLowerCase().replace(/\s+/g, '')) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(type, xPos + 6, y);
    xPos += type.length * 2 + 15;
  });
  
  y += lineHeight;
  
  // Own or Rent
  doc.text("Own or Rent:", leftMargin, y);
  const ownRent = ["Own", "Rent"];
  xPos = 80;
  
  ownRent.forEach(option => {
    doc.rect(xPos, y - 4, 4, 4);
    
    // Fill if selected
    if (formData.ownOrRent === option.toLowerCase()) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(option, xPos + 6, y);
    xPos += option.length * 2 + 15;
  });
  
  y += lineHeight;
  
  // Square Footage
  doc.text("Approx. Square Footage:", leftMargin, y);
  const footageOptions = ["0–500 ft²", "501–2,000 ft²", "2,001–5,000 ft²", "5,000+ ft²"];
  xPos = 80;
  
  footageOptions.forEach(option => {
    doc.rect(xPos, y - 4, 4, 4);
    
    // Fill if selected
    if (formData.squareFootage === option.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(option, xPos + 6, y);
    xPos += option.length * 1.8 + 5;
  });
  
  // Add a new page for the remaining sections
  doc.addPage();
  y = 20; // Reset Y position
  
  // Section 6. Principal Information
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("6. Principal Information", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Principal Information fields
  const principalInfo = [
    { label: "Full Name:", value: formData.principalName || "" },
    { label: "Ownership %:", value: formData.ownershipPct ? `${formData.ownershipPct}%` : "" },
    { label: "Title (Owner, CEO, etc.):", value: formData.principalTitle || "" },
    { label: "Home Telephone:", value: formData.principalPhone || "" },
    { label: "Date of Birth:", value: formData.dob || "" },
    { label: "SSN:", value: formData.ssn || "" },
    { label: "Driver's License #:", value: formData.driversLicense || "" },
    { label: "Home Address:", value: formData.homeAddress || "" },
    { label: "Personal Email:", value: formData.personalEmail || "" }
  ];
  
  // Additional owners checkbox
  doc.text("Check here if additional owners/members have 25%+ equity", 100, y - lineHeight);
  doc.rect(90, y - lineHeight - 4, 4, 4);
  if (formData.additionalOwners) {
    doc.rect(90, y - lineHeight - 4, 4, 4, 'F');
  }
  
  principalInfo.forEach(item => {
    doc.text(item.label, leftMargin, y);
    doc.text(item.value, 80, y);
    y += lineHeight;
  });
  
  y += sectionSpacing;
  
  // Section 7. Bank Settlement Information
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("7. Bank Settlement Information", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Bank info
  const bankInfo = [
    { label: "Bank Name:", value: formData.bankName || "" },
    { label: "Contact Name at Bank:", value: formData.bankContactName || "" },
    { label: "Routing Number:", value: formData.routingNumber || "" },
    { label: "Account Number:", value: formData.accountNumber || "" }
  ];
  
  bankInfo.forEach(item => {
    doc.text(item.label, leftMargin, y);
    doc.text(item.value, 80, y);
    y += lineHeight;
  });
  
  y += sectionSpacing;
  
  // Section 8. Business Description
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("8. Business Description", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Business Description fields
  doc.text("Products/Services Sold:", leftMargin, y);
  doc.text(formData.productsServices || "", 80, y);
  y += lineHeight;
  
  doc.text("Years in Operation:", leftMargin, y);
  doc.text(formData.yearsInBusiness || "", 80, y);
  y += lineHeight;
  
  doc.text("Storage Location (if applicable):", leftMargin, y);
  doc.text(formData.storageLocation || "", 80, y);
  
  y += sectionSpacing + 5;
  
  // Section 9. Processing Volume
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("9. Processing Volume", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Processing Volume fields
  const volumeInfo = [
    { label: "Estimated Total Monthly Volume (All payment types): $", value: formData.monthlyVolume || "" },
    { label: "Visa/Mastercard Volume: $", value: formData.visaMcVolume || "" },
    { label: "American Express Volume: $", value: formData.amexVolume || "" },
    { label: "Average Ticket: $", value: formData.averageTicket || "" },
    { label: "Highest Ticket: $", value: formData.highestTicket || "" }
  ];
  
  volumeInfo.forEach(item => {
    doc.text(item.label, leftMargin, y);
    doc.text(item.value, leftMargin + 120, y);
    y += lineHeight;
  });
  
  y += sectionSpacing;
  
  // Section 10. Transaction Method
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("10. Transaction Method (Must Equal 100%)", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Transaction Methods
  const transactionMethods = [
    { label: "Face-to-Face (Retail):", value: formData.faceToFacePct || "" },
    { label: "Telephone/Mail/Email (MOTO):", value: formData.motoPct || "" },
    { label: "Internet (eCommerce):", value: formData.ecommercePct || "" }
  ];
  
  transactionMethods.forEach(method => {
    doc.rect(leftMargin, y - 4, 4, 4);
    
    // Fill checkbox based on if percentage exists
    if (method.value && parseInt(method.value) > 0) {
      doc.rect(leftMargin, y - 4, 4, 4, 'F');
    }
    
    doc.text(method.label, leftMargin + 6, y);
    doc.text(method.value ? `${method.value}%` : "", leftMargin + 80, y);
    y += lineHeight;
  });
  
  // Add a new page for the remaining sections
  doc.addPage();
  y = 20; // Reset Y position
  
  // Section 11. Refund / Cancellation Policy
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("11. Refund / Cancellation Policy", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // Refund policy checkbox
  doc.text("Do you have a refund policy?", leftMargin, y);
  
  doc.rect(125, y - 4, 4, 4); // Yes
  if (formData.hasRefundPolicy) {
    doc.rect(125, y - 4, 4, 4, 'F');
  }
  doc.text("Yes", 131, y);
  
  doc.rect(145, y - 4, 4, 4); // No
  if (formData.hasRefundPolicy === false) {
    doc.rect(145, y - 4, 4, 4, 'F');
  }
  doc.text("No", 151, y);
  
  y += lineHeight;
  
  // Policy Type
  doc.text("Policy Type:", leftMargin, y);
  const policyTypes = ["Exchange", "Store Credit", "Refund within 30 days", "Other"];
  xPos = 60;
  
  policyTypes.forEach(type => {
    doc.rect(xPos, y - 4, 4, 4);
    
    // Fill if selected
    if (formData.policyType === type.toLowerCase().replace(/\s+/g, '')) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(type, xPos + 6, y);
    xPos += type.length * 1.8 + 8;
  });
  
  y += lineHeight;
  
  // Additional fields
  const refundPolicyInfo = [
    { 
      label: "Processing History?",
      checkboxes: [
        { label: "Yes", checked: formData.hasProcessingHistory === true },
        { label: "No", checked: formData.hasProcessingHistory === false }
      ]
    },
    { label: "If yes, attach 3 most recent processing statements.", value: "" },
    { label: "Current/Previous Processor(s):", value: formData.previousProcessor || "" },
    {
      label: "Previous Terminations?",
      checkboxes: [
        { label: "Yes", checked: formData.previousTerminations === true },
        { label: "No", checked: formData.previousTerminations === false }
      ],
      valueLabel: "If Yes, explain:",
      value: formData.terminationsExplanation || ""
    },
    {
      label: "Bankruptcies?",
      checkboxes: [
        { label: "Yes", checked: formData.hasBankruptcy === true },
        { label: "No", checked: formData.hasBankruptcy === false }
      ],
      valueLabel: "If Yes, explain:",
      value: formData.bankruptcyExplanation || ""
    }
  ];
  
  refundPolicyInfo.forEach(item => {
    doc.text(item.label, leftMargin, y);
    
    if (item.checkboxes) {
      xPos = 80;
      item.checkboxes.forEach(checkbox => {
        doc.rect(xPos, y - 4, 4, 4);
        if (checkbox.checked) {
          doc.rect(xPos, y - 4, 4, 4, 'F');
        }
        doc.text(checkbox.label, xPos + 6, y);
        xPos += checkbox.label.length * 2 + 15;
      });
      
      if (item.valueLabel) {
        doc.text(item.valueLabel, xPos + 10, y);
        doc.text(item.value, xPos + 50, y);
      }
    } else if (item.value !== undefined) {
      doc.text(item.value, 80, y);
    }
    
    y += lineHeight;
  });
  
  y += sectionSpacing;
  
  // Section 12. Business Type
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("12. Business Type", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // B2B/B2C percentages
  doc.text("B2B (%):", leftMargin, y);
  doc.text(formData.b2bPct || "", leftMargin + 30, y);
  
  doc.text("B2C (%):", leftMargin + 60, y);
  doc.text(formData.b2cPct || "", leftMargin + 90, y);
  y += lineHeight;
  
  // Seasonal Business checkboxes
  doc.text("Seasonal Business?", leftMargin, y);
  
  doc.rect(80, y - 4, 4, 4); // Yes
  if (formData.isSeasonalBusiness === true) {
    doc.rect(80, y - 4, 4, 4, 'F');
  }
  doc.text("Yes", 86, y);
  
  doc.rect(105, y - 4, 4, 4); // No
  if (formData.isSeasonalBusiness === false) {
    doc.rect(105, y - 4, 4, 4, 'F');
  }
  doc.text("No", 111, y);
  y += lineHeight;
  
  // Recurring Payments checkboxes
  doc.text("Recurring Payments/Subscriptions?", leftMargin, y);
  
  doc.rect(80, y - 4, 4, 4); // Yes
  if (formData.hasRecurringPayments === true) {
    doc.rect(80, y - 4, 4, 4, 'F');
  }
  doc.text("Yes", 86, y);
  
  doc.rect(105, y - 4, 4, 4); // No
  if (formData.hasRecurringPayments === false) {
    doc.rect(105, y - 4, 4, 4, 'F');
  }
  doc.text("No", 111, y);
  
  doc.text("If yes, specify:", 125, y);
  doc.text(formData.recurringPaymentsDesc || "", 165, y);
  
  y += sectionSpacing + 5;
  
  // Section 13. eCommerce / Card-Not-Present
  doc.setFontSize(16);
  doc.setTextColor(247, 148, 29); // Orange for section titles
  doc.text("13. eCommerce / Card-Not-Present", leftMargin, y);
  doc.setTextColor(0, 0, 0); // Back to black
  y += lineHeight + 5;
  
  doc.setFontSize(11);
  
  // eCommerce fields
  const ecommerceFields = [
    { label: "Product Purchase Address(es):", value: formData.purchaseAddresses || "" }
  ];
  
  ecommerceFields.forEach(field => {
    doc.text(field.label, leftMargin, y);
    doc.text(field.value, 80, y);
    y += lineHeight;
  });
  
  // Who owns inventory
  doc.text("Who Owns Inventory?", leftMargin, y);
  
  doc.rect(80, y - 4, 4, 4); // Merchant
  if (formData.inventoryOwner === 'merchant') {
    doc.rect(80, y - 4, 4, 4, 'F');
  }
  doc.text("Merchant", 86, y);
  
  doc.rect(120, y - 4, 4, 4); // Vendor (Drop Ship)
  if (formData.inventoryOwner === 'vendor') {
    doc.rect(120, y - 4, 4, 4, 'F');
  }
  doc.text("Vendor (Drop Ship)", 126, y);
  y += lineHeight;
  
  // Additional eCommerce fields
  const moreEcommerceFields = [
    { label: "Fulfillment Provider(s):", value: formData.fulfillmentProvider || "" },
    { label: "Shopping Cart / CRM Platform(s):", value: formData.shoppingCartPlatform || "" }
  ];
  
  moreEcommerceFields.forEach(field => {
    doc.text(field.label, leftMargin, y);
    doc.text(field.value, 80, y);
    y += lineHeight;
  });
  
  // Purchase methods checkboxes
  doc.text("How Do Customers Purchase?", leftMargin, y);
  
  const purchaseMethods = ["In Person", "Mail/Phone", "Internet", "Fax"];
  xPos = 80;
  purchaseMethods.forEach((method, index) => {
    doc.rect(xPos, y - 4, 4, 4);
    
    // Check if this method is in the formData.purchaseMethods array
    if (formData.purchaseMethods && formData.purchaseMethods.includes(method.toLowerCase().replace(/\//g, ''))) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(method, xPos + 6, y);
    xPos += method.length * 2 + 10;
  });
  y += lineHeight;
  
  // Additional fields
  const finalEcommerceFields = [
    { label: "Call Center Provider(s):", value: formData.callCenterProvider || "" }
  ];
  
  finalEcommerceFields.forEach(field => {
    doc.text(field.label, leftMargin, y);
    doc.text(field.value, 80, y);
    y += lineHeight;
  });
  
  // Add shipment timeframes
  doc.text("Authorization to Shipment Timeframe:", leftMargin, y);
  const shipmentTimeframes = ["0–7 days", "8–14 days", "15–30 days", "30–90 days", "90+ days"];
  xPos = 80;
  shipmentTimeframes.forEach(timeframe => {
    doc.rect(xPos, y - 4, 4, 4);
    
    if (formData.shipmentTimeframe === timeframe.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(timeframe, xPos + 6, y);
    xPos += timeframe.length * 2 + 5;
  });
  y += lineHeight;
  
  // Add delivery timeframes (same options)
  doc.text("Delivery Timeframe to Customer:", leftMargin, y);
  xPos = 80;
  shipmentTimeframes.forEach(timeframe => {
    doc.rect(xPos, y - 4, 4, 4);
    
    if (formData.deliveryTimeframe === timeframe.toLowerCase().replace(/[^a-z0-9]/g, '')) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(timeframe, xPos + 6, y);
    xPos += timeframe.length * 2 + 5;
  });
  y += lineHeight;
  
  // Other eCommerce fields
  const finalFields = [
    { label: "Chargeback Management System (if any):", value: formData.chargebackSystem || "" },
    { 
      label: "Deposits Required?",
      checkboxes: [
        { label: "Yes", checked: formData.depositsRequired === true },
        { label: "No", checked: formData.depositsRequired === false }
      ],
      valueLabel: "If Yes, % Required:",
      value: formData.depositPercentage ? `${formData.depositPercentage}%` : ""
    },
    {
      label: "When is Full Payment Received?",
      checkboxes: [
        { label: "100% Paid in Advance", checked: formData.paymentReceived === 'advance' },
        { label: "100% Paid on Delivery/Completion", checked: formData.paymentReceived === 'delivery' }
      ]
    },
    { label: "Sales Regions:", value: formData.salesRegions || "" },
    { label: "% of International Transactions:", value: formData.internationalPct ? `${formData.internationalPct}%` : "" }
  ];
  
  finalFields.forEach(field => {
    doc.text(field.label, leftMargin, y);
    
    if (field.checkboxes) {
      xPos = 80;
      field.checkboxes.forEach(checkbox => {
        doc.rect(xPos, y - 4, 4, 4);
        if (checkbox.checked) {
          doc.rect(xPos, y - 4, 4, 4, 'F');
        }
        doc.text(checkbox.label, xPos + 6, y);
        xPos += checkbox.label.length * 2 + 10;
      });
      
      if (field.valueLabel) {
        doc.text(field.valueLabel, xPos + 10, y);
        doc.text(field.value, xPos + 50, y);
      }
    } else {
      doc.text(field.value, 80, y);
    }
    
    y += lineHeight;
  });
  
  // Add shipping methods
  doc.text("Shipping Method:", leftMargin, y);
  const shippingMethods = ["FedEx", "UPS", "USPS"];
  xPos = 80;
  shippingMethods.forEach(method => {
    doc.rect(xPos, y - 4, 4, 4);
    
    if (formData.shippingMethod && formData.shippingMethod.includes(method.toLowerCase())) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(method, xPos + 6, y);
    xPos += method.length * 2 + 10;
  });
  y += lineHeight;
  
  // Add advertising channels
  doc.text("Advertising Channels:", leftMargin, y);
  const adChannels = ["Catalog", "TV/Radio", "Flyers/Direct Mail", "Internet"];
  xPos = 80;
  adChannels.forEach(channel => {
    doc.rect(xPos, y - 4, 4, 4);
    
    if (formData.advertisingChannels && formData.advertisingChannels.includes(channel.toLowerCase().replace(/[^a-z]/g, ''))) {
      doc.rect(xPos, y - 4, 4, 4, 'F');
    }
    
    doc.text(channel, xPos + 6, y);
    xPos += channel.length * 2 + 5;
  });
  y += lineHeight;
  
  // Warranty provider
  doc.text("Warranty / Guarantee Provided By:", leftMargin, y);
  
  doc.rect(80, y - 4, 4, 4); // Merchant
  if (formData.warrantyProvider === 'merchant') {
    doc.rect(80, y - 4, 4, 4, 'F');
  }
  doc.text("Merchant", 86, y);
  
  doc.rect(125, y - 4, 4, 4); // Manufacturer
  if (formData.warrantyProvider === 'manufacturer') {
    doc.rect(125, y - 4, 4, 4, 'F');
  }
  doc.text("Manufacturer", 131, y);
  
  // Convert the document to base64
  const pdfOutput = doc.output('datauristring');
  
  // Return just the base64 part
  const base64Data = pdfOutput.split(',')[1];
  return base64Data;
}
