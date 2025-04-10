
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
    
    const { industryId, leadData } = requestBody;
    
    console.log("Generating PDF for industry:", industryId);
    console.log("Lead data:", leadData || "No lead data provided");

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
      const pdfBytes = await generatePreApplicationPDF(industry, leadData, logoImageData);
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

async function generatePreApplicationPDF(industry, leadData, logoImageData) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;
  
  // Add company logo if available
  if (logoImageData) {
    try {
      doc.addImage(logoImageData, 'AUTO', 10, 10, 50, 20);
      yPosition = 40;
      console.log("Logo added to PDF");
    } catch (e) {
      console.error("Error adding logo to PDF:", e);
      // Continue without logo
    }
  }

  // Add document header
  doc.setFontSize(18);
  doc.setTextColor(0, 71, 171); // Blue color
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
  doc.line(20, yPosition, pageWidth - 20, yPosition);
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
  
  // Create comprehensive pre-application form sections
  
  // Section 1: Business Structure
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("1. Business Structure", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("☐ Sole Proprietorship  ☐ Corporation  ☐ LLC  ☐ Non-profit (401(c))  ☐ Government  ☐ Other: ___________", 15, yPosition);
  yPosition += 10;

  // Section 2: Business Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("2. Business Information", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Street (Location) Address: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Mailing (Legal) Address: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Business/Contact Telephone: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Business/Contact Email: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Business Fax #: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Customer Service Telephone: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Customer Service Email: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Website/URL: http://_____________________________________", 15, yPosition);
  yPosition += 10;

  // Section 3: Authorized Contact
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("3. Authorized Contact", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Full Name: ______________________________________", 15, yPosition);
  yPosition += 10;

  // Section 4: Equipment / Software
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("4. Equipment / Software", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Terminal/Gateway Used (e.g., VX 520, Authorize.net, NMI): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Shopping Cart (if applicable): _____________________", 15, yPosition); yPosition += 5;
  doc.text("If using Shopify, request Authorize.net Gateway.", 15, yPosition);
  yPosition += 10;

  // Section 5: Business Location
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("5. Business Location", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Number of Employees: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Location Type: ☐ Home/Residential  ☐ Office/Business District  ☐ Storefront", 15, yPosition); yPosition += 5;
  doc.text("Own or Rent: ☐ Own  ☐ Rent", 15, yPosition); yPosition += 5;
  doc.text("Approx. Square Footage: ☐ 0–500 ft²  ☐ 501–2,000 ft²  ☐ 2,001–5,000 ft²  ☐ 5,000+ ft²", 15, yPosition);
  
  // Add a new page for additional sections
  doc.addPage();
  yPosition = 15;

  // Section 6: Principal Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("6. Principal Information", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Full Name: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Ownership %: ___________%  ☐ Check here if additional owners/members have 25%+ equity", 15, yPosition); yPosition += 5;
  doc.text("Title (Owner, CEO, etc.): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Home Telephone: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Date of Birth: ____ / ____ / ______", 15, yPosition); yPosition += 5;
  doc.text("SSN: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Driver's License #: _____________________ Exp Date: ____ / ____ / ______ State: ___________", 15, yPosition); yPosition += 5;
  doc.text("Home Address: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Personal Email: _____________________", 15, yPosition);
  yPosition += 10;

  // Section 7: Bank Settlement Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("7. Bank Settlement Information", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Bank Name: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Contact Name at Bank: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Routing Number: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Account Number: _____________________", 15, yPosition);
  yPosition += 10;

  // Section 8: Business Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("8. Business Description", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Products/Services Sold: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Years in Operation: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Storage Location (if applicable): _____________________", 15, yPosition);
  yPosition += 10;

  // Section 9: Processing Volume
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("9. Processing Volume", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Estimated Total Monthly Volume (All payment types): $__________", 15, yPosition); yPosition += 5;
  doc.text("Visa/Mastercard Volume: $__________", 15, yPosition); yPosition += 5;
  doc.text("American Express Volume: $__________", 15, yPosition); yPosition += 5;
  doc.text("Average Ticket: $__________", 15, yPosition); yPosition += 5;
  doc.text("Highest Ticket: $__________", 15, yPosition);
  
  // Add a third page for remaining sections
  doc.addPage();
  yPosition = 15;
  
  // Section 10: Transaction Method
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("10. Transaction Method (Must Equal 100%)", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("☐ Face-to-Face (Retail): ______%", 15, yPosition); yPosition += 5;
  doc.text("☐ Telephone/Mail/Email (MOTO): ______%", 15, yPosition); yPosition += 5;
  doc.text("☐ Internet (eCommerce): ______%", 15, yPosition);
  yPosition += 10;
  
  // Section 11: Refund / Cancellation Policy
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("11. Refund / Cancellation Policy", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Do you have a refund policy? ☐ Yes ☐ No", 15, yPosition); yPosition += 5;
  doc.text("Policy Type: ☐ Exchange ☐ Store Credit ☐ Refund within 30 days ☐ Other: _____________________", 15, yPosition); yPosition += 5;
  doc.text("Processing History? ☐ Yes ☐ No", 15, yPosition); yPosition += 5;
  doc.text("If yes, attach 3 most recent processing statements.", 15, yPosition); yPosition += 5;
  doc.text("Current/Previous Processor(s): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Previous Terminations? ☐ Yes* ☐ No   If Yes, explain: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Bankruptcies? ☐ Yes* ☐ No   If Yes, explain: ______________________________________", 15, yPosition);
  yPosition += 10;
  
  // Section 12: Business Type
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("12. Business Type", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("B2B (%): _______ B2C (%): _______", 15, yPosition); yPosition += 5;
  doc.text("Seasonal Business? ☐ Yes ☐ No", 15, yPosition); yPosition += 5;
  doc.text("Recurring Payments/Subscriptions? ☐ Yes ☐ No   If yes, specify:", 15, yPosition); yPosition += 5;
  doc.text("______________________________________", 15, yPosition);
  yPosition += 10;
  
  // Section 13: eCommerce / Card-Not-Present
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("13. eCommerce / Card-Not-Present", 15, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Product Purchase Address(es): ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("Who Owns Inventory? ☐ Merchant ☐ Vendor (Drop Ship)", 15, yPosition); yPosition += 5;
  doc.text("Fulfillment Provider(s): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Shopping Cart / CRM Platform(s): _____________________", 15, yPosition);
  
  // Add a fourth page for the remaining fields
  doc.addPage();
  yPosition = 15;
  
  // Continue Section 13
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("How Do Customers Purchase? ☐ In Person ☐ Mail/Phone ☐ Internet ☐ Fax ☐ Other: ___________", 15, yPosition); yPosition += 5;
  doc.text("Call Center Provider(s): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Authorization to Shipment Timeframe: ☐ 0–7 days ☐ 8–14 days ☐ 15–30 days ☐ 30–90 days ☐ 90+ days", 15, yPosition); yPosition += 5;
  doc.text("Delivery Timeframe to Customer: ☐ 0–7 days ☐ 8–14 days ☐ 15–30 days ☐ 30–90 days ☐ 90+ days", 15, yPosition); yPosition += 5;
  doc.text("Chargeback Management System (if any): _____________________", 15, yPosition); yPosition += 5;
  doc.text("Deposits Required? ☐ Yes ☐ No   If Yes, % Required: __________%", 15, yPosition); yPosition += 5;
  doc.text("When is Full Payment Received? ☐ 100% Paid in Advance ☐ 100% Paid on Delivery/Completion", 15, yPosition); yPosition += 5;
  doc.text("Sales Regions: ______________________________________", 15, yPosition); yPosition += 5;
  doc.text("% of International Transactions: _______%", 15, yPosition); yPosition += 5;
  doc.text("Shipping Method: ☐ FedEx ☐ UPS ☐ USPS ☐ Other: ___________", 15, yPosition); yPosition += 5;
  doc.text("Advertising Channels: ☐ Catalog ☐ TV/Radio ☐ Flyers/Direct Mail ☐ Internet ☐ Other: ___________", 15, yPosition); yPosition += 5;
  doc.text("Warranty / Guarantee Provided By: ☐ Merchant ☐ Manufacturer", 15, yPosition);
  
  // If lead data is provided, pre-fill it on an additional page
  if (leadData) {
    doc.addPage();
    yPosition = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pre-filled Business Information', 15, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Add form fields
    const fields = [
      { label: 'Business Name:', value: leadData.businessName || 'N/A' },
      { label: 'Email Address:', value: leadData.email || 'N/A' },
      { label: 'Phone Number:', value: leadData.phone || 'N/A' },
      { label: 'Website:', value: leadData.website || 'N/A' },
      { label: 'Monthly Processing Volume:', value: leadData.processingVolume || 'N/A' }
    ];
    
    fields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${field.label}`, 15, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`${field.value}`, 70, yPosition);
      yPosition += 8;
    });
  }

  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This pre-application form is for informational purposes only. All fields are optional.', 15, 285);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, 285, { align: 'right' });
  }
  
  return doc.output('arraybuffer');
}
