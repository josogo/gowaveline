
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'

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
    console.log("Pre-App PDF generation request received");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // For debugging - log headers
    console.log("Request headers:", 
      Array.from(req.headers.entries())
        .filter(([key]) => !key.toLowerCase().includes('auth'))
        .reduce((obj, [key, val]) => ({...obj, [key]: val}), {})
    );
    
    // Get request body
    const requestBody = await req.json().catch((err) => {
      console.error("Error parsing request body:", err);
      throw new Error("Invalid request body format");
    });
    
    const { industryId, formData } = requestBody;
    
    console.log("Generating PDF for industry:", industryId);

    if (!industryId) {
      throw new Error('Industry ID is required')
    }

    // Get industry information
    const { data: industry, error: industryError } = await supabaseClient
      .from('industries')
      .select('*')
      .eq('id', industryId)
      .single();

    if (industryError) {
      console.error("Industry fetch error:", industryError);
      throw new Error(`Industry not found: ${industryError.message}`);
    }

    if (!industry) {
      console.error("Industry not found for ID:", industryId);
      throw new Error('Industry not found');
    }

    console.log("Industry found:", industry.name);

    // Get industry logo if available
    let logoImageData = null;
    try {
      const { data: logoDoc, error: logoError } = await supabaseClient
        .from('industry_documents')
        .select('*')
        .eq('industry_id', industryId)
        .eq('file_type', 'logo')
        .maybeSingle();

      if (logoDoc && !logoError) {
        console.log("Logo found:", logoDoc.file_path);
        try {
          const { data: logoData, error: logoFetchError } = await supabaseClient
            .storage
            .from('industry-files')
            .download(logoDoc.file_path);
            
          if (logoFetchError) {
            console.error("Error downloading logo:", logoFetchError);
          }
            
          if (logoData) {
            console.log("Logo downloaded successfully, converting to base64");
            const reader = new FileReader();
            logoImageData = await new Promise((resolve) => {
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(logoData);
            });
            console.log("Logo converted to base64 successfully");
          }
        } catch (e) {
          console.error("Error processing logo:", e);
          // Continue without logo
        }
      } else {
        console.log("No logo found for this industry");
      }
    } catch (error) {
      console.error("Error fetching logo info:", error);
      // Continue without logo
    }

    // Generate the PDF
    console.log("Generating PDF document");
    try {
      const pdfBytes = await generatePreApplicationPDF(industry, formData, logoImageData);
      console.log("PDF generation successful, size:", pdfBytes.byteLength);
      
      // Convert the PDF to a base64 string
      const pdfBase64 = btoa(
        new Uint8Array(pdfBytes)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      console.log("PDF base64 conversion complete, length:", pdfBase64.length);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pdfBase64
        }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      throw new Error(`Error generating PDF: ${pdfError.message}`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        stack: error.stack
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

async function generatePreApplicationPDF(industry, formData, logoImageData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15; // margin from edges
  let yPosition = 20;

  // Add waveline logo
  const wavelineLogo = "data:image/png;base64,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";
  try {
    // Add logo at the top center
    doc.addImage(wavelineLogo, 'PNG', 80, 10, 50, 30);
    yPosition = 50;
  } catch (e) {
    console.error("Error adding Waveline logo:", e);
    if (logoImageData) {
      try {
        doc.addImage(logoImageData, 'AUTO', 80, 10, 50, 20);
        yPosition = 40;
      } catch (logoErr) {
        console.error("Error adding fallback logo:", logoErr);
        yPosition = 20;
      }
    }
  }

  // Add document header
  doc.setFontSize(18);
  doc.setTextColor(0, 71, 171); // Blue color
  doc.setFont('helvetica', 'bold');
  doc.text(`${industry.name} Merchant Application`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add generated date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray color
  const date = new Date().toLocaleDateString();
  doc.text(`Generated: ${date}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add divider
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Set text color to black for the rest of the document
  doc.setTextColor(0, 0, 0);
  
  // Add a note about optional fields
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100); // Gray color
  doc.text('Note: All fields in this form are optional. Complete only what applies to your business.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Helper function to add section headers
  const addSectionHeader = (text, y) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    return y + 7;
  };
  
  // Helper function to add form fields
  const addFormField = (label, value, y, width = pageWidth - 2 * margin) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const formattedValue = value ? `: ${value}` : '';
    doc.text(`${label}${formattedValue}`, margin, y);
    return y + 5;
  };
  
  // Helper function to add checkbox fields
  const addCheckboxField = (label, isChecked, y) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const checkboxChar = isChecked ? '■' : '□';
    doc.text(`${checkboxChar} ${label}`, margin, y);
    return y + 5;
  };
  
  // Section 1: Business Structure
  yPosition = addSectionHeader("1. Business Structure", yPosition);
  
  // Create a row of checkboxes for business structure
  const structures = [
    { label: 'Sole Proprietorship', value: formData.businessStructure === 'Sole Proprietorship' },
    { label: 'Corporation', value: formData.businessStructure === 'Corporation' },
    { label: 'LLC', value: formData.businessStructure === 'LLC' },
    { label: 'Non-profit (401(c))', value: formData.businessStructure === 'Non-profit' },
    { label: 'Government', value: formData.businessStructure === 'Government' },
    { label: `Other: ${formData.businessStructureOther || '_________'}`, value: formData.businessStructure === 'Other' }
  ];
  
  let xPos = margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  structures.forEach((structure, idx) => {
    const checkmark = structure.value ? '■' : '□';
    doc.text(`${checkmark} ${structure.label}`, xPos, yPosition);
    xPos += structure.label.length * 1.7 + 10;
    if (xPos > pageWidth - margin || idx === 2) {
      xPos = margin;
      yPosition += 6;
    }
  });
  
  yPosition += 10;
  
  // Section 2: Business Information
  yPosition = addSectionHeader("2. Business Information", yPosition);
  yPosition = addFormField(`Street (Location) Address`, formData.streetAddress, yPosition);
  yPosition = addFormField(`Mailing (Legal) Address`, formData.mailingAddress, yPosition);
  yPosition = addFormField(`Business/Contact Telephone`, formData.businessPhone, yPosition);
  yPosition = addFormField(`Business/Contact Email`, formData.businessEmail, yPosition);
  yPosition = addFormField(`Business Fax #`, formData.businessFax, yPosition);
  yPosition = addFormField(`Customer Service Telephone`, formData.customerServicePhone, yPosition);
  yPosition = addFormField(`Customer Service Email`, formData.customerServiceEmail, yPosition);
  yPosition = addFormField(`Website/URL: http://`, formData.website, yPosition);
  yPosition += 5;
  
  // Section 3: Authorized Contact
  yPosition = addSectionHeader("3. Authorized Contact", yPosition);
  yPosition = addFormField(`Full Name`, formData.authorizedContactName, yPosition);
  yPosition += 5;
  
  // Section 4: Equipment / Software
  yPosition = addSectionHeader("4. Equipment / Software", yPosition);
  yPosition = addFormField(`Terminal/Gateway Used (e.g., VX 520, Authorize.net, NMI)`, formData.terminalGateway, yPosition);
  yPosition = addFormField(`Shopping Cart (if applicable)`, formData.shoppingCart, yPosition);
  yPosition = addFormField(`If using Shopify, request Authorize.net Gateway.`, '', yPosition);
  yPosition += 5;
  
  // Section 5: Business Location
  yPosition = addSectionHeader("5. Business Location", yPosition);
  yPosition = addFormField(`Number of Employees`, formData.numEmployees, yPosition);
  
  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Location Type checkboxes
  let locationTypeRow = `Location Type: `;
  locationTypeRow += formData.locationType === 'Home/Residential' ? '■' : '□';
  locationTypeRow += ` Home/Residential  `;
  locationTypeRow += formData.locationType === 'Office/Business District' ? '■' : '□';
  locationTypeRow += ` Office/Business District  `;
  locationTypeRow += formData.locationType === 'Storefront' ? '■' : '□';
  locationTypeRow += ` Storefront`;
  
  doc.text(locationTypeRow, margin, yPosition);
  yPosition += 6;
  
  // Own or Rent checkboxes
  let ownRentRow = `Own or Rent: `;
  ownRentRow += formData.ownRent === 'Own' ? '■' : '□';
  ownRentRow += ` Own  `;
  ownRentRow += formData.ownRent === 'Rent' ? '■' : '□';
  ownRentRow += ` Rent`;
  
  doc.text(ownRentRow, margin, yPosition);
  yPosition += 6;
  
  // Square Footage checkboxes
  let sqFtRow = `Approx. Square Footage: `;
  sqFtRow += formData.squareFootage === '0–500 ft²' ? '■' : '□';
  sqFtRow += ` 0–500 ft²  `;
  sqFtRow += formData.squareFootage === '501–2,000 ft²' ? '■' : '□';
  sqFtRow += ` 501–2,000 ft²  `;
  
  doc.text(sqFtRow, margin, yPosition);
  yPosition += 6;
  
  let sqFtRow2 = '';
  sqFtRow2 += formData.squareFootage === '2,001–5,000 ft²' ? '■' : '□';
  sqFtRow2 += ` 2,001–5,000 ft²  `;
  sqFtRow2 += formData.squareFootage === '5,000+ ft²' ? '■' : '□';
  sqFtRow2 += ` 5,000+ ft²`;
  
  doc.text(sqFtRow2, margin, yPosition);
  yPosition += 10;
  
  // Add a new page for Principal Information
  doc.addPage();
  yPosition = margin;
  
  // Section 6: Principal Information
  yPosition = addSectionHeader("6. Principal Information", yPosition);
  yPosition = addFormField(`Full Name`, formData.principalName, yPosition);
  
  // Ownership percentage with additional owners checkbox
  let ownershipRow = `Ownership %: ${formData.ownershipPercentage || '___________'}%  `;
  ownershipRow += formData.hasAdditionalOwners ? '■' : '□';
  ownershipRow += ` Check here if additional owners/members have 25%+ equity`;
  
  doc.setFontSize(10);
  doc.text(ownershipRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Title (Owner, CEO, etc.)`, formData.principalTitle, yPosition);
  yPosition = addFormField(`Home Telephone`, formData.principalPhone, yPosition);
  yPosition = addFormField(`Date of Birth`, formData.dateOfBirth, yPosition);
  yPosition = addFormField(`SSN`, formData.ssn, yPosition);
  
  // Driver's license info
  let licenseRow = `Driver's License #: ${formData.driversLicense || '___________________'}`;
  licenseRow += ` Exp Date: ${formData.licenseExpDate || '____ / ____ / ______'}`;
  licenseRow += ` State: ${formData.licenseState || '___________'}`;
  
  doc.setFontSize(10);
  doc.text(licenseRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Home Address`, formData.homeAddress, yPosition);
  yPosition = addFormField(`Personal Email`, formData.personalEmail, yPosition);
  yPosition += 5;
  
  // Section 7: Bank Settlement Information
  yPosition = addSectionHeader("7. Bank Settlement Information", yPosition);
  yPosition = addFormField(`Bank Name`, formData.bankName, yPosition);
  yPosition = addFormField(`Contact Name at Bank`, formData.bankContactName, yPosition);
  yPosition = addFormField(`Routing Number`, formData.routingNumber, yPosition);
  yPosition = addFormField(`Account Number`, formData.accountNumber, yPosition);
  yPosition += 5;
  
  // Section 8: Business Description
  yPosition = addSectionHeader("8. Business Description", yPosition);
  yPosition = addFormField(`Products/Services Sold`, formData.productsServices, yPosition);
  yPosition = addFormField(`Years in Operation`, formData.yearsInOperation, yPosition);
  yPosition = addFormField(`Storage Location (if applicable)`, formData.storageLocation, yPosition);
  yPosition += 5;
  
  // Section 9: Processing Volume
  yPosition = addSectionHeader("9. Processing Volume", yPosition);
  yPosition = addFormField(`Estimated Total Monthly Volume (All payment types)`, `$${formData.totalMonthlyVolume || '__________'}`, yPosition);
  yPosition = addFormField(`Visa/Mastercard Volume`, `$${formData.visaMastercardVolume || '__________'}`, yPosition);
  yPosition = addFormField(`American Express Volume`, `$${formData.amexVolume || '__________'}`, yPosition);
  yPosition = addFormField(`Average Ticket`, `$${formData.averageTicket || '__________'}`, yPosition);
  yPosition = addFormField(`Highest Ticket`, `$${formData.highestTicket || '__________'}`, yPosition);
  yPosition += 5;
  
  // Add a new page for Transaction Method
  doc.addPage();
  yPosition = margin;
  
  // Section 10: Transaction Method
  yPosition = addSectionHeader("10. Transaction Method (Must Equal 100%)", yPosition);
  yPosition = addFormField(`Face-to-Face (Retail)`, `${formData.faceToFacePercent || '______'}%`, yPosition);
  yPosition = addFormField(`Telephone/Mail/Email (MOTO)`, `${formData.motoPercent || '______'}%`, yPosition);
  yPosition = addFormField(`Internet (eCommerce)`, `${formData.ecommercePercent || '______'}%`, yPosition);
  yPosition += 5;
  
  // Section 11: Refund / Cancellation Policy
  yPosition = addSectionHeader("11. Refund / Cancellation Policy", yPosition);
  
  // Refund policy checkbox
  let refundPolicyRow = `Do you have a refund policy? `;
  refundPolicyRow += formData.hasRefundPolicy === 'Yes' ? '■' : '□';
  refundPolicyRow += ` Yes `;
  refundPolicyRow += formData.hasRefundPolicy === 'No' ? '■' : '□';
  refundPolicyRow += ` No`;
  
  doc.setFontSize(10);
  doc.text(refundPolicyRow, margin, yPosition);
  yPosition += 6;
  
  // Policy type checkboxes
  let policyTypeRow = `Policy Type: `;
  policyTypeRow += formData.policyType === 'Exchange' ? '■' : '□';
  policyTypeRow += ` Exchange `;
  policyTypeRow += formData.policyType === 'Store Credit' ? '■' : '□';
  policyTypeRow += ` Store Credit `;
  policyTypeRow += formData.policyType === 'Refund within 30 days' ? '■' : '□';
  policyTypeRow += ` Refund within 30 days `;
  policyTypeRow += formData.policyType === 'Other' ? '■' : '□';
  policyTypeRow += ` Other: ${formData.policyTypeOther || '_____________________'}`;
  
  doc.setFontSize(10);
  doc.text(policyTypeRow, margin, yPosition);
  yPosition += 6;
  
  // Processing history checkbox
  let processingHistoryRow = `Processing History? `;
  processingHistoryRow += formData.processingHistory === 'Yes' ? '■' : '□';
  processingHistoryRow += ` Yes `;
  processingHistoryRow += formData.processingHistory === 'No' ? '■' : '□';
  processingHistoryRow += ` No`;
  
  doc.setFontSize(10);
  doc.text(processingHistoryRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`If yes, attach 3 most recent processing statements.`, '', yPosition);
  yPosition = addFormField(`Current/Previous Processor(s)`, formData.previousProcessors, yPosition);
  
  // Previous terminations checkbox
  let terminationsRow = `Previous Terminations? `;
  terminationsRow += formData.previousTerminations === 'Yes' ? '■' : '□';
  terminationsRow += ` Yes* `;
  terminationsRow += formData.previousTerminations === 'No' ? '■' : '□';
  terminationsRow += ` No`;
  if (formData.terminationsExplanation) {
    terminationsRow += `   If Yes, explain: ${formData.terminationsExplanation}`;
  } else {
    terminationsRow += `   If Yes, explain: ______________________________________`;
  }
  
  doc.setFontSize(10);
  doc.text(terminationsRow, margin, yPosition);
  yPosition += 6;
  
  // Bankruptcies checkbox
  let bankruptciesRow = `Bankruptcies? `;
  bankruptciesRow += formData.bankruptcies === 'Yes' ? '■' : '□';
  bankruptciesRow += ` Yes* `;
  bankruptciesRow += formData.bankruptcies === 'No' ? '■' : '□';
  bankruptciesRow += ` No`;
  if (formData.bankruptciesExplanation) {
    bankruptciesRow += `   If Yes, explain: ${formData.bankruptciesExplanation}`;
  } else {
    bankruptciesRow += `   If Yes, explain: ______________________________________`;
  }
  
  doc.setFontSize(10);
  doc.text(bankruptciesRow, margin, yPosition);
  yPosition += 6;
  
  // Section 12: Business Type
  yPosition = addSectionHeader("12. Business Type", yPosition);
  
  // B2B and B2C percentages
  let businessTypeRow = `B2B (%): ${formData.b2bPercent || '_______'} B2C (%): ${formData.b2cPercent || '_______'}`;
  
  doc.setFontSize(10);
  doc.text(businessTypeRow, margin, yPosition);
  yPosition += 6;
  
  // Seasonal business checkbox
  let seasonalRow = `Seasonal Business? `;
  seasonalRow += formData.isSeasonalBusiness === 'Yes' ? '■' : '□';
  seasonalRow += ` Yes `;
  seasonalRow += formData.isSeasonalBusiness === 'No' ? '■' : '□';
  seasonalRow += ` No`;
  
  doc.setFontSize(10);
  doc.text(seasonalRow, margin, yPosition);
  yPosition += 6;
  
  // Recurring payments checkbox
  let recurringRow = `Recurring Payments/Subscriptions? `;
  recurringRow += formData.hasRecurringPayments === 'Yes' ? '■' : '□';
  recurringRow += ` Yes `;
  recurringRow += formData.hasRecurringPayments === 'No' ? '■' : '□';
  recurringRow += ` No`;
  if (formData.recurringPaymentsDetails) {
    recurringRow += `   If yes, specify: ${formData.recurringPaymentsDetails}`;
  } else {
    recurringRow += `   If yes, specify:`;
  }
  
  doc.setFontSize(10);
  doc.text(recurringRow, margin, yPosition);
  yPosition += 6;
  
  if (!formData.recurringPaymentsDetails) {
    doc.text('______________________________________', margin, yPosition);
    yPosition += 6;
  }
  
  // Add a new page for eCommerce section
  doc.addPage();
  yPosition = margin;
  
  // Section 13: eCommerce / Card-Not-Present
  yPosition = addSectionHeader("13. eCommerce / Card-Not-Present", yPosition);
  yPosition = addFormField(`Product Purchase Address(es)`, formData.productPurchaseAddresses, yPosition);
  
  // Inventory owner checkbox
  let inventoryRow = `Who Owns Inventory? `;
  inventoryRow += formData.inventoryOwner === 'Merchant' ? '■' : '□';
  inventoryRow += ` Merchant `;
  inventoryRow += formData.inventoryOwner === 'Vendor (Drop Ship)' ? '■' : '□';
  inventoryRow += ` Vendor (Drop Ship)`;
  
  doc.setFontSize(10);
  doc.text(inventoryRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Fulfillment Provider(s)`, formData.fulfillmentProviders, yPosition);
  yPosition = addFormField(`Shopping Cart / CRM Platform(s)`, formData.shoppingCartPlatforms, yPosition);
  
  // Purchase methods checkboxes
  let purchaseRow = `How Do Customers Purchase? `;
  purchaseRow += formData.purchaseMethods?.includes('In Person') ? '■' : '□';
  purchaseRow += ` In Person `;
  purchaseRow += formData.purchaseMethods?.includes('Mail/Phone') ? '■' : '□';
  purchaseRow += ` Mail/Phone `;
  purchaseRow += formData.purchaseMethods?.includes('Internet') ? '■' : '□';
  purchaseRow += ` Internet `;
  purchaseRow += formData.purchaseMethods?.includes('Fax') ? '■' : '□';
  purchaseRow += ` Fax `;
  purchaseRow += formData.purchaseMethods?.includes('Other') ? '■' : '□';
  purchaseRow += ` Other: ${formData.purchaseMethodOther || '___________'}`;
  
  doc.setFontSize(10);
  doc.text(purchaseRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Call Center Provider(s)`, formData.callCenterProviders, yPosition);
  
  // Authorization to shipment timeframe
  let authShipRow = `Authorization to Shipment Timeframe: `;
  authShipRow += formData.authToShipTimeframe === '0–7 days' ? '■' : '□';
  authShipRow += ` 0–7 days `;
  authShipRow += formData.authToShipTimeframe === '8–14 days' ? '■' : '□';
  authShipRow += ` 8–14 days `;
  authShipRow += formData.authToShipTimeframe === '15–30 days' ? '■' : '□';
  authShipRow += ` 15–30 days `;
  authShipRow += formData.authToShipTimeframe === '30–90 days' ? '■' : '□';
  authShipRow += ` 30–90 days `;
  authShipRow += formData.authToShipTimeframe === '90+ days' ? '■' : '□';
  authShipRow += ` 90+ days`;
  
  doc.setFontSize(10);
  doc.text(authShipRow, margin, yPosition);
  yPosition += 6;
  
  // Delivery timeframe
  let deliveryRow = `Delivery Timeframe to Customer: `;
  deliveryRow += formData.deliveryTimeframe === '0–7 days' ? '■' : '□';
  deliveryRow += ` 0–7 days `;
  deliveryRow += formData.deliveryTimeframe === '8–14 days' ? '■' : '□';
  deliveryRow += ` 8–14 days `;
  deliveryRow += formData.deliveryTimeframe === '15–30 days' ? '■' : '□';
  deliveryRow += ` 15–30 days `;
  deliveryRow += formData.deliveryTimeframe === '30–90 days' ? '■' : '□';
  deliveryRow += ` 30–90 days `;
  deliveryRow += formData.deliveryTimeframe === '90+ days' ? '■' : '□';
  deliveryRow += ` 90+ days`;
  
  doc.setFontSize(10);
  doc.text(deliveryRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Chargeback Management System (if any)`, formData.chargebackSystem, yPosition);
  
  // Deposits required checkbox
  let depositsRow = `Deposits Required? `;
  depositsRow += formData.depositsRequired === 'Yes' ? '■' : '□';
  depositsRow += ` Yes `;
  depositsRow += formData.depositsRequired === 'No' ? '■' : '□';
  depositsRow += ` No`;
  if (formData.depositPercentage) {
    depositsRow += `   If Yes, % Required: ${formData.depositPercentage}%`;
  } else {
    depositsRow += `   If Yes, % Required: __________%`;
  }
  
  doc.setFontSize(10);
  doc.text(depositsRow, margin, yPosition);
  yPosition += 6;
  
  // Full payment received
  let paymentRow = `When is Full Payment Received? `;
  paymentRow += formData.fullPaymentReceived === '100% Paid in Advance' ? '■' : '□';
  paymentRow += ` 100% Paid in Advance `;
  paymentRow += formData.fullPaymentReceived === '100% Paid on Delivery/Completion' ? '■' : '□';
  paymentRow += ` 100% Paid on Delivery/Completion`;
  
  doc.setFontSize(10);
  doc.text(paymentRow, margin, yPosition);
  yPosition += 6;
  
  yPosition = addFormField(`Sales Regions`, formData.salesRegions, yPosition);
  yPosition = addFormField(`% of International Transactions`, `${formData.internationalTransactionPercent || '_______'}%`, yPosition);
  
  // Shipping method checkboxes
  let shippingRow = `Shipping Method: `;
  shippingRow += formData.shippingMethod?.includes('FedEx') ? '■' : '□';
  shippingRow += ` FedEx `;
  shippingRow += formData.shippingMethod?.includes('UPS') ? '■' : '□';
  shippingRow += ` UPS `;
  shippingRow += formData.shippingMethod?.includes('USPS') ? '■' : '□';
  shippingRow += ` USPS `;
  shippingRow += formData.shippingMethod?.includes('Other') ? '■' : '□';
  shippingRow += ` Other: ${formData.shippingMethodOther || '___________'}`;
  
  doc.setFontSize(10);
  doc.text(shippingRow, margin, yPosition);
  yPosition += 6;
  
  // Advertising channels checkboxes
  let advertisingRow = `Advertising Channels: `;
  advertisingRow += formData.advertisingChannels?.includes('Catalog') ? '■' : '□';
  advertisingRow += ` Catalog `;
  advertisingRow += formData.advertisingChannels?.includes('TV/Radio') ? '■' : '□';
  advertisingRow += ` TV/Radio `;
  advertisingRow += formData.advertisingChannels?.includes('Flyers/Direct Mail') ? '■' : '□';
  advertisingRow += ` Flyers/Direct Mail `;
  advertisingRow += formData.advertisingChannels?.includes('Internet') ? '■' : '□';
  advertisingRow += ` Internet `;
  advertisingRow += formData.advertisingChannels?.includes('Other') ? '■' : '□';
  advertisingRow += ` Other: ${formData.advertisingChannelsOther || '___________'}`;
  
  doc.setFontSize(10);
  doc.text(advertisingRow, margin, yPosition);
  yPosition += 6;
  
  // Warranty provider checkbox
  let warrantyRow = `Warranty / Guarantee Provided By: `;
  warrantyRow += formData.warrantyProvider === 'Merchant' ? '■' : '□';
  warrantyRow += ` Merchant `;
  warrantyRow += formData.warrantyProvider === 'Manufacturer' ? '■' : '□';
  warrantyRow += ` Manufacturer`;
  
  doc.setFontSize(10);
  doc.text(warrantyRow, margin, yPosition);
  yPosition += 10;
  
  // Add page numbers and footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This pre-application form is for informational purposes only. All fields are optional.', margin, pageHeight - margin);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - margin, { align: 'right' });
  }
  
  return doc.output('arraybuffer');
}
